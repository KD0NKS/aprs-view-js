<template>
    <div id="map"></div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { defineComponent, onMounted } from 'vue'
    import OSM from 'ol/source/OSM'
    import XYZ from 'ol/source/XYZ'
    import BaseLayer from 'ol/layer/Base'
    import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer'
    import { Feature, Map as OLMap, MapBrowserEvent, View } from 'ol'
    import { fromLonLat, toLonLat } from 'ol/proj'

    const map = null

    export default defineComponent({
        name: 'Map'
        , setup() {
            //const map: OLMap = ref(null)

            onMounted(() => {
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
                            , url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
                        })
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
            })
        }
    })
</script>

<style scoped lang="sass">
#map
    height: 100vh
    width: 100%
</style>
