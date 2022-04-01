<template>
    <q-menu context-menu >
        <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
                <q-item-section>
                    Clear all stations
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

    export default defineComponent({
        name: "MapContextMenu"
    })
</script>
