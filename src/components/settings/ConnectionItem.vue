<template>
    <v-expansion-panel>
        <v-expansion-panel-header>{{ displayTitle }} - {{ isConnected }}</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12 md8 class="px-2">
                        <v-text-field label="Name" v-model="item.name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4 class="px-2">
                        <v-select
                            :items="connectionTypeOptions"
                            item-text="name"
                            item-value="id"
                            v-model="displayConnectionType"
                            :readonly="true"
                        ></v-select>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md8 class="px-2">
                        <v-text-field label="URL" v-model="item.host"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4 clsss="px-2">
                        <v-text-field label="Port" v-model="item.port" type="number"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md12 class="px-2">
                        <v-text-field label="Filter" v-model="item.filter"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md12 class="px-2">
                        <v-switch v-model="item.isEnabled" label="Enabled"></v-switch>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script type="ts">
import { ConnectionTypes } from "js-aprs-engine";

export default {
    props: ["item"],
    data: () => ({
        isEditing: false,
        form: {
            name: "",
            connectionType: "IS_SOCKET",
            host: "",
            port: "",
            isEnabled: "",
            filter: ""
        }
        , rules: {
            required: value => !!value || 'Required.'
        }
    }),
    computed: {
        isNew() {
            return false;
        },
        displayTitle() {
            return this.isNew ? "New Connection" : this.item.name;
        },
        isConnected() {
            if(this.item.connection !== null && this.item.connection !== undefined) {
                return this.item.connection.isConnected();
            }

            return false;
        }
        , connectionTypeOptions() {
            let map = [];

            Object.keys(ConnectionTypes).forEach(k => {
                map.push({ id: k, name: ConnectionTypes[k].description });
            });

            return map;
        }
        , displayConnectionType() {
            return Object.keys(ConnectionTypes).find((e) => {
                return ConnectionTypes[e] === this.item.connectionType;
            });
        }
    },
    methods: {
        cancel() {},
        remove() {},
        edit() {},
        reset() {},
        save() {}
    }
};
</script>