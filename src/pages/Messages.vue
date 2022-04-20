<template>
    <q-page class="q-pa-md column" style="height: 100vh">
        <div class="col col-xs-1">
            <span class="text-h4 h4">Messages</span>
        </div>

        <q-card class="col fill">
            <q-card-section class="q-pa-none" style="height: 100%">
                <q-scroll-area
                        class="q-pa-md bg-dark text-green rounded-borders"
                        style="height: 100%"
                        :bar-style="{ borderRadius: '5px', background: 'lightgray', width: '10px', opacity: 0.8 }"
                        :thumb-style="{ borderRadius: '5px', background: 'black', width: '10px', opacity: 0.5 }"
                        >
                    <div v-for="(data, i) in messages" :key="i">
                        {{ data }}
                    </div>
                </q-scroll-area>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useStore } from '@/store'
    import _ from 'lodash'

    import { GetterTypes } from '@/enums'

    import { aprsPacket, PacketTypeEnum } from 'js-aprs-fap'

    export default defineComponent({
        name: "Messages"
        , setup() {
            const store = useStore()
            const messages = ref([])
            const packets = store.getters[GetterTypes.GET_PACKETS]
            const packetAddedListener = ref(null)

            return {
                store
                , messages
                , packets
                , packetAddedListener
            }
        }
        , beforeUnmount() {
            this.packets.removeListener('add', this.packetAddedListener)
        }
        , mounted() {
            const msgs = _.compact(
                _.sortBy(
                    _.filter(this.packets, (p) => {
                        return p.type == PacketTypeEnum.MESSAGE
                    })
                    , p => (p as aprsPacket).receivedTime
                )
            )

            for(const m of msgs) {
                this.messages.push(m)
            }

            this.packetAddedListener = this.packets.on('add', (packet) => {
                if(packet.type == PacketTypeEnum.MESSAGE) {
                    this.messages.push(packet.message)
                }
            })
        }
    })
</script>
