<template>
    <div id="map">
        <v-dialog id="stationInfoDialog" justify="center" scrollable max-width="50%" v-model="isShowStationInfo">
            <StationFeatureCard :packet='stationInfoPacket' v-on:close="isShowStationInfo = false" />
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
    import 'ol/ol.css'

    import * as _ from 'lodash'
    import { aprsPacket } from 'js-aprs-fap'
    import { Feature, Map as OLMap, MapBrowserEvent, View } from 'ol'
    import Point from 'ol/geom/Point'
    import { Image as ImageLayer, Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer'
    import BaseLayer from 'ol/layer/Base'
    import VectorLayer from 'ol/layer/Vector'
    import { fromLonLat, fromLonLat as lngLat } from 'ol/proj'
    import OSM from 'ol/source/OSM'
    import VectorSource from 'ol/source/Vector'
    import { Style, Fill, Stroke, Text } from 'ol/style'
    import Icon from 'ol/style/Icon'
    import { APRSSymbolService, ConnectionService } from '@/services'
    import { NumberUtil, StringUtil } from '@/utils'
    import { Component, Vue } from 'vue-property-decorator'
    import { mapState } from 'vuex'
    import { APRSSymbol } from '@/models'
    import GetterTypes from '@/GetterTypes'
    import MapContextMenu from '@/components/maps/MapContextMenu.vue'
    import StationFeatureCard from '@/components/maps/StationFeatureCard.vue'
    import { bus } from '@/main'
    import { BusEventTypes } from '@/enums'
    import store from '@/store'
    import ActionTypes from '@/ActionTypes'

    /**
     * Note: only 1 base layer is allowed
     * TODO: aprspacket to computed, reduce, and filtered:  mapState(['aprsPackets'])
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
            })
        }
    })
    export default class Map extends Vue {
        private aprsPackets!: Array<aprsPacket>
        private connectionService!: ConnectionService
        private contextMenu: boolean = false
        private contextMenuX: number = 0
        private contextMenuY: number = 0
        private symbolService: APRSSymbolService
        private vl: VectorLayer
        private vectorSource: VectorSource
        private isShowStationInfo: boolean = false
        private stationInfoPacket: string = ''
        private map: OLMap

        constructor() {
            super()

            this.symbolService = new APRSSymbolService()
            this.vectorSource = new VectorSource({})
        }

        async mounted() {
            const layers: BaseLayer[] = [
                new TileLayer({
                    source: new OSM()
                })
                , new VectorLayer({
                    source: this.vectorSource
                    , minZoom: 8
                })
                , new HeatmapLayer({
                    source: this.vectorSource
                    , maxZoom: 8
                    , weight: '1'
                    , gradient: [ '#600', '#900', '#C00', '#F00'   ]
                })
            ]

            this.map = new OLMap({
                target: 'map'
                , layers: layers
                , view: new View({
                    center: lngLat([-98.5795, 39.8283]) // Default to center of the US
                    , zoom: 10
                })
            })

            // display popup on click
            this.map.on('singleclick', async (evt) => {
                var feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    return feature
                })

                if(feature) {
                    let pkt = await this.$store.getters[GetterTypes.GET_PACKET](feature.get('name'))

                    this.stationInfoPacket = pkt
                    this.isShowStationInfo = true
                }
            })

            // Adds a right click/contextmenu listener to the map
            this.map.addEventListener('contextmenu', (evt: MapBrowserEvent) => {
                if(evt?.originalEvent && (evt?.originalEvent as MouseEvent).clientX) {
                    this.contextMenuX = (evt?.originalEvent as MouseEvent).clientX
                }

                if(evt?.originalEvent && (evt?.originalEvent as MouseEvent).clientY) {
                    this.contextMenuY = (evt?.originalEvent as MouseEvent).clientY
                }

                this.contextMenu = true
                return true
            })

            /*
            this.vectorSource.addFeatures(this.aprsPackets.reduce((accumulator: any, currentValue: aprsPacket) => {
                return [...accumulator, this.generateFeature(currentValue)]
            }, []))
            */
            this.connectionService.on('packet', async (p) => {
                this.addPacket(p)
            })

            /*
            _.filter(this.aprsPackets, (p) => new Date().getTime() - p.receivedTime < (30 * 60000)).forEach(async (p) => {
                        if(new Date().getTime() - p.receivedTime < (30 * 60000))
                            this.addPacket(p)
                    })
            */

            bus.$on(BusEventTypes.PACKETS_REMOVED, (data) => {
                _.each(this.vectorSource.getFeatures().filter(f => _.indexOf(data, f.get('name')) > 0), f => this.removeFeature(f))
            })

            _.each(_.filter(this.aprsPackets, (p) => new Date().getTime() - p.receivedTime < (30 * 60000)),
                    async (p) => {
                        if(new Date().getTime() - p.receivedTime < (30 * 60000))
                            this.addPacket(p)
                    })
        }

        // contextMenu actions
        private closeContextMenu(): void {
            this.contextMenu = false
        }

        private clearAllStations(): void {
            // Hack for a much more complex problem...
            this.$store.dispatch(ActionTypes.REMOVE_PACKETS, this.vectorSource.getFeatures().map(f => f.get('name')))
        }

        // icon generation stuffz
        private async addPacket(packet: aprsPacket) {
            if(!StringUtil.IsNullOrWhiteSpace(packet.sourceCallsign)
                    && packet.latitude && packet.latitude != null && packet.latitude != undefined
                    && packet.longitude && packet.longitude != null && packet.longitude != undefined) {

                // programatically set the property on the locations object to be reactive
                if(!StringUtil.IsNullOrWhiteSpace(packet.sourceCallsign)
                        && packet.latitude && packet.latitude != null && packet.latitude != undefined
                        && packet.longitude && packet.longitude != null && packet.longitude != undefined) {
                    const feature = new Feature({
                        geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                        , name: packet.id
                    })

                    feature.setId(packet.sourceCallsign)
                    feature.setProperties({
                        name: packet.id
                        , label: packet.sourceCallsign
                    })

                    const styles = this.generateIcon(packet)
                    feature.setStyle(await styles)

                    const existingFeature = this.vectorSource.getFeatureById(packet.sourceCallsign)
                    if(existingFeature) {
                        this.vectorSource.removeFeature(existingFeature)
                    }

                    this.vectorSource.addFeature(feature)
                }
            }
        }

        private async removeFeature(feature: Feature) {
            this.vectorSource.removeFeature(feature)
        }

        private async generateIcon(packet: aprsPacket) {
            const symbols = this.symbolService.GetAPRSSymbol(packet.symbolcode, packet.symboltable)
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

            if(store.state.mapSettings?.isShowLabels === true) {
                shadowStyle.setText(
                    new Text({
                        text: packet.sourceCallsign
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
                        ,
                    })
                )
            }

            retVal.push(shadowStyle)

            if(overlay != null && overlay != undefined) {
                const overlayStyle = new Style({
                    zIndex: 1
                    , text: new Text({
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
    }
</script>
<style scoped lang="sass">
#map
    width: 100%
    height: 100vh
</style>
