<template>
    <q-page class="q-pa-md">
        <div style="padding-bottom: 10px">
            <span class="text-h4 h4">Application Settings</span>
        </div>

        <q-card class="q-pa-md">
            <q-form
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="row justify-between">
                    <div class="col-md-6 q-pa-sm">
                        <q-toggle
                            :label="themeLabel"
                            v-model="settings.isDarkMode"
                            dense
                            >
                        </q-toggle>
                    </div>
                </div>

                <div class="row justify-between">
                    <div class="col-md-6 q-pa-sm">
                        <q-select label="Distance Units"
                                v-model="settings.distanceUnitType"
                                :options="distanceUnitTypeOptions"
                                emit-value
                                map-options
                                dense
                                >
                        </q-select>
                    </div>
                </div>

                <div class="row justify-between">
                    <div class="col-md-6 q-pa-sm">
                        <q-select label="Temperature Units"
                                v-model="settings.temperatureUnitType"
                                :options="temperatureUnitTypeOptions"
                                :option-value="opt => Object(opt) === opt && 'value' in opt ? opt.value : null"
                                :option-label="opt => Object(opt) === opt && 'label' in opt ? opt.label : null"
                                emit-value
                                map-options
                                dense
                                >
                        </q-select>
                    </div>
                </div>

                <div class="row">
                    <div class="q-gutter-sm col-md-6 q-pa-sm">
                        <q-btn color="primary" label="Save" type="submit" />
                        <q-btn label="Reset" type="reset" />
                    </div>
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import _ from 'lodash'

    import { defineComponent, ref } from 'vue'
    import { useQuasar } from 'quasar'
    import { useSoftwareSettingsStore } from '../../stores/softwareSettingsStore'

    import { Mapper } from '../../utils/mappers'
    import { DistanceUnitTypes, TemperatureUnitTypes } from '../../enums'

    import { SoftwareSettings } from '../../models/settings'

    export default defineComponent({
        name: 'ApplicationSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new SoftwareSettings())
            const store = useSoftwareSettingsStore()
            const $q = useQuasar()

            mapper.CopyInto<SoftwareSettings, SoftwareSettings>(store.getSoftwareSettings, settings.value)

            return {
                settings
                , onSubmit() {
                    store.setSoftwareSettings(settings.value)

                    $q.dark.set(settings.value.isDarkMode)
                }
                , onReset() {
                    mapper.CopyInto<SoftwareSettings, SoftwareSettings>(store.getSoftwareSettings, settings.value)
                }
            }
        }
        , computed: {
            distanceUnitTypeOptions() {
                return _.map(
                    Object.keys(DistanceUnitTypes)
                    , key => {
                        return {
                            label: DistanceUnitTypes[key]
                            , value: DistanceUnitTypes[key]
                        }
                    }
                )
            }
            , temperatureUnitTypeOptions() {
                return _.map(
                    Object.keys(TemperatureUnitTypes)
                    , key => {
                        return {
                            label: TemperatureUnitTypes[key]
                            , value: TemperatureUnitTypes[key]
                        }
                    }
                )
            }
            , themeLabel() {
                return this.settings.isDarkMode ? 'Dark Mode' : 'Light Mode'
            }
        }
    })
</script>

