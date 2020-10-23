<template>
    <v-expansion-panel>
        <v-expansion-panel-header>{{ connection.name }} - {{ isConnected }}</v-expansion-panel-header>
    </v-expansion-panel>

    <!--
    <v-expansion-panel>
        <v-expansion-panel-header>{{ displayTitle }} - {{ isConnected }}</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-form 
                        id="connection-settings-form"
                        @submit.prevent="save"
                        v-model="isValid"
                        >
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                            <v-text-field label="Name" v-model="item.name" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 class="px-2">
                            <v-select
                                :items="connectionTypeOptions"
                                item-text="name"
                                item-value="id"
                                v-model="item.connectionType"
                                :readonly="true"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                            <v-text-field label="URL" v-model="item.host" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 clsss="px-2">
                            <v-text-field label="Port" v-model="item.port" type="number" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md12 class="px-2">
                            <v-text-field label="Filter" v-model="item.filter"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md12 class="px-2">
                            <v-switch v-model="item.isEnabled" v-on:change="(event) => this.$emit('enableConnection', event)" label="Enabled"></v-switch>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12 class="px-2">
                            <v-btn color="primary" class="mr-4" type="submit" :disabled="!isValid" form="connection-settings-form">Save</v-btn>
                            <v-btn color="normal" class="mr-4" @click="reset">Reset</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
    -->
</template>

<script type="ts">
//import { ConnectionTypes } from "js-aprs-engine";

export default {
    props: ["item"]
    , data: () => ({
        connection: ""
    })
    , created() {
        this.connection = this.item
    }
    , computed: {
        isConnected() {
            if(this.item.connection !== null && this.item.connection !== undefined) {
                return this.item.connection.isConnected();
            }

            return false;
        }
    }
}
    /*
    props: ["item"],
    data: () => ({
        isEditing: false
        , isValid: true
        , rules: {
            required: value => !!value || 'Required.'
        }
        , connection: this.item
        , originalName: ""
    })
    , created() {
        this.originalName = this.item.name;
    }
    , computed: {
        isNew() {
            return false;
        },
        displayTitle() {
            return this.isNew ? "New Connection" : this.originalName;
        },
        isConnected() {
            if(this.item.connection !== null && this.item.connection !== undefined) {
                return this.item.connection.isConnected();
            }

            return false;
        }
        , connectionTypeOptions() { // populates the conneciton types menu
            let map = [];

            Object.keys(ConnectionTypes).forEach(k => {
                map.push({ id: k, name: ConnectionTypes[k].description });
            });

            return map;
        }
    },
    methods: {
        cancel() {}
        , remove() {}
        , edit() {}
        , reset() {
            this.item.name = this.originalName;
        }
        , save() {
            this.originalName = this.item.name;
        }
    }
};
*/
</script>