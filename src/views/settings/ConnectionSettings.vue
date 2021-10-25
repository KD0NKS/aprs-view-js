<template>
    <div class="connectionSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Connection Settings</h1>
        </div>

        <v-expansion-panels v-for="(item, name) in connections" :key="name">
            <ConnectionItem :connection="item"
                    v-on:deleteConnection="deleteConnection"
                    v-on:saveConnection="saveConnection"
                    >
            </ConnectionItem>
        </v-expansion-panels>

        <div style="center">
            <v-btn text @click="addConnection"><v-icon>mdi-plus</v-icon> Add Connection</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import * as crypto from "crypto"
    import { Component, Vue } from 'vue-property-decorator'
    import ConnectionItem from "@/components/settings/connections/ConnectionItem.vue"
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'

    @Component({
        components: { ConnectionItem }
    })
    export default class ConnectionSettings extends Vue {
        get connections() {
            return this.$store.state.connectionService.getConnections();
        }

        addConnection(): void {
            let newConnection = new ConnectionViewModel()
            newConnection.id = crypto.randomBytes(16).toString('hex')
            newConnection.name = "Default"
            newConnection.connectionType = 'IS_SOCKET'
            newConnection.host = "rotate.aprs2.net"
            newConnection.port = 14580
            newConnection.filter = "r/39.00/-91.00/1000"

            this.$store.state.connectionService.addConnection(newConnection)
        }

        deleteConnection(connectionId): void {
            this.$store.state.connectionService.deleteConnection(connectionId)
        }

        saveConnection(connection: ConnectionViewModel): void {
            this.$store.state.connectionService.updateConnection(connection)
        }
    }
</script>
