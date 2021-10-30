<template>
    <div class="output" style="padding: 10px">
        <h1>
            <span v-if="stationName">

                {{ stationName }}
            </span>
            <span v-else>
                No station provided
            </span>
        </h1>

        <div v-for="p in packets" :key="p.id">
            {{ p.receivedTime }} - {{ p.origpacket }}
        </div>
    </div>
</template>

<script lang="ts">
    // TODO: Not REALLY implemented, but great for debugging.
    import _ from 'lodash'
    import { aprsPacket } from 'js-aprs-fap'
    import GetterTypes from '@/GetterTypes'

    export default {
        computed: {
            packets(): Array<aprsPacket> {
                return _.sortBy(this.$store.getters[GetterTypes.GET_PACKETS_BY_NAME](this.stationName), p => p.receivedTime)
            }
            , stationName() {
                return this.$route.params.stationName
            }
        }
    }
</script>
