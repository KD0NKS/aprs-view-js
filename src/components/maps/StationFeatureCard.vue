<template>
    <v-card>
        <v-card-title>{{ packet.sourceCallsign }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 50vh">
            <p>
                {{ packet.origpacket }}
            </p>
            <p>
                <label>Received Time:</label> {{ new Date(packet.receivedTime).toLocaleString() }}
            </p>
            <p v-if="packet.speed">
                <label>Speed:</label> {{ packet.speed }}
            </p>
            <p v-if="packet.course">
                <label>Course:</label> {{ packet.course }}&#730;
            </p>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import { aprsPacket } from 'js-aprs-fap'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: ['packet']
    })
    export default class StationFeatureCard extends Vue {
        @Prop()
        private packet: aprsPacket
    }
</script>
