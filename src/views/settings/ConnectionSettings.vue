<template>
    <div class="connectionSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Connection Settings <v-btn icon @click="addConnection"><v-icon>mdi-plus</v-icon></v-btn></h1>
        </div>

        <v-expansion-panels v-for="(item, name) in connections" :key="name">
            <ConnectionItem :connection="item" v-on:enableConnection="enableConnection"></ConnectionItem>
        </v-expansion-panels>
    </div>
</template>

<script type="ts">
import ConnectionItem from "@/components/settings/ConnectionItem";
import store from '@/store'
import { Connection } from '@/models/Connection';
import ActionTypes from '@/ActionTypes';

export default {
    data: () => ({})
    , components: {
        ConnectionItem
    }
    , computed: {
        connections() {
            return store.state.connectionService.getConnections();
        }
    }
    , methods: {
        addConnection() {
            store.dispatch(ActionTypes.ADD_CONNECTION, new Connection({
                name: "Default",
                connectionType: 'IS_SOCKET',
                host: "rotate.aprs2.net",
                port: 14580,
                isEnabled: false,
                filter: "r/39.00/-91.00/1000"
            }))
        }, enableConnection(event) {
            console.log('test')
            console.log(event)
        }
    }
}
</script>