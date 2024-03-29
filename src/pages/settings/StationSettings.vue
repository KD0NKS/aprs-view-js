<template>
    <q-page class="q-pa-md">
        <div style="padding-bottom: 10px">
            <span class="text-h4 h4">Station Settings</span>
        </div>

        <q-card class="q-pa-md">
            <q-form class="q-gutter-md"
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="q-gutter-md row">
                    <q-input label="Callsign" v-model="settings.callsign" :rules="[ rules.required ]" class="col-5" dense />
                    <q-input label="SSID" v-model="settings.ssid" class="col-2" dense />
                    <q-input label="Passcode" v-model="settings.passcode" class="col-4" dense />
                </div>

                <div class="q-gutter-md row">
                    <q-select
                            v-model="settings.symbol"
                            :options="aprsSymbols"
                            :option-value="opt => Object(opt) === opt && 'key' in opt ? opt.key : null"
                            :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : null"
                            @update:model-value="symbolChanged"
                            label="Station Symbol"
                            clearable
                            emit-value
                            map-options
                            class="col-6"
                            dense
                            >
                        <template v-slot:prepend v-if="stationSymbol && stationSymbol != null">
                            <q-avatar>
                                <img :src="stationSymbol.value" />
                            </q-avatar>
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section avatar square>
                                    <q-img height="24px" width="24px" :src="scope.opt.value" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-select
                            v-model="settings.symbolOverlay"
                            :disable="isDisableOverlay"
                            :options="aprsSymbolOverlays"
                            :option-value="opt => Object(opt) === opt && 'key' in opt ? opt.key : null"
                            :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : null"
                            label="Symbol Overlay"
                            clearable
                            emit-value
                            map-options
                            class="col-5"
                            dense
                            >
                        <template v-slot:prepend v-if="overlaySymbol && overlaySymbol != null">
                            <q-avatar>
                                <img :src="overlaySymbol.value" />
                            </q-avatar>
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section avatar square>
                                    <q-img height="24px" width="24px" :src="scope.opt.value" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </div>
                <div class="q-gutter-md row">
                    <q-select label="Location Type"
                            v-model="settings.locationType"
                            :options="locationTypeOptions"
                            :option-value="opt => Object(opt) === opt && 'value' in opt ? opt.value : null"
                            :option-label="opt => Object(opt) === opt && 'label' in opt ? opt.label : null"
                            emit-value
                            map-options
                            disable
                            class="col-4"
                            dense>
                    </q-select>

                    <q-toggle label="Transmit position"
                            v-model="settings.isTransmitPosition"
                            class="col-2"
                            dense
                            />
                </div>

                <StaticLocationSettings v-if="settings.locationType == 'Fixed'"
                        :latitude="settings.latitude"
                        :longitude="settings.longitude"
                        @updateLatitude="updateLatitude"
                        @updateLongitude="updateLongitude"
                        />

                <div class="q-gutter-md row">
                    <q-btn color="primary" label="Save" type="submit" />
                    <q-btn label="Reset" type="reset" />
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useStationSettingsStore } from "../../stores/stationSettingsStore"
    import _ from 'lodash'

    import { LocationTypes } from '../../enums'

    import { Mapper } from '../../utils/mappers'

    import { APRSSymbol } from '../../models/APRSSymbol'
    import { StationSettings } from '../../models/settings'

    import { APRSSymbolService } from '../../services/'

    import StaticLocationSettings from '../../components/location/StaticLocationSettings.vue'

    export default defineComponent({
        name: 'StationSettings'
        , setup() {
            const mapper = new Mapper()
            const settings = ref(new StationSettings())
            const symbolSvc = new APRSSymbolService()
            const store = useStationSettingsStore()

            mapper.CopyInto<StationSettings, StationSettings>(store.stationSettings, settings.value)

            return {
                settings
                , symbolSvc
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , onSubmit() {
                    store.setStationSettings(settings.value)
                }
                , onReset() {
                    mapper.CopyInto<StationSettings, StationSettings>(store.stationSettings, settings.value)
                }
            }
        }
        , components: {
            StaticLocationSettings
        }
        , computed: {
            aprsSymbols() {
                return this.symbolSvc.GetSymbols()
            }
            , aprsSymbolOverlays() {
                return this.symbolSvc.GetOverlays()
            }
            , isDisableOverlay(): boolean {
                return !this.symbolSvc.GetSymbolByKey(this.settings.symbol).isAllowOverlay

            }
            , locationTypeOptions() {
                return _.map(
                    Object.keys(LocationTypes)
                    , key => {
                        return {
                            label: LocationTypes[key]
                            , value: LocationTypes[key]
                        }
                    }
                )
            }
            , stationSymbol(): APRSSymbol {
                if(this.settings.symbol != null) {
                    return this.symbolSvc.GetSymbolByKey(this.settings.symbol)
                }

                return null
            }
            , overlaySymbol(): APRSSymbol {
                if(this.settings.symbolOverlay != null) {
                    return this.symbolSvc.GetOverlay(this.settings.symbolOverlay)
                }

                return null
            }
        }
        , methods: {
            symbolChanged() {
                if(this.isDisableOverlay == true) {
                    this.settings.symbolOverlay = null
                }
            }
            , updateLatitude(latitude) {
                this.settings.latitude = Number(latitude)
            }
            , updateLongitude(longitude) {
                this.settings.longitude = Number(longitude)
            }
        }
    })
</script>
