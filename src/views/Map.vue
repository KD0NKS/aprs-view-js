<template>
    <l-map id='mapDiv'
            :zoom='zoom'
            :center='center'
            style="height: 100vh"
            >
        <l-tile-layer
                :url="url"
                :attribution="attribution"
                />
                <!-- :token -->

        <l-marker
                v-for="l in locations"
                :key="l.callsign"
                :lat-lng="l[0].latLng"
                :icon="l[0].icon"
                >
        </l-marker>
    </l-map>
</template>



<script lang="ts">

    import { Component, Vue } from 'vue-property-decorator'
    import { LMap, LTileLayer, LMarker, LCircleMarker, LIcon } from 'vue2-leaflet'
    import { mapState } from 'vuex'
    import { aprsPacket } from 'js-aprs-fap'
    import { icon, latLng } from 'leaflet'
    import StringUtil from '@/utils/StringUtil'
    import { APRSSymbolService } from '@/services/APRSSymbolService'
    import { ConnectionService } from '@/services/ConnectionService'

    import 'leaflet/dist/leaflet.css'

    /**
     * Note: only 1 base layer is allowed
     */
    @Component({
        computed: {
            ...mapState({
                aprsPackets: 'aprsPackets'
                , connectionService: 'connectionService'
            })
        }
        , components: {
            LMap
            , LTileLayer
            , LMarker
            , LCircleMarker
            , LIcon
        }
    })
    export default class Map extends Vue {
        private aprsPackets!: Array<aprsPacket>
        private connectionService!: ConnectionService
        public locations = {}
        private symbolService: APRSSymbolService

        // base layer properties - only 1
        private attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        private center = [39, -94]
        private url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'

        // map properties
        private zoom = 12

        // icon properties
        //private iconSize = [ 16 x 16 ]

        constructor() {
            super()

            this.symbolService = new APRSSymbolService()
        }

        mounted() {
            this.connectionService.on('packet', (p) => {
                this.addPacket(p)
            })

            this.aprsPackets.forEach(p => {
                this.addPacket(p)
            })
        }

        private addPacket(packet: aprsPacket) {
            if(!StringUtil.IsNullOrWhiteSpace(packet.sourceCallsign)
                    && packet.latitude && packet.latitude != null && packet.latitude != undefined
                    && packet.longitude && packet.longitude != null && packet.longitude != undefined) {

                // programatically set the property on the locations object to be reactive
                this.$set(this.locations, packet.sourceCallsign, [
                    this.getLocationData(packet)
                ])

            }
        }

        // used by addPacket as a consolidated location to generate a new set of data required to display a station location
        private getLocationData(packet: aprsPacket) {
            try {
                const symbol = this.symbolService.GetAPRSSymbol(packet.symbolcode, packet.symboltable)

                // due to leaflet icon is a keyword
                let tempIcon = null

                if(!symbol['overlay']) {
                    tempIcon = icon({
                        iconUrl: `${symbol['symbol'].value}`
                        , iconSize: [ 24, 24 ]
                    })
                } else {
                    // the alt table icon is the shadow so the overlay is on top of it
                    tempIcon = icon({
                        iconUrl: `${symbol['overlay']?.value}`
                        , shadowUrl: `${symbol['symbol'].value}`
                        , iconSize: [ 24, 24 ]
                        , shadowSize: [ 24, 24 ]
                    })
                }

                return {
                    callsign: packet.sourceCallsign
                    , latLng: latLng(packet.latitude, packet.longitude)
                    , symbolCode: packet.symbolcode
                    , symbolTable: packet.symboltable
                    , icon: tempIcon
                }
            } catch(err) {
                return
            }
        }
    }
</script>
