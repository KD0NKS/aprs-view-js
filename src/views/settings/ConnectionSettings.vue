<template>
    <div class="connectionSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Connection Settings <v-btn icon @click="addConnection"><v-icon>mdi-plus</v-icon></v-btn></h1>
        </div>

        <v-expansion-panels v-for="(item, name) in connections" :key="name">
            <ConnectionItem :connection="item"
                    v-on:deleteConnection="deleteConnection"
                    v-on:enableConnection="enableConnection"
                    v-on:saveConnection="saveConnection"
                    >
            </ConnectionItem>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import ConnectionItem from "@/components/settings/connections/ConnectionItem.vue"
    import store from '@/store'
    import { Connection } from '@/models/connections/Connection'
    import ActionTypes from '@/ActionTypes'
    import MutationTypes from '@/MutationTypes'
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'

    @Component({
        components: { ConnectionItem }
    })
    export default class ConnectionSettings extends Vue {
        get connections() {
            return store.state.connectionService.getConnections();
        }

        addConnection(): void {
            store.dispatch(ActionTypes.ADD_CONNECTION, new Connection({
                name: "Default"
                , connectionType: 'IS_SOCKET'
                , host: "rotate.aprs2.net"
                , port: 14580
                , isEnabled: false
                , filter: "r/39.00/-91.00/1000"
            }))
        }

        deleteConnection(connectionId) {
            store.commit(MutationTypes.DELETE_CONNECTION, connectionId)
        }

        enableConnection(event) {
            console.log('test')
            console.log(event)
        }

        saveConnection(connection: ConnectionViewModel) {
            this.$store.commit(MutationTypes.SAVE_CONNECTION, connection)
        }
    }
</script>
