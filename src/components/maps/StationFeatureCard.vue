<template>
    <v-card>
        <v-card-title>{{ packet.sourceCallsign }}</v-card-title>
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
    import { aprsPacket } from 'js-aprs-fap'
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import { ConversionUtil } from '@/utils'

    @Component({
        props: ['packet']
    })
    export default class StationFeatureCard extends Vue {
        @Prop()
        private packet: aprsPacket

        private get applicationSettings() {
            return this.$store.state.softwareSettings
        }

        private get altitude() {
            return ConversionUtil.metersFeetWithLabel(this.packet.altitude, this.applicationSettings.distanceUnitType)
        }

        private get speed() {
            return ConversionUtil.kmhMphWithLabel(this.packet.speed, this.applicationSettings.distanceUnitType)
        }

        private get temperature() {
            return ConversionUtil.getTemperatureWithLabel(parseFloat(this.packet.wx?.temp), this.applicationSettings.temperatureUnitType)
        }

        private get windSpeed() {
            return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_speed), this.applicationSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
        }

        private get windGust() {
            return ConversionUtil.windSpeedWithLabel(parseFloat(this.packet.wx?.wind_gust), this.applicationSettings.distanceUnitType, parseFloat(this.packet.wx?.wind_direction))
        }
    }
</script>
