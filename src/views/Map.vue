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
            v-for="marker in stationMarkers"
            :key="marker.callsign"
            :lat-lng="marker[0].latLng"
        >
        </l-circle-marker>
    </l-map>
    <!--<div id="mapDiv" class="map" style="width: 100%; height: 100%"></div>-->
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { LMap, LTileLayer, LMarker, LCircleMarker } from 'vue2-leaflet'
    import { mapState } from 'vuex'
    import { aprsPacket } from 'js-aprs-fap'

    import 'leaflet/dist/leaflet.css'

    /**
     * Note: only 1 base layer is allowed
     */
    @Component({
        computed: {
            ...mapState({
                aprsPackets: 'aprsPackets'
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

        // map properties
        private attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        private center = [39, -94]
        private url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
        
        // base layer properties - only 1
        private tileLayer = null
        private zoom = 12

        /*
         * TODO: Trails
         * - reduce to first item having a custom/rotated icon with all other points having geojson trail and generic dot
         * - each packet needs a unique identifier
         */

        private get stationMarkers() {
            let retVal = this.aprsPackets
                    .filter(packet => packet.sourceCallsign !== null && packet.sourceCallsign !== undefined
                        && packet.latitude !== undefined && packet.latitude !== undefined
                        && packet.longitude !== undefined && packet.longitude !== null
                        )
                    .map(p => (
                        { 
                            callsign: p.sourceCallsign
                            , latLng: [ p.latitude, p.longitude ]
                        }
                    ))
                    .reverse()
                    .reduce((r, a) => {
                        r[a.callsign] = [...r[a.callsign] || [], a]
                        return r
                    }, {})

            console.log(Object.keys(retVal).length)
            return retVal
        }
    }
</script>
