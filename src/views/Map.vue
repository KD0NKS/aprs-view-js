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
        
        <l-circle-marker
            v-for="l in locations"
            :key="l.callsign"
            :lat-lng="l[0].latLng"
            />
    </l-map>
</template>



<script lang="ts">
    
    import { Component, Vue } from 'vue-property-decorator'
    import { LMap, LTileLayer, LMarker, LCircleMarker } from 'vue2-leaflet'
    import { mapState } from 'vuex'
    import { aprsPacket } from 'js-aprs-fap'
    import { latLng } from 'leaflet'
    import StringUtil from '@/utils/StringUtil'
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

        }
    })
    export default class Map extends Vue {
        private aprsPackets!: Array<aprsPacket>
        private connectionService!: ConnectionService
        public locations = {}

        // base layer properties - only 1
        private attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        private center = [39, -94]
        private url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
        
        // map properties
        private zoom = 12

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
                if(this.locations[packet.sourceCallsign]) {
                    this.locations[packet.sourceCallsign].unshift(
                        {
                            callsign: packet.sourceCallsign
                            , latLng: [ packet.latitude, packet.longitude ]
                        }
                    )
                } else {
                    this.$set(this.locations, packet.sourceCallsign, [
                        {
                            callsign: packet.sourceCallsign
                            , latLng: latLng(packet.latitude, packet.longitude)
                        }
                    ])
                }
            }
        }
    }
</script>
