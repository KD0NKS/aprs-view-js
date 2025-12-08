<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { Dark } from 'quasar'

    import _ from 'lodash'
    import { useConectionStore } from './stores/connectionStore'
    import { usePacketStore } from './stores/packetStore'
    import { useSoftwareSettingsStore } from './stores/softwareSettingsStore'

    import { ConnectionEventTypes } from './enums'
    import { useStationSettingsStore } from './stores/stationSettingsStore'

    export default defineComponent({
        name: 'App',
        setup() {
            const connectionStore = useConectionStore()
            const packetStore = usePacketStore()
            const softwareSettingsStore = useSoftwareSettingsStore()
            const stationSettingsStore = useStationSettingsStore()

            const dataListener = window.connectionService.getDataStream(data => packetStore.addData([ data[0], data[1].toString() ]))
            const packetListener = window.connectionService.getPacketStream(packet => packetStore.addPacket(packet))
            const connectionStatusListener = window.connectionService.getConnectionStatusStream((e, connectionid) => {
                connectionStore.updateConnectionStatus(connectionid, e)
            })

            const packetTimer = null

            Dark.set(softwareSettingsStore.softwareSettings.isDarkMode)

            return {
                connectionStore
                , connectionStatusListener
                , dataListener
                , packetListener
                , packetStore
                , packetTimer
                , stationSettingsStore
            }
        }
        , async mounted() {
            await window.connectionService.updateStationSettings(_.clone(this.stationSettingsStore.stationSettings))

            for(let connection of this.connectionStore.connections) {
                await window.connectionService.addConnection(_.cloneDeep(connection))

                const status = await window.connectionService.getConnectionStatus(connection.id)

                if(status == true) {
                    this.connectionStore.updateConnectionStatus(connection.id, ConnectionEventTypes.CONNECTED)
                } else {
                    this.connectionStore.updateConnectionStatus(connection.id, ConnectionEventTypes.DISCONNECTED)
                }
            }

            if(!this.packetTimer) {
                // Set the interval to the new time
                this.packetTimer = setInterval(
                    () => {
                        this.packetStore.clearOldPackets()
                    }
                    , 60000) // 60000ms per minute
            }

            return
        }
        , async onBeforeUnmount() {
            this.connectionStatusListener()
            this.dataListener()
            this.packetListener()
        }
    })
</script>
