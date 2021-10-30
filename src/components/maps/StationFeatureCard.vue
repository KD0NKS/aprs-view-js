<template>
    <v-card>
        <v-card-title>
            <div id="imgWrapper">
                <v-img
                        :key="symbol.key"
                        :src="symbol.value"
                        v-if="symbol"
                        max-height="35px"
                        max-width="35px"
                        >
                    <v-overlay absolute opacity="0" v-if="overlay">
                        <v-img
                                :key="overlay.key"
                                :src="overlay.value"
                                max-height="35px"
                                max-width="35px"
                                class="d-flex fill-height"
                                style="flex-direction:column"
                                >
                        </v-img>
                    </v-overlay>
                </v-img>
            </div>
            <div>
                <span v-if="packet.itemname">
                    {{ packet.itemname }} via
                </span>
                <span v-if="packet.objectname">
                    {{ packet.objectname }} via
                </span>
                {{ packet.sourceCallsign }}
            </div>
            <!-- Leave this little gem here for later use... move on, nothing to see
            <div>
                <v-btn
                        class="ma-1"
                        color="blue"
                        text
                        plain
                        :to="{ name: 'stationHistory', params: { stationName: stationName } }"
                        >
                    History
                </v-btn>
            </div>
            -->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 50vh">
            <div v-if="packet">
                <p>
                    {{ packet.origpacket }}
                </p>
                <p>
                    <label>Received Time:</label> {{ new Date(packet.receivedTime).toLocaleString() }}
                </p>
                <p v-if="packet.speed">
                    <label>Speed:</label> {{ speed }}
                </p>
                <p v-if="packet.course">
                    <label>Course:</label> {{ packet.course }}&#730;
                </p>
                <p v-if="packet.altitude">
                    <label>Altitude:</label> {{ altitude }}
                </p>
                <div v-if="packet.wx">
                    <p v-if="packet.wx.temp">
                        <label>Temperature:</label> {{ temperature }}
                    </p>
                    <p v-if="packet.wx.humidity">
                        <label>Humidity:</label> {{ packet.wx.humidity }}%
                    </p>
                    <p v-if="packet.wx.wind_speed">
                        <label>Wind Speed:</label> {{ windSpeed }}
                    </p>
                    <p v-if="packet.wx.wind_gust">
                        <label>Wind Gust:</label> {{ windGust }}
                    </p>
                </div>
            </div>
            <div v-else>
                Information not found
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn
                        color="blue darken-1"
                        text
                        @click="$emit('close')"
                        >
                    Close
                </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'

    import { ConversionUtil } from '@/utils'
    import { APRSSymbol } from '@/models/APRSSymbol'
    import { aprsPacket } from 'js-aprs-fap'

    @Component({
        props: [ 'overlay', 'packet', 'symbol']
        , computed: {
            altitude() {
                return ConversionUtil.metersFeetWithLabel(this.packet.altitude, this.$store.state.softwareSettings.distanceUnitType)
            }
            , speed() {
                return ConversionUtil.kmhMphWithLabel(this.packet.speed, this.$store.state.softwareSettings.distanceUnitType)
            }
            , stationName() {
                return this.packet.itemname ?? this.packet.objectname ?? this.packet.sourceCallsign
            }
            , temperature() {
                return ConversionUtil.getTemperatureWithLabel(parseFloat(this.packet.wx?.temp), this.$store.state.softwareSettings.temperatureUnitType)
            }
            , windGust() {
                return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_gust), this.$store.state.softwareSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
            }
            , windSpeed() {
                return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_speed), this.$store.state.softwareSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
            }
        }
    })
    export default class StationFeatureCard extends Vue {
        @Prop()
        private overlay: APRSSymbol | undefined

        @Prop()
        private packet: aprsPacket

        @Prop()
        private symbol: APRSSymbol
    }
</script>
<style scoped lang="sass">
    .v-overlay__content
        height: 100%
        width: 100%
</style>
