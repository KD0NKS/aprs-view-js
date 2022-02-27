<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from '@/store'
    import { LocalStorage } from 'quasar'

    import { ActionTypes, StorageKeys } from '@/enums'

    export default defineComponent({
        name: 'App',
        setup() {
            const $store = useStore()

            try {
                $store.dispatch(ActionTypes.SET_MAP_SETTINGS, LocalStorage.getItem(StorageKeys.MAP_SETTINGS))
            } catch {
                console.log('Could not load map settings.')
            }

            try {
                $store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, LocalStorage.getItem(StorageKeys.SOFTWARE_SETTINGS))
            } catch {
                console.log('Could not load software settings.')
            }

            try {
                $store.dispatch(ActionTypes.SET_STATION_SETTINGS , LocalStorage.getItem(StorageKeys.STATION_SETTINGS))
            } catch {
                console.log('Could not load station settings.')
            }
        }
    })
</script>
