<template>
    <v-card>
        <v-card-title>{{ packet.sourceCallsign }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 50vh">
            {{ packet.origpacket }}
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
