<template>
    <div class="q-pa-md">
        <span class="text-h4 h4">Application Settings</span>

        <q-card class="q-pa-md">
            <q-form class="q-gutter-md"
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="q-gutter-md row items-start">
                    <q-toggle
                        :label="themeLabel"
                        v-model="settings.isDarkMode"
                        >
                    </q-toggle>
                </div>
                <div class="q-gutter-md row items-start">
                    <q-select label="Distance Units"
                            v-model="settings.distanceUnitType"
                            :options="distanceUnitTypeOptions"
                            emit-value
                            map-options
                            class="col-6"
                            >
                    </q-select>
                </div>

                <div class="q-gutter-md row items-start">
                    <q-select label="Temperature Units"
                            v-model="settings.temperatureUnitType"
                            :options="temperatureUnitTypeOptions"
                            :option-value="opt => Object(opt) === opt && 'value' in opt ? opt.value : null"
                            :option-label="opt => Object(opt) === opt && 'label' in opt ? opt.label : null"
                            emit-value
                            map-options
                            class="col-6"
                            >
                    </q-select>
                </div>

                <div class="q-gutter-md row items-start">
                    <q-btn color="primary" label="Save" type="submit" />
                    <q-btn label="Reset" type="reset" />
                </div>
            </q-form>
        </q-card>
    </div>
</template>

<script lang="ts">
    import _ from 'lodash'

    import { defineComponent, ref } from 'vue'
    import { useQuasar } from 'quasar'
    import { useStore } from '@/store'

    import { Mapper } from '@/utils/mappers'
    import { ActionTypes, DistanceUnitTypes, GetterTypes, TemperatureUnitTypes } from '@/enums'

    import { SoftwareSettings } from '@/models/settings'

    export default defineComponent({
        name: 'ApplicationSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new SoftwareSettings())
            const store = useStore()
            const $q = useQuasar()

            mapper.CopyInto<SoftwareSettings, SoftwareSettings>(store.getters[GetterTypes.SOFTWARE_SETTINGS], settings.value)

            return {
                settings
                , onSubmit() {
                    store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, settings.value)

                    $q.dark.set(settings.value.isDarkMode)
                }
                , onReset() {
                    mapper.CopyInto<SoftwareSettings, SoftwareSettings>(store.getters[GetterTypes.SOFTWARE_SETTINGS], settings.value)
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
