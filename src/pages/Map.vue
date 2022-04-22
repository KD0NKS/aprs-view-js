<template>
    <div id="map" style="position: relative;">
        <q-dialog v-model="isShowStationInfo">
            <station-feature-card
                :packet="stationInfoPacket"
                :symbol="stationIcon"
                :overlay="stationIconOverlay"
                style="max-width: 50%"
                />
        </q-dialog>

        <map-context-menu v-on:clearAll="clearAllStations()"></map-context-menu>
    </div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { defineComponent, onMounted, ref } from 'vue'
    import { useStore } from '@/store'
    import { NumberUtil, PacketUtil } from '@/utils'

    import OSM from 'ol/source/OSM'
    import Stamen from 'ol/source/Stamen'
    import BaseLayer from 'ol/layer/Base'
    import { Heatmap as HeatmapLayer, Tile as TileLayer, Image } from 'ol/layer'
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
    import { ActionTypes, GetterTypes } from '@/enums'
    import LineString from 'ol/geom/LineString'
    import StationFeatureCard from '@/components/maps/StationFeatureCard.vue'
    import MapContextMenu from '@/components/maps/MapContextMenu.vue'
    import { FeatureSearch } from '@/models/ol/controls/FeatureSearch'
    import { defaults as defaultControls} from 'ol/control'
    import ImageLayer from 'ol/layer/Image'
    import ImageArcGISRest from 'ol/source/ImageArcGISRest'

    const map = null

    export default defineComponent({
    components: { StationFeatureCard, MapContextMenu },
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

            const packets = store.getters[GetterTypes.GET_PACKETS]
            const packetAddedListener = ref(null)
            const packetRemovedListener = ref(null)

            //const map: OLMap = ref(null)

            const stationInfoPacket = ref(null)
            const stationIconOverlay = ref(new APRSSymbol({
                    key: "logo"
                    , value: require('@/assets/radio-tower.png')
                    , name: "Radio Tower"
                    }))

            const stationIcon = ref(new APRSSymbol({
                    key: "logo"
                    , value: require('@/assets/radio-tower.png')
                    , name: "Radio Tower"
                    }))

            return {
                store
                , isShowStationInfo: ref(false)
                , packetUtil
                , genericPointVector
                , mapService
                , mapSettings
                , packets
                , packetAddedListener
                , packetRemovedListener
                , stationPositionVector
                , symbolService
                , trailVector
                , stationIcon
                , stationIconOverlay
                , stationInfoPacket
            }
        }
        , beforeUnmount() {
            this.packets.removeListener('add', this.packetAddedListener)
            this.packets.removeListener('remove', this.packetRemovedListener)
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
                    className: 'stamen-base-layer'
                    , source: new Stamen({
                        layer: 'toner-lite'
                    })
                })
                /*
                , new ImageLayer({
                    source: new ImageArcGISRest({
                        // TODO: Refresh every 2 -5 min... rtfm here: https://nowcoast.noaa.gov/help/#!section=updateschedule
                        url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer'
                        , params: {
                            'LAYERS': '1,3'
                            , 'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Rardar tiles by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                })
                , new ImageLayer({
                    source: new ImageArcGISRest({
                        // TODO: Refresh source every minute
                        url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteoceanhydro_shortduration_hazards_warnings_time/MapServer'
                        , params: {
                            'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Watches and warnings by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                })
                */
                , new VectorLayer({
                    className: 'trail-layer'
                    , declutter: true
                    , minZoom: 8
                    , source: this.trailVector
                })
                , new VectorLayer({
                    className: 'generic-point-layer'
                    , declutter: true
                    , minZoom: 8
                    , source: this.genericPointVector
                })
                , new VectorLayer({
                    className: 'station-position-layer'
                    , declutter: false
                    , minZoom: 8
                    , source: this.stationPositionVector
                })
                , new HeatmapLayer({
                    gradient: [ '#600', '#900', '#C00', '#F00'   ]
                    , maxZoom: 8
                    , source: this.stationPositionVector
                    , weight: '1'
                })
            ]

            const map = new OLMap({
                target: 'map'
                , controls: defaultControls().extend([
                    new FeatureSearch()
                ])
                , layers: layers
                , view: new View({
                    center: fromLonLat([-98.5795, 39.8283]) // Default to center of the US
                    , zoom: 10
                })
            })

            // TODO: force handle nav/map resizing https://quasar.dev/vue-components/resize-observer

            // display popup on click
            map.on('singleclick', async (evt) => {
                // TODO: This seems to be getting the one on the bottom of the pile
                var feature = _.filter(map.getFeaturesAtPixel(evt.pixel), f => f.getGeometry().getType() != "LineString")[0]

                // Prevent trying to fetch data if a trail is clicked
                if(feature && feature.getGeometry().getType() != "LineString") {
                    let pkt = this.store.getters[GetterTypes.GET_PACKET](feature.getId())
                    const icon = this.symbolService.GetAPRSSymbol(pkt.symbolcode, pkt.symboltable)
                    this.stationIcon = ref(icon['symbol'])
                    this.stationIconOverlay = ref(icon['overlay'])

                    this.stationInfoPacket = pkt as aprsPacket
                    this.isShowStationInfo = true
                }

                return
            })

            this.packetAddedListener = this.packets.on('add', (packet) => {
                if(packet.alive == null || packet.alive == true) {
                    this.addPacket(packet, this.mapSettings.isShowTrails)
                } else {
                    // Remove "killed" objects/items
                    _.map(
                        _.compact(
                            _.filter(
                                this.stationPositionVector.getFeatures()
                                , f =>
                                    f.get('label') == packet.itemname || f.get('label') == packet.objectname
                                )
                        )
                        , f => {
                            try {
                                if(f != undefined)
                                    this.stationPositionVector.removeFeature(f)

                                // TODO: remove the entire trail... assume it won't be used again
                                const trail = this.trailVector.getFeatureById(packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                                if(trail && trail != undefined)
                                    this.trailVector.removeFeature(trail)
                            } catch(e) {
                                console.log(`Failed to add packet: ${e}`)
                            }
                        }
                    )
                }
            })

            this.packetRemovedListener = this.packets.on('remove', (packet) => {
                this.removePoints(this.genericPointVector, [ packet.id ])
                this.removePoints(this.stationPositionVector, [ packet.id ])
            })

            this.$nextTick(function() {
                this.loadMapData()
            })

            return
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
            , async clearAllStations() {
                this.store.dispatch(ActionTypes.REMOVE_PACKETS, _.reduce(this.genericPointVector.getFeatures(), (result, value) => {
                    result.push((value as Feature<Geometry>).getId())
                    return result
                }, []))

                this.store.dispatch(ActionTypes.REMOVE_PACKETS, _.reduce(this.stationPositionVector.getFeatures(), (result, value) => {
                    result.push((value as Feature<Geometry>).getId())
                    return result
                }, []))

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
            , getAllLocationPackets(): aprsPacket[] {
                return _.compact(
                    _.sortBy(
                        _.filter(this.store.getters[GetterTypes.GET_PACKETS], (p) => {
                            return this.packetUtil.isValidPacket(p)
                                && (new Date().getTime() - p.receivedTime) < (this.mapSettings.pointLifetime * 60000)
                                && (p.latitude != null && p.latitude != undefined)
                                && (p.longitude != null && p.longitude != undefined)
                        })
                        , p => (p as aprsPacket).receivedTime
                    )
                )
            }
            , async loadMapData() {
                for(const p of this.getAllLocationPackets()) {
                    await this.addPacket(p, true)
                }

                return
            }
            , async removePoints(vector: VectorSource<Geometry>, ids?: number[] | string[]): Promise<void> {
                if(ids != null && ids.length > 0) {
                    const toRemove = _.compact(_.filter(vector.getFeatures(), (f) => _.indexOf(ids, f.getId()) > -1))

                    if(toRemove != null && toRemove.length > 0) {
                        _.map(toRemove, f => {
                            if(f != undefined) {
                                vector.removeFeature(f)

                                this.generateTrail(f.get('label'))

                                f.dispose()
                                f = null
                            }
                        })

                        return
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