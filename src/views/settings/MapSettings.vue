<template>
    <div id="mapSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Map Settings</h1>

            <v-card>
                <v-card-text>
                    <v-form>
                        <v-container>
                            <v-layout row wrap>
                                <v-flex xs12 md6 class="px-2">
                                    <v-text-field
                                        v-model="mapSettings.pointLifetime"
                                        label="Point Lifetime (in minutes)"
                                        >
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
            </v-card>

            <!--
                - [ ] Map start position
                - [ ] Open map to last position/zoom level
                - [x] Point lifetime
                - [ ] Layer Sources - Needs auth inputs
                - [ ] Tile Sources - Needs auth inputs
                - [ ] Track my station

                - [ ] Number of points for a map?
                - [ ] User defined maps
                - [ ] User defined layers
                - [ ] Pluggable?
                - [ ] Weather station data layers - lots of data can be extracted from weather stations
                - [ ] Radar
                - [ ] NWS watches/warnings
                - [ ] Show trails
                - [ ] Restore location and zoom level when switching screens
                - [ ] Show labels
                - [ ] Label options
            -->
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import { MapSettings as vm } from '@/models/MapSettings'

    @Component({
    })
    export default class MapSettings extends Vue {
        private mapSettings: vm

        constructor() {
            super()

            this.mapSettings = new vm()
        }

        data() {
            return {
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        }
    }
</script>
