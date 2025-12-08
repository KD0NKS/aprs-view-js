<template>
    <q-page class="q-pa-md column" style="height: 100vh">
        <div class="col col-xs-1" style="min-height: 45px;">
            <span class="text-h4 h4">Output</span>
        </div>

        <q-card class="col fill">
            <q-card-section class="q-pa-none" style="height: 100%">
                <q-scroll-area
                        class="q-pa-md bg-dark text-green rounded-borders"
                        style="height: 100%"
                        :bar-style="{ borderRadius: '5px', background: 'lightgray', width: '10px', opacity: 0.8 }"
                        :thumb-style="{ borderRadius: '5px', background: 'black', width: '10px', opacity: 0.5 }"
                        >
                    <div v-for="(data, i) in processedData" :key="i">
                        <span style="font-style: italic">{{ data[0] }}:</span>&nbsp;&nbsp;&nbsp;&nbsp;{{ data[1] }}
                    </div>
                </q-scroll-area>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { mapState } from 'pinia'

    import { useConectionStore } from '../stores/connectionStore'
    import { usePacketStore } from '../stores/packetStore'

    import _ from 'lodash'

    export default defineComponent({
        name: "Output"
        , setup() {
            const packetStore = usePacketStore()
            const connectionStore = useConectionStore()

            return {
                packetStore
                , connectionStore
            }
        }
        , computed: {
            ...mapState(usePacketStore, [ 'getAprsData' ])
            , ...mapState(useConectionStore, [ 'connections' ])
            , processedData() {
                return _.reduce(this.getAprsData, (result, data) => {
                    result.push([ this.connectionStore.getConnectionName(data[0]), data[1] ])
                    return result
                }, [])
            }
        }
        , methods: {
            getConnectionName(connectionId: string | number) {
                if(connectionId != null) {
                    return this.connections.find(c => c.id == connectionId)?.name
                } else {
                    return null
                }
            }
        }
    })
</script>
