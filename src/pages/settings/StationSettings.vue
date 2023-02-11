<template>
    <q-page class="q-pa-md">
        <div style="padding-bottom: 10px">
            <span class="text-h4 h4">Station Settings</span>
        </div>

        <q-card class="q-pa-md">
            <q-form
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="row justify-between">
                    <div class="col-md-5 q-pa-sm"><q-input label="Callsign" v-model="settings.callsign" :rules="[ rules.required ]" dense /></div>
                    <div class="col-md-2 q-pa-sm"><q-input label="SSID" v-model="settings.ssid" dense /></div>
                    <div class="col-md-5 q-pa-sm"><q-input label="Passcode" v-model="settings.passcode" dense /></div>
                </div>

                <div class="row justify-between">
                    <div class="col-md-6 q-pa-sm">
                        <q-select v-model="settings.symbol"
                                :options="aprsSymbols"
                                :option-value="opt => Object(opt) === opt && 'key' in opt ? opt.key : null"
                                :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : null"
                                @update:model-value="symbolChanged"
                                label="Station Symbol"
                                clearable
                                emit-value
                                map-options
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
                    </div>

                    <div class="col-md-6 q-pa-sm">
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
                </div>

                <div class="row justify-between">
                    <div class="col-md-6 q-pa-sm">
                        <q-select label="Location Type"
                                v-model="settings.locationType"
                                :options="locationTypeOptions"
                                :option-value="opt => Object(opt) === opt && 'value' in opt ? opt.value : null"
                                :option-label="opt => Object(opt) === opt && 'label' in opt ? opt.label : null"
                                @update:model-value="updateLocationType()"
                                emit-value
                                map-options
                                >
                        </q-select>
                    </div>

                    <div class="col-md-2 q-pa-sm">
                        <q-toggle label="Transmit position"
                            v-model="settings.isTransmitPosition"
                            class="vertical-bottom"
                            :disable="isDisableTransmitPostion"
                            />
                    </div>

                    <div class="col-md-4 q-pa-sm">
                        <q-btn color="green" label="Send Position" @click="sendPacket()" v-if="isDisableSendPosition == false" />
                    </div>
                </div>

                <static-location-settings v-if="settings.locationType == 'Fixed'"
                        :latitude="settings.latitude"
                        :longitude="settings.longitude"
                        :transmit-interval="settings.transmitInterval"
                        @updateLatitude="updateLatitude"
                        @updateLongitude="updateLongitude"
                        @updateTransmitInterval="updateTransmitInterval"
                        >
                </static-location-settings>

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
    import { defineComponent, ref } from 'vue'
    import { useStore } from '@/store'
    import _ from 'lodash'
    import { BuildPositionModel, PacketFactory } from 'js-aprs-fap'

    import { ActionTypes, LocationTypes } from '@/enums'

    import { Mapper } from '@/utils/mappers'

    import { APRSSymbol } from '@/models/APRSSymbol'
    import { StationSettings } from '@/models/settings'

    import { APRSSymbolService } from '@/services/'

    import StaticLocationSettings from '@/components/location/StaticLocationSettings.vue'

    export default defineComponent({
        name: 'StationSettings'
        , setup() {
            const mapper = new Mapper()
            const packetFactory = new PacketFactory()
            const settings = ref(new StationSettings())
            const symbolSvc = new APRSSymbolService()
            const store = useStore()

            mapper.CopyInto<StationSettings, StationSettings>(store.state.stationSettings, settings.value)

            return {
                packetFactory
                , settings
                , store
                , symbolSvc
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , onSubmit() {
                    store.dispatch(ActionTypes.SET_STATION_SETTINGS, settings.value)
                }
                , onReset() {
                    mapper.CopyInto<StationSettings, StationSettings>(store.state.stationSettings, settings.value)
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
            , isDisableTransmitPostion(): boolean {
                return (this.settings.locationType == null || this.settings.locationType == LocationTypes.NONE)
            }
            , isDisableSendPosition() {
                return this.isDisableTransmitPosition == true || this.settings.isTransmitPosition == false
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
            , updateTransmitInterval(interval) {
                this.settings.transmitInterval = Number(interval)
            }
            , updateLocationType() {
                if(this.settings.locationType == null || this.settings.locationType == LocationTypes.NONE) {
                    this.settings.isTransmitPosition = ref(false)

                }
            }
            , sendPacket() {
                let stationSettings = this.store.state.stationSettings

                if(stationSettings.locationType == LocationTypes.FIXED
                        && stationSettings.isTransmitPosition == true
                        && stationSettings.latitude && stationSettings.latitude != null
                        && stationSettings.longitude && stationSettings.longitude != null
                        ) {
                    const packet = this.packetFactory.makePosition(
                        new BuildPositionModel({
                            latitude: stationSettings.latitude
                            , longitude: stationSettings.longitude
                            , symbols: (stationSettings.overlaySymbol && stationSettings.overlaySymbol != null && stationSettings.overlaySymbol != '')
                                    ? `${stationSettings.symbol}${stationSettings.overlaySymbol}`
                                    : stationSettings.symbol
                        })
                    )

                    global.connectionService.sendPacket(packet)
                }

                /*
                isTransmitPosition: boolean = false
                locationType: string = LocationTypes.FIXED
                longitude: number = 0
                latitude: number = 0
                */

                /*
                let packet;
                global.connectionService.sendPacket(packet)
                */
            }
        }
    })
</script>
