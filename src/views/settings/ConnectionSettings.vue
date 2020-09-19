<template>
    <div class="connectionSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Connection Settings <v-btn icon @click="addConnection"><v-icon>mdi-plus</v-icon></v-btn></h1>
        </div>

        <v-expansion-panels v-for="(item, name) in connections" :key="name">
            <ConnectionItem :item="item"></ConnectionItem>
        </v-expansion-panels>
    </div>
</template>

<script type="ts">
import store from "@/store";
import ActionTypes from '@/ActionTypes';
import { ConnectionManager } from "js-aprs-engine";
import ConnectionItem from "@/components/settings/ConnectionItem";

export default {
    data: () => ({})
    , components: {
        ConnectionItem
    }
    , computed: {
        connections() {
            return ConnectionManager.getConnections();
        }
    }
    , methods: {
        addConnection() {
            store.dispatch(ActionTypes.ADD_CONNECTION, {
                name: "Default",
                connectionType: "IS_SOCKET",
                uri: "rotate.aprs2.net",
                port: "14580",
                isEnabled: false,
                filter: "r/39.00/-91.00/1000"
            })
        }
    }
}
</script>