<template>
    <q-page class="q-pa-md">
        <div style="padding-bottom: 10px">
            <span class="text-h4 h4">Connection Settings</span>
        </div>

        <q-list bordered v-for="(item) in connections" :key="item.id" dense>
            <connection-item :connection="item" />
        </q-list>

        <q-btn flat @click="addConnection"><q-icon name="add" />Add Connection</q-btn>
    </q-page>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useConectionStore } from '../../stores/connectionStore'
    import { uid } from "quasar"

    import ConnectionItem from '../../components/connections/ConnectionItem.vue'

    import { ISConnection } from '../../models/connections'

    export default defineComponent({
        name: 'ConnectionSettings'
        , setup() {
            const store = useConectionStore()

            const connections = store.getConnections

            return {
                connections
                , store
            }
        }
        , components: {
            ConnectionItem
        }
        , methods: {
            addConnection(): void {
                let newConnection = new ISConnection()

                newConnection.id = uid()
                newConnection.name = "Default"
                newConnection.connectionType = 'IS_SOCKET'
                newConnection.host = "rotate.aprs2.net"
                newConnection.port = 14580
                newConnection.filter = "r/39.00/-91.00/1000"

                this.store.addConnection(newConnection)
            }
        }
    })
</script>
