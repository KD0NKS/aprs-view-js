<template>
    <div id="mapDiv" class="map" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
    import 'leaflet/dist/leaflet.css';

    import { Component, Vue } from 'vue-property-decorator'
    import * as L from 'leaflet'
    import store from '@/store'

    @Component({})
    export default class Map extends Vue {
        private map = null
        private tileLayer = null
        
        private mounted(): void {
            this.map = L.map('mapDiv').setView([39, -94], 12)

            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            )

            this.tileLayer.addTo(this.map)
        }

        private get stationPoints() {
            store.state.aprsPackets.forEach(p => {
                //const point = new L.Point(p.latitude, p.longitude)

                console.log(p)
            })

            return null;
        }
    }
</script>