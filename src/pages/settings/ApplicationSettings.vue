<template>
    <div class="q-pa-md">
        <h1>Application Settings</h1>

        <q-card class="q-pa-md">
            <q-form class="q-gutter-md"
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
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
    import { useStore } from '@/store'

    import { Mapper } from '@/utils/mappers'
    import { ActionTypes, DistanceUnitTypes, GetterTypes, TemperatureUnitTypes } from '@/enums'

    import { SoftwareSettings } from '@/models/settings'

    export default defineComponent({
        name: 'ApplicationSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new SoftwareSettings())
            const $store = useStore()

            mapper.CopyInto<SoftwareSettings, SoftwareSettings>($store.getters[GetterTypes.SOFTWARE_SETTINGS], settings.value)

            return {
                settings
                , onSubmit() {
                    $store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, settings.value)
                }
                , onReset() {
                    mapper.CopyInto<SoftwareSettings, SoftwareSettings>($store.getters[GetterTypes.SOFTWARE_SETTINGS], settings.value)
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
                            , value: key
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
                            , value: key
                        }
                    }
                )
            }
        }
    })
</script>
