<template>
    <div id="appSettings" style="padding: 10px">
        <h1>Application Settings</h1>

        <v-card>
            <v-card-text>
                <v-form @submit.prevent="saveAppSettings"
                        id="application-settings-form"
                        >
                    <v-container>
                        <v-layout row wrap>
                            <v-flex xs12 md6 class="px-2">
                                <v-select label="Distance Units"
                                    :items="distanceUnitTypeOptions"
                                    item-text="name"
                                    item-value="name"
                                    v-model="softwareSettings.distanceUnitType"
                                    >
                                </v-select>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs12 md6 class="px-2">
                                <v-select label="Temperature Units"
                                    :items="temperatureUnitTypeOptions"
                                    item-text="name"
                                    item-value="name"
                                    v-model="softwareSettings.temperatureUnitType"
                                    >
                                </v-select>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs12 class="px-2">
                                <v-btn color="primary" class="mr-4" type="submit" form="application-settings-form">Save</v-btn>
                                <v-btn color="normal" class="mr-4" @click="resetAppSettings">Reset</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
    import ActionTypes from '@/ActionTypes'
    import { DistanceUnitTypes, TemperatureUnitTypes } from '@/enums'
    import { SoftwareSettings } from '@/models/SoftwareSettings'
    import { Mapper } from '@/utils/mappers'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({})
    export default class ApplicationSettings extends Vue {
        private softwareSettings: SoftwareSettings = new SoftwareSettings()

        constructor() {
            super()

            Mapper.CopyInto<SoftwareSettings, SoftwareSettings>(this.$store.state.softwareSettings, this.softwareSettings)
        }

        private get distanceUnitTypeOptions() {
            let map = []

            Object.keys(DistanceUnitTypes).forEach(k => {
                map.push({ id: DistanceUnitTypes[k], name: DistanceUnitTypes[k] })
            });

            return map
        }

        private get temperatureUnitTypeOptions() {
            let map = []

            Object.keys(TemperatureUnitTypes).forEach(k => {
                map.push({ id: TemperatureUnitTypes[k], name: TemperatureUnitTypes[k] })
            });

            return map
        }

        private saveAppSettings() {
            this.$store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, this.softwareSettings)
        }

        private resetAppSettings() {
            Mapper.CopyInto<SoftwareSettings, SoftwareSettings>(this.$store.state.softwareSettings, this.softwareSettings)
        }
    }
</script>
