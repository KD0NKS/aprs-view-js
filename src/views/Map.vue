<template>
    <div id="map">
        <v-dialog id="stationInfoDialog" justify="center" scrollable max-width="50%" v-model="isShowStationInfo">
            <StationFeatureCard
                    :overlay='stationIconOverlay'
                    :packet='stationInfoPacket'
                    :symbol = 'stationIcon'
                    v-on:close="isShowStationInfo = false"
                    />
        </v-dialog>
        <MapContextMenu
            :contextMenu='contextMenu'
            :positionX="contextMenuX"
            :positionY="contextMenuY"
            v-on:close="closeContextMenu()"
            v-on:clearAll="clearAllStations()"
            />
    </div>
</template>

<script lang="ts">
    /*
     * DEVELOPER NOTES:  Sometimes trying to be too fancy is a good thing, too much processing on any given layer can cause severe slowness.
     * It may be better trying to simplify the problem and create multiple layers to achieve what you want to do when dealing with points and lines.
     */

    import 'ol/ol.css'
    import * as _ from 'lodash'
    import { aprsPacket } from 'js-aprs-fap'
    import { Feature, Map as OLMap, MapBrowserEvent, View } from 'ol'
    import Point from 'ol/geom/Point'
    import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer'
    import BaseLayer from 'ol/layer/Base'
    import ImageLayer from 'ol/layer/Image'
    //import ImageWMS from 'ol/source/ImageWMS'
    import ImageArcGISRest from 'ol/source/ImageArcGISRest'
    import VectorLayer from 'ol/layer/Vector'
    import { fromLonLat, toLonLat } from 'ol/proj'
    import OSM from 'ol/source/OSM'
    import VectorSource from 'ol/source/Vector'
    import { Style, Fill, Stroke, Text } from 'ol/style'
    import Icon from 'ol/style/Icon'
    import { APRSSymbolService } from '@/services'
    import { NumberUtil, StringUtil } from '@/utils'
    import { Component, Vue } from 'vue-property-decorator'
    import { mapState } from 'vuex'
    import GetterTypes from '@/GetterTypes'
    import MapContextMenu from '@/components/maps/MapContextMenu.vue'
    import StationFeatureCard from '@/components/maps/StationFeatureCard.vue'
    import { bus } from '@/main'
    import { BusEventTypes } from '@/enums'
    import ActionTypes from '@/ActionTypes'
    import { Coordinate } from 'ol/coordinate'
    import Geometry from 'ol/geom/Geometry'
    import { APRSSymbol, MapSettings } from '@/models'
    import LineString from 'ol/geom/LineString'
    import CircleStyle from 'ol/style/Circle'

    /**
     * Note: only 1 base layer is allowed
     * TODO: aprspacket to computed, reduce, and filtered:  mapState(['aprsPackets'])
     * TODO: Can watch be used somehow to decouple from aprsPacket events? Initial investigation showed the old and new array values were identical
     */
    @Component({
        components: {
            MapContextMenu
            , StationFeatureCard
        }
        , computed: {
            ...mapState({
                aprsPackets: 'aprsPackets'
                , connectionService: 'connectionService'
                , mapSettings: 'mapSettings'
            })
        }
    })
    export default class Map extends Vue {
        private aprsPackets!: Array<aprsPacket>
        private clickCoordinate: Coordinate = []
        private contextMenu: boolean = false
        private contextMenuX: number = 0
        private contextMenuY: number = 0
        private mapSettings!: MapSettings
        private symbolService: APRSSymbolService
        private trailVector: VectorSource<Geometry>
        private genericPointVector: VectorSource<Geometry>
        private stationPositionVector: VectorSource<Geometry>
        private isShowStationInfo: boolean = false
        private stationInfoPacket: string = ''
        private trailStyleIndex = 0
        // Fake vue out and set a default overlay for the info card to make it reactive
        private stationIconOverlay: APRSSymbol = new APRSSymbol({
                    key: "logo"
                    , value: require('@/assets/radio-tower.png')
                    , name: "Radio Tower"
                    })
        // Fake vue out and set a default station icon for the info card to make it reactive
        private stationIcon: APRSSymbol = new APRSSymbol({
                    key: "logo"
                    , value: require('@/assets/radio-tower.png')
                    , name: "Radio Tower"
                    })
        private map: OLMap

        // Enhancement: make trail colors a selectable user configuration?
        private trailStyles: Style[] = _.map([
                  "rgba(125 , 0     , 255   , 0.5)" // purple
                , "rgba(0   , 0     , 255   , 0.5)" // blue
                , "rgba(255 , 0     , 255   , 0.5)" // hot pink-ish
                , "rgba(255 , 0     , 0     , 0.5)" // red
                , "rgba(0   , 225   , 255   , 0.5)" // teal
                , "rgba(255 , 64    , 0     , 0.5)" // orange
                , "rgba(0   , 0     , 102   , 0.5)" // navy
                , "rgba(128 , 0     , 0     , 0.5)" // maroon
                , "rgba(0   , 0     , 0     , 0.5)" // black
            ], c =>
                new Style({
                    stroke : new Stroke({
                        color: c
                        , width: 5
                    })
                })
            )

        private oldPositionStyle: Style = new Style({
            image: new CircleStyle({
                radius: 5
                , fill: new Fill({ color: "red" })
            })
        })

        constructor() {
            super()

            this.genericPointVector = new VectorSource({})
            this.trailVector = new VectorSource({})
            this.symbolService = new APRSSymbolService()
            this.stationPositionVector = new VectorSource({})
        }

        // Stop listening to the bus before destroying the component.
        // Failure to do so will result in n + 1 events being triggered
        // https://stackoverflow.com/questions/41879836/vue-js-method-called-multiple-times-using-emit-and-on-when-it-should-only-be-c
        beforeDestroy () {
            //EventBus.$off('increment', this.incrementCount)
            bus.$off(BusEventTypes.PACKET_ADDED)
            bus.$off(BusEventTypes.PACKETS_REMOVED)
            this.map.dispose()
        }

        async mounted() {
            const layers: BaseLayer[] = [
                new TileLayer({
                    source: new OSM()
                })
                // TODO: These need to be refreshed on an interval
                //, new ImageLayer({
                //    source: new ImageArcGISRest({
                //        url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer'
                //        , params: {
                //            'LAYERS': '1,3'
                //            , 'FORMAT': 'PNG32'
                //        }
                //    })
                //    , opacity: 0.5
                //})
                //, new ImageLayer({
                //    source: new ImageArcGISRest({
                //        url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteoceanhydro_shortduration_hazards_warnings_time/MapServer'
                //        , params: {
                //            'FORMAT': 'PNG32'
                //        }
                //    })
                //    , opacity: 0.5
                //})
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

            this.map = new OLMap({
                target: 'map'
                , layers: layers
                , view: new View({
                    center: fromLonLat([-98.5795, 39.8283]) // Default to center of the US
                    , zoom: 10
                })
            })

            /* NOTE: use this for last location preferences
            this.map.on('moveend', (evt) => {
                console.log(evt)
            })
            */

            // display popup on click
            this.map.on('singleclick', async (evt) => {
                // TODO: This seems to be getting the one on the bottom of the pile
                var feature = _.filter(this.map.getFeaturesAtPixel(evt.pixel), f => f.getGeometry().getType() != "LineString")[0]
                //var feature = _.reverse(
                //        _.filter(this.map.getFeaturesAtPixel(evt.pixel), f => f.getGeometry().getType() != "LineString")
                //    )[0]

                // Prevent trying to fetch data if a trail is clicked
                if(feature && feature.getGeometry().getType() != "LineString") {
                    let pkt = this.$store.getters[GetterTypes.GET_PACKET](feature.getId())
                    const icon = this.symbolService.GetAPRSSymbol(pkt.symbolcode, pkt.symboltable)
                    this.stationIcon = icon['symbol']
                    this.stationIconOverlay = icon['overlay']

                    this.stationInfoPacket = pkt
                    this.isShowStationInfo = true
                }
            })

            // Adds a right click/contextmenu listener to the map
            this.map.addEventListener('contextmenu', (evt: MapBrowserEvent<UIEvent>) => {
                if(evt?.originalEvent && (evt?.originalEvent as MouseEvent).clientX) {
                    this.contextMenuX = (evt?.originalEvent as MouseEvent).clientX
                }

                if(evt?.originalEvent && (evt?.originalEvent as MouseEvent).clientY) {
                    this.contextMenuY = (evt?.originalEvent as MouseEvent).clientY
                }

                this.contextMenu = true

                return true
            })

            bus.$on(BusEventTypes.PACKET_ADDED, async (p: aprsPacket) => {
                if(p.alive == null || p.alive == true) {
                    this.addPacket(p, true)
                } else {
                    // Remove "killed" objects/items
                    const toRemove = _.compact(
                        _.filter(
                            this.stationPositionVector.getFeatures()
                            , f =>
                                f.get('label') == p.itemname || f.get('label') == p.objectname
                            )
                    )

                    if(toRemove != null && toRemove.length > 0) {
                        _.map(toRemove, f => {
                            try {
                                if(f != undefined)
                                    this.stationPositionVector.removeFeature(f)

                                // TODO: remove the entire trail... assume it won't be used again
                                const trail = this.trailVector.getFeatureById(p.itemname ?? p.objectname ?? p.sourceCallsign)
                                if(trail && trail != undefined)
                                    this.trailVector.removeFeature(trail)
                            } catch(e) {
                                console.log(e)
                            }
                        })
                    }
                }
            })

            bus.$on(BusEventTypes.PACKETS_REMOVED, (data: number[] | string[]) => {
                this.removePoints(this.genericPointVector, true, data)

                if(this.mapSettings.isShowTrails == true) {
                    this.removePoints(this.stationPositionVector, true, data)
                }
            });

            await Promise.all(_.map(this.getAllLocationPackets(), async (p) => {
                await this.addPacket(p, false)
                return
            })).then(() => {
                // Get unique non null or empty callsigns, then generate a trail based on callsign
                _.map(
                    _.compact(
                        _.uniq(
                            _.reduce(this.genericPointVector.getFeatures(), (result, value) => {
                                result.push(value.get('label'))
                                return result
                            }, [])
                        )
                    )
                    , c => {
                        // Because adding all the packets runs async, let's clean up the map a little... this is a dirty hack until a better solution is found
                        // 1.  Get the aprs symbol before even processing, then process generic and latest (station) points individually
                        // 2.  Generate trails for all stations regardless of movability, then add only the latest packet to the station position vector
                        let existingFeatures = _.sortBy(
                            _.filter(this.stationPositionVector.getFeatures(), f => {
                                return (f.get('label') == c)
                            })
                            , f => f.get('receivedTime')
                        )

                        var mostRecentTime = _.max(_.reduce(existingFeatures, (result, value) => {
                            result.push(value.get('receivedTime'))
                            return result
                        }, []))

                        _.map(existingFeatures, f => {
                            if(f.get('receivedTime') != mostRecentTime)
                                this.stationPositionVector.removeFeature(f)
                        })

                        // Let's finally generate the trail!
                        this.generateTrail(c)
                        return
                    }
                )
            })
        }

        // contextMenu actions
        private closeContextMenu(): void {
            this.contextMenu = false
            this.stationInfoPacket = null
        }

        private clearAllStations(): void {
            // Hack for a much more complex problem...
            // TODO: There needs to be a clearall packets/data in the store
            this.$store.dispatch(ActionTypes.REMOVE_PACKETS, _.map(this.stationPositionVector.getFeatures(), f => f.getId()))
            this.$store.dispatch(ActionTypes.REMOVE_PACKETS, _.map(this.genericPointVector.getFeatures(), f => f.getId()))
        }

        // icon generation stuffz
        private async addPacket(packet: aprsPacket, isGenerateTrail: boolean): Promise<void> {
            if(this.isValidPacket(packet) == true) {
                // TODO: For some reason this doesn't work on initial load
                let existingFeatures = await _.filter(this.stationPositionVector.getFeatures(), f => {
                    return (f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign))
                                    && f.get('receivedTime') < packet.receivedTime
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

                if(symbols['symbol'].isMovable) {
                    await this.addGenericPoint(packet)

                    if(isGenerateTrail == true)
                        this.generateTrail(packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                } else {
                    const genericPointIds = _.reduce(
                        _.filter(
                            this.genericPointVector.getFeatures()
                            , f => {
                                return f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                            }
                        )
                        , (result, value) => {
                            result.push(value.getId())
                            return result
                        }
                        , []
                    )

                    this.removePoints(this.genericPointVector, isGenerateTrail, genericPointIds)
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

        private async addGenericPoint(packet: aprsPacket): Promise<void> {
            let feature = new Feature({
                geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
            })

            feature.setId(packet.id)
            feature.setProperties({
                name: packet.sourceCallsign
                , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                , receivedTime: packet.receivedTime
            })

            feature.setStyle(this.oldPositionStyle)
            this.genericPointVector.addFeature(feature)

            return
        }

        private async removePoints(vector: VectorSource<Geometry>, isGenerateTrail: boolean, ids?: number[] | string[]): Promise<void> {
            if(ids != null && ids.length > 0) {
                const toRemove = _.compact(_.filter(vector.getFeatures(), (f) => _.indexOf(ids, f.getId()) > -1))

                if(toRemove != null && toRemove.length > 0) {
                    _.map(toRemove, f => {
                        if(f != undefined) {
                            vector.removeFeature(f)

                            if(isGenerateTrail == true) {
                                this.generateTrail(f.get('label'))
                            }
                        }
                    })

                    return
                }
            }

            return
        }

        private async generateTrail(label: string) {
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

                if(coords != undefined) {
                    const trail = this.trailVector.getFeatureById(label)

                    if(trail != undefined) {
                        (trail.getGeometry() as LineString).setCoordinates(coords)
                    } else {
                        const ls = new LineString(coords)

                        let f = new Feature({
                            geometry: ls
                        })

                        f.setId(label)
                        f.setStyle(this.trailStyles[Math.floor(Math.random() * this.trailStyles.length)]) // get a random trail style/color

                        this.trailVector.addFeature(f)
                    }
                }
            }

            return
        }

        private async generateIcon(packet: aprsPacket, symbols: any) {
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
                        , fill: new Fill({
                            color: 'black'
                        })
                        , stroke: new Stroke({
                            color: 'white'
                            , width: 4
                        })
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
                        , fill: new Fill({
                            color: 'white'
                        })
                        , stroke: new Stroke({
                            color: 'black'
                            , width: 2
                        })
                        , font: 'normal 16px/1 Verdana'
                        , textAlign: 'center'
                    })
                })

                retVal.push(overlayStyle)
            }

            return retVal
        }

        private getAllLocationPackets(): aprsPacket[] {
            return _.compact(
                _.sortBy(
                    _.filter(this.aprsPackets, (p) => {
                        return this.isValidPacket(p)
                            && (new Date().getTime() - p.receivedTime) < (this.mapSettings.pointLifetime * 60000)
                    })
                    , p => (p as aprsPacket).receivedTime
                )
            )
        }

        private isValidPacket(packet: aprsPacket) {
            return (packet.latitude && packet.latitude != null && packet.latitude != undefined)
                        && (packet.longitude && packet.latitude != null && packet.longitude != undefined)
                        && StringUtil.IsNullOrWhiteSpace(packet.resultCode)
                        && StringUtil.IsNullOrWhiteSpace(packet.resultMessage)
        }

        private getTrailStyle() {
            if(this.trailStyleIndex >= this.trailStyles.length) {
                this.trailStyleIndex = 0
            }

            return this.trailStyles[this.trailStyleIndex++]
        }
    }
</script>
<style scoped lang="sass">
#map
    width: 100%
    height: 100vh
</style>
