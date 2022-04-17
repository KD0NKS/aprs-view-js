<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useStore } from '@/store'
    import { Dark, LocalStorage } from 'quasar'

    import _ from 'lodash'

    import { ActionTypes, StorageKeys } from '@/enums'
    import { IConnection, ISConnection, TNCConnection } from '@/models/connections'

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
                const softwareSettings = LocalStorage.getItem(StorageKeys.SOFTWARE_SETTINGS)
                $store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, softwareSettings)

                if(softwareSettings != null && softwareSettings['isDarkMode'] != null) {
                    Dark.set(softwareSettings['isDarkMode'])
                }
            } catch {
                console.log('Could not load software settings.')
            }

            try {
                $store.dispatch(ActionTypes.SET_STATION_SETTINGS, LocalStorage.getItem(StorageKeys.STATION_SETTINGS))
            } catch {
                console.log('Could not load station settings.')
            }

            try {
                _.each(_.filter(LocalStorage.getAllKeys(), x => x.startsWith('connection')), x => {
                    let settings = LocalStorage.getItem(x) as IConnection
                    let connection = null

                    if(settings.connectionType == 'IS_SOCKET') {
                        connection = new ISConnection(settings)
                    } else if(settings.connectionType == 'SERIAL_TNC') {
                        connection = new TNCConnection(settings)
                    }
                    // TODO: Throw error if neither of these

                    if(connection != null) {
                        $store.dispatch(ActionTypes.ADD_CONNECTION, connection)
                    }
                })

            } catch(e: any) {
                console.log(`Could not load connections.\r ${e}`)
            }
        }
    })
</script>
