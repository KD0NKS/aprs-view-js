<template>
    <q-card>
        <q-toolbar>
            <q-avatar square>
                <q-img contain v-if="symbol" :src="symbol.value" height="33px" width="33px">
                    <q-img contain v-if="overlay" :src="overlay.value" :img-style="{ background: none }" height="33px" width="33px" />
                </q-img>
            </q-avatar>

            <q-toolbar-title>
                <span class="text-weight-bold">
                    <span v-if="packet.itemname">{{ packet.itemname }} via</span>
                    <span v-if="packet.objectname">{{ packet.objectname }} via</span>
                    {{ packet.sourceCallsign}}
                </span>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section style="max-height: 50vh">
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
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { APRSSymbol } from "@/models"
    import { aprsPacket } from "js-aprs-fap"

    export default defineComponent({
        name: "MapContextMenu"
        , props: {
            overlay: {
                type: APRSSymbol
                , required: false
            }
            , packet: {
                type: aprsPacket
                , required: true
            }
            , symbol: {
                type: APRSSymbol
                , required: true
            }
        }
    })
</script>
