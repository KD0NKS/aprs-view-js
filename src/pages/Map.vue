<template>
    <div id="map"></div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { defineComponent, onMounted, ref } from 'vue'
    import { useStore } from '@/store'
    import { NumberUtil, PacketUtil } from '@/utils'

    import OSM from 'ol/source/OSM'
    import XYZ from 'ol/source/XYZ'
    import BaseLayer from 'ol/layer/Base'
    import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer'
    import { Feature, Map as OLMap, MapBrowserEvent, View } from 'ol'
    import { fromLonLat, toLonLat } from 'ol/proj'
    import { aprsPacket } from 'js-aprs-fap'
    import Point from 'ol/geom/Point'
    import Geometry from 'ol/geom/Geometry'
    import _ from 'lodash'
    import { APRSSymbolService, MapService } from '@/services'
    import VectorSource from 'ol/source/Vector'
    import { APRSSymbol } from '@/models'
    import { Style, Fill, Stroke, Text, Icon } from 'ol/style'
    import VectorLayer from 'ol/layer/Vector'
    import { GetterTypes } from '@/enums'
    import LineString from 'ol/geom/LineString'

    const map = null
    let packetListener = null

    export default defineComponent({
        name: 'Map'
        , setup() {

            const store = useStore()

            const packetUtil: PacketUtil = new PacketUtil()
            const mapService = new MapService()
            const mapSettings = store.getters[GetterTypes.MAP_SETTINGS]

            const genericPointVector: VectorSource<Geometry> = new VectorSource({})
            const stationPositionVector: VectorSource<Geometry> = new VectorSource({})
            const symbolService: APRSSymbolService = new APRSSymbolService()
            const trailVector: VectorSource<Geometry> = new VectorSource({})
            //const map: OLMap = ref(null)

            return {
                packetUtil
                , genericPointVector
                , mapService
                , mapSettings
                , stationPositionVector
                , symbolService
                , trailVector
            }
        }
        , beforeUnmount() {
            packetListener()
        }
        , async mounted() {
            const layers: BaseLayer[] = [
                //new TileLayer({
                //    className: 'osm-base-layer'
                //    , source: new OSM({
                //        attributions: [
                //            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                //        ]
                //        , cacheSize: 100
                //    })
                //})
                new TileLayer({
                    source: new XYZ({
                        attributions: [
                            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                        ]
                        , url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
                    })
                })
                , new VectorLayer({
                    source: this.trailVector
                    , minZoom: 8
                })
                , new VectorLayer({
                    source: this.genericPointVector
                    , minZoom: 8
                })
                , new VectorLayer({
                    source: this.stationPositionVector
                    , minZoom: 8
                })
                , new HeatmapLayer({
                    source: this.stationPositionVector
                    , maxZoom: 8
                    , weight: '1'
                    , gradient: [ '#600', '#900', '#C00', '#F00'   ]
                })
            ]

            const map = new OLMap({
                target: 'map'
                , layers: layers
                , view: new View({
                    center: fromLonLat([-98.5795, 39.8283]) // Default to center of the US
                    , zoom: 10
                })
            })

            await this.addPacket({
                "id": "97147565-e4ba-4767-823d-3dc7cc964b3e",
                "alive": true,
                "body": ";146.61-Ja*111111z3558.31N/09310.57WrWB5CYX 146.61- No PL",
                "comment": "WB5CYX 146.61- No PL",
                "destCallsign": "APRX29",
                "digipeaters": [
                    {
                        "callsign": "TCPIP",
                        "wasDigipeated": true
                    },
                    {
                        "callsign": "qAC",
                        "wasDigipeated": false
                    },
                    {
                        "callsign": "T2STRAS",
                        "wasDigipeated": false
                    }
                ],
                "format": "uncompressed",
                "header": "WB5CYX-1>APRX29,TCPIP*,qAC,T2STRAS",
                "latitude": 35.971833333333336,
                "longitude": -93.17616666666666,
                "objectname": "146.61-Ja",
                "origpacket": "WB5CYX-1>APRX29,TCPIP*,qAC,T2STRAS:;146.61-Ja*111111z3558.31N/09310.57WrWB5CYX 146.61- No PL",
                "posambiguity": 0,
                "posresolution": 18.52,
                "receivedTime": 1647697592627,
                "sourceCallsign": "WB5CYX-1",
                "symbolcode": "r",
                "symboltable": "/",
                "timestamp": 1646997060,
                "type": "object"
            }, true)

            packetListener = global.connectionService.getPacketStream((packet) => {
                this.addPacket(packet, true)
            })
        }
        , methods: {
            async addPacket(packet: aprsPacket, isGenerateTrail: boolean) {
                if(this.packetUtil.isValidPacket(packet) == true) {
                    // TODO: For some reason this doesn't work on initial load
                    let existingFeatures = await _.filter(this.stationPositionVector.getFeatures(), f => {
                        return (f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign))
                                        && f.get('receivedTime') <= packet.receivedTime
                    })

                    var mostRecentTime = await _.max(_.reduce(existingFeatures, (result, value) => {
                        result.push(value.get('receivedTime'))
                        return result
                    }, []))

                    const symbols = await this.symbolService.GetAPRSSymbol(packet.symbolcode, packet.symboltable)
                    const styles = await this.generateIcon(packet, symbols)
                    // if no existing features || received time > all existing features
                    if((!mostRecentTime || mostRecentTime == null) || packet.receivedTime > mostRecentTime) {
                        // programatically set the property on the locations object to be reactive
                        let feature = new Feature({
                            geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                        })

                        feature.setId(packet.id)
                        feature.setProperties({
                            name: packet.sourceCallsign
                            , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                            , receivedTime: packet.receivedTime
                        })

                        feature.setStyle(await styles)
                        await this.stationPositionVector.addFeature(feature)
                    }

                    if(symbols['symbol'].isMovable == true) {
                        await this.addGenericPoint(packet)

                        if(isGenerateTrail == true) {
                            this.generateTrail(packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                        }
                    } else {
                        const genericPointIds = _.compact(
                            _.reduce(
                                _.filter(
                                    this.genericPointVector.getFeatures()
                                    , f => {
                                        return f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                                    }
                                )
                                , (result, value) => {
                                    result.push((value as Feature<Geometry>).getId())
                                    return result
                                }
                                , []
                            )
                        )

                        if(genericPointIds && genericPointIds != null && genericPointIds.length > 0) {
                            this.removePoints(this.genericPointVector, genericPointIds)
                        }
                    }

                    if(existingFeatures && existingFeatures != undefined && existingFeatures != null && existingFeatures.length > 0) {
                        _.map(existingFeatures, f => {
                            if(f != undefined) {
                                this.stationPositionVector.removeFeature(f)
                                return
                            }
                        })
                    }
                }

                return
            }
            , async addGenericPoint(packet: aprsPacket): Promise<void> {
                if(this.mapSettings.isShowTrails == true) {
                    let feature = new Feature({
                        geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                    })

                    feature.setId(packet.id)
                    feature.setProperties({
                        name: packet.sourceCallsign
                        , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                        , receivedTime: packet.receivedTime
                    })

                    feature.setStyle(MapService.oldPositionStyle)
                    this.genericPointVector.addFeature(feature)
                }

                return
            }
            , async generateIcon(packet: aprsPacket, symbols: any) {
                const symbol = symbols['symbol'] as APRSSymbol
                const overlay = symbols['overlay'] as APRSSymbol
                const retVal = new Array<Style>()

                let course = 0
                let scaleX = 1 // -1 will flip the image: https://github.com/openlayers/openlayers/pull/11037

                if(packet.course && symbol.isRotatable == true) {
                    course = NumberUtil.degToRad(packet.course - 90)

                    if(packet.course > 180) {
                        scaleX = -1
                    }
                }

                const shadowStyle = new Style({
                    image: new Icon({
                        src: symbol.value
                        , rotation: course
                        , scale: [ 1, scaleX ]  // determines whether or not to flip the icon keeping a 1:1 scale
                        , size: [ 24, 24 ]
                    })
                })

                if(this.mapSettings?.isShowLabels === true) {
                    shadowStyle.setText(
                        new Text({
                            text: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                            , fill: MapService.blackTextFill
                            , stroke: MapService.whiteTextStroke
                            , offsetX: 10
                            , offsetY: -15
                            , font: 'bold 12px/1 Verdana'
                            , textAlign: 'left'
                        })
                    )
                }

                retVal.push(shadowStyle)

                if(overlay != null && overlay != undefined) {
                    const overlayStyle = new Style({
                        text: new Text({
                            text: packet.symboltable
                            , fill: MapService.whiteTextFill
                            , stroke: MapService.blackTextStroke
                            , font: 'normal 16px/1 Verdana'
                            , textAlign: 'center'
                        })
                    })

                    retVal.push(overlayStyle)
                }

                return retVal
            }
            , async generateTrail(label: string) {
                if(this.mapSettings.isShowTrails == true) {
                    //TODO: force this to be serial processing? https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971
                    const coords = _.reduce(
                        _.sortBy(
                            _.compact(
                                _.filter(this.genericPointVector.getFeatures(), f => {
                                    return (f.get('label') == label)
                                })
                            )
                            , f => f.get('receivedTime')
                        )
                        , (result, value) => {
                            result.push(value.getGeometry()["flatCoordinates"])
                            return result
                        }
                        , []
                    )

                    if(coords != null) {
                        const trail = this.trailVector.getFeatureById(label)

                        if(trail != null) {
                            (trail.getGeometry() as LineString).setCoordinates(coords)
                        } else {
                            const ls = new LineString(coords)

                            let f = new Feature({
                                geometry: ls
                            })

                            f.setId(label)
                            f.setStyle(this.mapService.getTrailStyle()) // get a random trail style/color

                            this.trailVector.addFeature(f)
                        }
                    }
                }

                return
            }
        }
    })
</script>

<style scoped lang="sass">
#map
    height: 100vh
    width: 100%
</style>
