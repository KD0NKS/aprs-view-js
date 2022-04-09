<template>
    <div class="q-pa-md">
        <h1>Connection Settings</h1>

        <q-list bordered v-for="(item) in connections" :key="item.id">
            <connection-item :connection="item" />
        </q-list>

        <q-btn flat @click="addConnection"><q-icon name="add" />Add Connection</q-btn>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useStore } from '@/store'
    import { uid } from "quasar"

    import { ActionTypes } from '@/enums'
    import ConnectionItem from '@/components/connections/ConnectionItem.vue'
    import { ISConnection } from '@/models/connections'

    export default defineComponent({
        name: 'ConnectionSettings'
        , setup() {
            const store = useStore()

            const connections = ref(store.state.connections)

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

                this.store.dispatch(ActionTypes.ADD_CONNECTION, newConnection)
            }
        }
    })
</script>
