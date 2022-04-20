<template>
    <q-page class="q-pa-md">
        <div style="padding-bottom: 10px">
            <span class="text-h4 h4">Map Settings</span>
        </div>

        <q-card class="q-pa-md">
            <q-form class="q-gutter-md"
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="q-gutter-md row items-start">
                    <q-input label="Point Lifetime (in minutes)"
                            v-model="settings.pointLifetime"
                            :rules="[ rules.positiveNum ]"
                            type="number"
                            class="col-6"
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-toggle label="Show Labels"
                            v-model="settings.isShowLabels"
                            class="col-6"
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-toggle label="Show Trails"
                            v-model="settings.isShowTrails"
                            class="col-6"
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-btn label="Save" type="submit" color="primary" />
                    <q-btn label="Reset" type="reset" />
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import { ActionTypes } from '@/enums'
    import { MapSettings } from '@/models/settings'
    import { useStore } from '@/store'
    import { Mapper } from '@/utils/mappers'
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'MapSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new MapSettings())
            const $store = useStore()

            mapper.CopyInto<MapSettings, MapSettings>($store.state.mapSettings, settings.value)

            return {
                settings
                , rules: {
                    positiveNum: value => value >= 0 || 'Must be a positive number.'
                }
                , onSubmit() {
                    $store.dispatch(ActionTypes.SET_MAP_SETTINGS, settings.value)
                }
                , onReset() {
                    mapper.CopyInto<MapSettings, MapSettings>($store.state.mapSettings, settings.value)
                }
            }
        }
    })
</script>
