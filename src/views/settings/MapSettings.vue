<template>
    <div id="mapSettings" style="padding: 10px">
        <h1>Map Settings</h1>

        <v-card>
            <v-card-text>
                <v-form @submit.prevent="saveMapSettings"
                        id="map-settings-form"
                        v-model="isMapSettingsValid"
                        >
                    <v-container>
                        <v-layout row wrap>
                            <v-flex xs12 md6 class="px-2">
                                <v-text-field
                                    v-model.number="mapSettings.pointLifetime"
                                    label="Point Lifetime (in minutes)"
                                    type="number"
                                    :rules="[rules.positiveNum]"
                                    >
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs12 md6 class="px-2">
                                <v-switch
                                    v-model="mapSettings.isShowLabels"
                                    label="Show Labels"
                                    >
                                </v-switch>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs12 md6 class="px-2">
                                <v-switch
                                    v-model="mapSettings.isShowTrails"
                                    label="Show Trails"
                                    >
                                </v-switch>
                            </v-flex>
                        </v-layout>

                        <!--
                            Center on options:
                            Center on Station               - With callsign input + map menu option
                            Center on previous position     - disabled inputs
                            Center on coordinates           - coordinates + map menu option

                            Return zoom options
                            previons zoom   - disabled input
                            preferred zoom  - editable input
                        -->

                        <v-layout row wrap>
                            <v-flex xs12 class="px-2">
                                <v-btn color="primary" class="mr-4" type="submit" :disabled="!isMapSettingsValid" form="map-settings-form">Save</v-btn>
                                <v-btn color="normal" class="mr-4" @click="resetMapSettings">Reset</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    import ActionTypes from '@/ActionTypes'
    import { MapSettings as vm } from '@/models/MapSettings'
    import { Mapper } from '@/utils/mappers'

    @Component({
    })
    export default class MapSettings extends Vue {
        private isMapSettingsValid: boolean = false
        private mapSettings: vm = new vm()

        constructor() {
            super()

            Mapper.CopyInto<vm, vm>(this.$store.state.mapSettings, this.mapSettings)
        }

        private resetMapSettings() {
            Mapper.CopyInto<vm, vm>(this.$store.state.mapSettings, this.mapSettings)
        }

        private saveMapSettings() {
            if(this.isMapSettingsValid) {
                this.$store.dispatch(ActionTypes.SET_MAP_SETTINGS, this.mapSettings)
            }
        }

        data() {
            return {
                rules: {
                    positiveNum: value => !!value && value >= 0 || 'Value must be greater than or equal to 0'
                    , required: value => !!value || 'Required.'
                }
            }
        }
    }
</script>
