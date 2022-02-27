<template>
    <div id="map"></div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { defineComponent, onMounted } from 'vue'
    import OSM from 'ol/source/OSM'
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
                    new TileLayer({
                        source: new OSM()
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
    widows: 100%
</style>
