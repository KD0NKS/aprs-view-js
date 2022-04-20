<template>
    <q-card style="width: 50%; min-width: 350px">
        <q-toolbar>
            <q-avatar square>
                <q-img contain v-if="symbol" :src="symbol.value" class="avatar-img" height="33px" width="33px">
                    <q-img contain v-if="overlay" :src="overlay.value" class="avatar-img" height="33px" width="33px" />
                </q-img>
            </q-avatar>

            <q-toolbar-title>
                <span class="text-weight-bold">
                    <span v-if="packet.itemname">{{ packet.itemname }} via</span>
                    <span v-if="packet.objectname">{{ packet.objectname }} via</span>
                    {{ packet.sourceCallsign}}
                </span>
                <span v-if="packet.comment" class="text-caption text-bold text-italic">&nbsp;&nbsp;&nbsp;&nbsp;Comment:&nbsp;</span>
                <span v-if="packet.comment" class="text-caption text-italic">{{ packet.comment }}</span>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator inset />

        <q-card-section style="max-height: 50vh">
            <div v-if="packet">
                <p class="text-caption text-italic">
                    {{ packet.origpacket }}
                </p>
                <p>
                    <label style="font-weight: bold">Received Time:</label> {{ new Date(packet.receivedTime).toLocaleString() }}
                </p>
                <p v-if="packet.speed">
                    <label style="font-weight: bold">Speed:</label> {{ speed }}
                </p>
                <p v-if="packet.course">
                    <label style="font-weight: bold">Course:</label> {{ packet.course }}&#730;
                </p>
                <p v-if="packet.altitude">
                    <label style="font-weight: bold">Altitude:</label> {{ altitude }}
                </p>
                <div v-if="packet.wx">
                    <p v-if="packet.wx.temp">
                        <label style="font-weight: bold">Temperature:</label> {{ temperature }}
                    </p>
                    <p v-if="packet.wx.humidity">
                        <label style="font-weight: bold">Humidity:</label> {{ packet.wx.humidity }}%
                    </p>
                    <p v-if="packet.wx.wind_speed">
                        <label style="font-weight: bold">Wind Speed:</label> {{ windSpeed }}
                    </p>
                    <p v-if="packet.wx.wind_gust">
                        <label style="font-weight: bold">Wind Gust:</label> {{ windGust }}
                    </p>
                </div>
            </div>
            <div v-else>
                Information not found
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { ConversionUtil } from "@/utils"
    import { useStore } from "@/store"

    import { APRSSymbol } from "@/models"
    import { GetterTypes } from "@/enums"

    export default defineComponent({
        name: "MapContextMenu"
        , props: {
            overlay: {
                type: APRSSymbol
                , required: false
            }
            , packet: {
                type: Object
                , required: true
            }
            , symbol: {
                type: APRSSymbol
                , required: true
            }
        }
        , setup() {
            const store = useStore()
            const softwareSettings = store.getters[GetterTypes.SOFTWARE_SETTINGS]

            return {
                softwareSettings
            }
        }
        , computed: {
            altitude() {
                return ConversionUtil.metersFeetWithLabel(this.packet.altitude, this.softwareSettings.distanceUnitType)
            }
            , speed() {
                return ConversionUtil.kmhMphWithLabel(this.packet.speed, this.softwareSettings.distanceUnitType)
            }
            , stationName() {
                return this.packet.itemname ?? this.packet.objectname ?? this.packet.sourceCallsign
            }
            , temperature() {
                return ConversionUtil.getTemperatureWithLabel(parseFloat(this.packet.wx?.temp), this.softwareSettings.temperatureUnitType)
            }
            , windGust() {
                return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_gust), this.softwareSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
            }
            , windSpeed() {
                return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_speed), this.softwareSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
            }
        }
    })
</script>

<style scoped lang="sass">
.avatar-img
    background: transparent
</style>
