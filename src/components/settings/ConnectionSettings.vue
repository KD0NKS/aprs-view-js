<template>
    <v-expansion-panel>
        <v-expansion-panel-header>Connection Settings</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form id="isConnectionForm"
                    @submit.prevent="saveConnectionInfo"
                    v-model="isValid"
                    >
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                                <v-text-field
                                    label="Name"
                                    v-model="name"
                                    :rules="[rules.required]"
                                    >
                                </v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 class="px-2">
                            <v-select
                                :items="connectionTypeOptions"
                                item-text="name"
                                item-value = "id"
                                v-model="connectionType"
                                :disabled=true
                                >
                            </v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                            <v-text-field
                                label="URL"
                                v-model="uri"
                                :rules="[rules.required]"
                                >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 clsss="px-2">
                            <v-text-field
                                label="Port"
                                v-model="port"
                                type="number"
                                :rules="[rules.required]"
                                >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 class="px-2">
                            <v-switch v-model="isEnabled" label="Enabled"></v-switch>
                            <v-btn color="success" class="mr-4" type="submit" :disabled="!isValid" form="isConnectionForm">Save</v-btn>
                            <v-btn color="error" class="mr-4" @click="resetConnectionInfo">Reset</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script type="ts">
    import store from '../../store';
    import { ConnectionTypeEnum } from 'js-aprs-engine';
    
    export default {
        data: () => ({
            name: 'Default'
            , connectionType: 'IS_SOCKET'   // Hard coded because typescript cannot handle Enum.KEY here
            , uri: 'rotate.aprs2.net'
            , port: '14580'
            , isEnabled: false
            , isValid: false
            , filter: 'r/39.00/-91.00/1000'
            , rules: {
                required: value => !!value || 'Required.',
            }
        })
        , created() {
            // load settings here
            //https://jsfiddle.net/awolf2904/3rabkzsn/1/
            //store.dispatch('getStationSettings');
        }
        , computed: {
            connectionTypeOptions() {
                let map = [];

                for(var t in ConnectionTypeEnum) {
                    map.push({ id: t, name: ConnectionTypeEnum[t] });
                }

                return map;
            }
        }
        , methods: {
            resetConnectionInfo() {

            }
            , saveConnectionInfo() {

            }
        }
    }
</script>