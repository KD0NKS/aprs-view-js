<template>
    <q-drawer v-model="drawer"
            :mini="!drawer || miniState"
            @click.capture="drawerClick"
            show-if-above
            bordered
            :width="200"
            :breakpoint="500"
            mini-width="70"
            >
        <q-scroll-area class="fit">
            <q-list>
                <q-item clickable>
                    <q-item-section avatar>
                        <q-img height="33px" width="33px" contain :src="stationSymbol.value" />
                    </q-item-section>

                    <q-item-section>
                        {{ callsign }}
                    </q-item-section>
                </q-item>

                <q-separator />

                <template v-for="link in essentialLinks" :key="link.title">
                    <essential-link v-bind="link" />
                </template>
            </q-list>
        </q-scroll-area>

        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
            <q-btn
                dense
                round
                unelevated
                color="primary"
                icon="chevron_left"
                @click="miniState = true"
                >
            </q-btn>
        </div>
    </q-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { useStore } from '@/store'

    import { StringUtil } from "@/utils"

    import EssentialLink from 'components/EssentialLink.vue'
    import { APRSSymbol } from "@/models"
    import { APRSSymbolService } from "@/services"

    const items = [
        { title: "Map", icon: "map", action: "/map" }
        , { title: "Output", icon: "terminal", action: "/output" }
        , {
            title: "Settings"
            , icon: "settings"
            , subLinks: [
                { title: 'Station', action: '/stationSettings' },
                { title: 'Connections', action: '/connectionSettings' },
                { title: 'Map', action: '/mapSettings' },
                { title: 'Application', action: '/applicationSettings' },
            ],
        }
        , { title: "About", icon: "info", action: "/about" }
    ]

    export default defineComponent({
        name: "Navigation"
        , components: {
            EssentialLink
        }
        , setup() {
            const miniState = ref(false)
            const symbolSvc = new APRSSymbolService()
            const $store = useStore()

            return {
                drawer: ref(false)
                , miniState
                , essentialLinks: items
                , symbolSvc
                , drawerClick(e: any) {
                    // if in "mini" state and user
                    // click on drawer, we switch it to "normal" mode
                    if(miniState.value) {
                        miniState.value = false

                        e.stopPropagation()
                    }
                }
            }
        }
        , computed: {
            callsign(): string {
                if(!StringUtil.IsNullOrWhiteSpace(this.$store.state?.stationSettings?.ssid)) {
                    return `${this.$store.state.stationSettings.callsign}-${this.$store.state.stationSettings.ssid}`
                }

                return this.$store.state?.stationSettings?.callsign
            }
            , stationSymbol(): APRSSymbol { // TODO: move this to store
                if(StringUtil.IsNullOrWhiteSpace(this.$store.state?.stationSettings?.symbol)) {
                    return new APRSSymbol({
                        key: "logo"
                        , value: require("@/assets/radio-tower.png")
                        , name: "Radio Tower"
                    })
                }

                return this.symbolSvc.GetSymbolByKey(this.$store.state.stationSettings.symbol)
            }
        }
    })
</script>
