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
                            delse
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-toggle label="Show Ambiguity"
                            v-model="settings.isShowAmbiguity"
                            class="col-6"
                            dense
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-toggle label="Show Labels"
                            v-model="settings.isShowLabels"
                            class="col-6"
                            dense
                            />
                </div>

                <div class="q-gutter-md row items-start">
                    <q-toggle label="Show Trails"
                            v-model="settings.isShowTrails"
                            class="col-6"
                            dense
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
    import { defineComponent, ref } from 'vue'

    import { MapSettings } from '../../models/settings'
    import { useMapSettingsStore } from '../../stores/mapSettingsStore'
    import { Mapper } from '../../utils/mappers'

    export default defineComponent({
        name: 'MapSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new MapSettings())
            const store = useMapSettingsStore()

            mapper.CopyInto<MapSettings, MapSettings>(store.getMapSettings, settings.value)

            return {
                settings
                , rules: {
                    positiveNum: value => value >= 0 || 'Must be a positive number.'
                }
                , onSubmit() {
                    store.setMapSettings(settings.value)
                }
                , onReset() {
                    mapper.CopyInto<MapSettings, MapSettings>(store.getMapSettings, settings.value)
                }
            }
        }
    })
</script>

