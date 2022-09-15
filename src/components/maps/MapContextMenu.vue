<template>
    <q-menu context-menu >
        <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
                <q-item-section clickable @click="$emit('clearAll')">
                    Clear all stations
                </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
                <q-item-section clickable @click="setStationPosition()">
                    Set station position
                </q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/mapSettings">
                <q-item-section>
                    Settings
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { useStore } from "@/store"
    import { ActionTypes } from "@/enums"

    export default defineComponent({
        name: "MapContextMenu"
        , props: {
            latitude: {
                type: Number
                , requried: false
            }
            , longitude: {
                type: Number
                , requried: false
            }
        }
        , setup() {
            const store = useStore()

            return {
                store
            }
        }
        , methods: {
            setStationPosition() {
                this.store.dispatch(ActionTypes.SET_STATION_LOCATION, { latitude: this.latitude.toFixed(4), longitude: this.longitude.toFixed(4) })
            }
        }
    })
</script>
