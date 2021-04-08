<template>
    <div id="map">
    </div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { aprsPacket } from 'js-aprs-fap'
    import { Feature, Map as OLMap, View } from 'ol'
    import Point from 'ol/geom/Point'
    import { Image as ImageLayer, Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer'
    import BaseLayer from 'ol/layer/Base'
    import { fromLonLat, fromLonLat as lngLat } from 'ol/proj'
    import VectorLayer from 'ol/layer/Vector'
    import OSM from 'ol/source/OSM'
    import VectorSource from 'ol/source/Vector'
    import { Style, Fill, Stroke, Text } from 'ol/style'
    import Icon from 'ol/style/Icon'
    import { composeCssTransform as CSSTransform } from 'ol/transform'
    import { APRSSymbolService, ConnectionService } from '@/services'
    import { NumberUtil, StringUtil } from '@/utils'
    import { Component, Vue } from 'vue-property-decorator'
    import { mapState } from 'vuex'
    import APRSSymbol from '@/models/APRSSymbol'

    /**
     * Note: only 1 base layer is allowed
     * TODO: aprspacket to computed, reduce, and filtered:  mapState(['aprsPackets'])
     */
    @Component({
        computed: {
            ...mapState({
                aprsPackets: 'aprsPackets'
                , connectionService: 'connectionService'
            })
        }
    })
    export default class Map extends Vue {
        private aprsPackets!: Array<aprsPacket>
        private connectionService!: ConnectionService
        private symbolService: APRSSymbolService
        private vectorSource: VectorSource

        constructor() {
            super()

            this.symbolService = new APRSSymbolService()
            this.vectorSource = new VectorSource({})
        }

        mounted() {
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

            const map = new OLMap({
                target: 'map'
                , layers: layers
                , view: new View({
                    center: lngLat([-94, 39])
                    , zoom: 10
                })
            })

            this.connectionService.on('packet', async (p) => {
                this.addPacket(p)
            })

            this.aprsPackets.forEach(async (p) => {
                this.addPacket(p)
            })
        }

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
                        , name: packet.sourceCallsign
                    })

                    feature.setId(packet.sourceCallsign)

                    const styles = this.generateIcon(packet)
                    feature.setStyle(styles)

                    const existingFeature = this.vectorSource.get(packet.sourceCallsign)
                    if(existingFeature) {
                        this.vectorSource.removeFeature(existingFeature)

                    }

                    this.vectorSource.addFeature(feature)

                    /*
                    // programatically set the property on the locations object to be reactive
                    this.$set(this.locations, packet.sourceCallsign, [
                        this.getLocationData(packet)
                    ])
                    */
                }
            }
        }

        private generateIcon(packet: aprsPacket) {
            const symbols = this.symbolService.GetAPRSSymbol(packet.symbolcode, packet.symboltable)
            const symbol = symbols['symbol'] as APRSSymbol
            const overlay = symbols['overlay'] as APRSSymbol
            const retVal = new Array<Style>()

            let course = 0
            let iconTransform = null

            if(packet.course && symbol.isRotatable == true) {
                if(packet.course <= 180) {
                    course = NumberUtil.degToRad(packet.course - 90)
                } else {
                    course = NumberUtil.degToRad(packet.course - 270)
                    iconTransform = CSSTransform(270, 0, 0, 0, 0, 270, 0)
                }
            }


            const shadowStyle = new Style({
                image: new Icon({
                    src: symbol.value
                    , rotation: course
                    //, transform: iconTransform
                    // todo: size: 24 x 24
                    // todo: transform: https://openlayers.org/en/latest/apidoc/module-ol_transform.html#~Transform
                    //, size: [ 24, 24 ]
                })
                , text: new Text({
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
                })
                , zIndex: 0
            })

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
                        , font: 'normal 14px/1 Verdana'
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
