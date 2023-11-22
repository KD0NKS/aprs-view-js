<template>
    <q-drawer v-model="drawer"
            :mini="!drawer || miniState"
            @click.capture="drawerClick"
            show-if-above
            :breakpoint="0"
            bordered
            :width="200"
            :mini-width="70"
            side="left"
            behavior="desktop"
            >
        <q-scroll-area class="fit">
            <q-list>
                <q-item clickable>
                    <q-item-section avatar>
                        <q-img :src="aprsSymbol['symbol'].value" class="avatar-img" height="33px" width="33px">
                            <q-img v-if="aprsSymbol['overlay']" :src="aprsSymbol['overlay'].value" class="avatar-img" height="33px" width="33px" />
                        </q-img>
                    </q-item-section>

                    <q-item-section>
                        <span style="font-size: 16px">{{ callsign }}</span>
                    </q-item-section>
                </q-item>

                <q-separator />

                <template v-for="link in essentialLinks" :key="link.title">
                    <navigation-link v-bind="link" />
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
    import { useStationSettingsStore } from "../stores/stationSettingsStore"

    import { StringUtil } from "../utils"

    import NavigationLink from 'components/NavigationLink.vue'
    import { APRSSymbol } from "../models"
    import { APRSSymbolService } from "../services"

    const items = [
        { title: "Map", icon: "map", action: "/map" }
        , { title: "Output", icon: "terminal", action: "/output" }
        , { title: "Messages", icon: "message", action: "/messages" }
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
            NavigationLink
        }
        , setup() {
            const miniState = ref(false)
            const stationSettingsStore = useStationSettingsStore()
            const symbolSvc = new APRSSymbolService()

            return {
                drawer: ref(false)
                , miniState
                , essentialLinks: items
                , stationSettingsStore
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
                if(!StringUtil.IsNullOrWhiteSpace(this.stationSettingsStore.stationSettings?.ssid)) {
                    return `${this.stationSettingsStore.stationSettings.callsign}-${this.stationSettingsStore.stationSettings.ssid}`
                }

                return this.stationSettingsStore.stationSettings?.callsign
            }
            , aprsSymbol() {
                if(StringUtil.IsNullOrWhiteSpace(this.stationSettingsStore.stationSettings?.symbol)) {
                    return {
                        symbol: new APRSSymbol({
                            key: "logo"
                            , value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABHlJREFUaN7tmW1ollUYx3+Pj7OWmqlbUG5z2ofypQ/inOuTWPZV5ocsEvbBXCm+JSKEiCAIrj5FMkxs0ZdUfCHKl4QgUqJAUNQUtkEQFkXOUh+HbjJ9/HCfR+/9z/XcL88eHdT+cGDXff3P/1zXuc9zznWfwQhG8P9Gpkw6WaARWAjMBV4CngPGOX8v8CfQBZwBvgdOA/eGewJqgTbgDyCfsv0O7ABqhiPwamA30F9C4Nr6gV1A1eMK/m3gnzIEru0q8NajDLwC2BMRwA1gL7ACmOfeUoVr1e5ZK7APyEXofOr6lBVPAceLDNgFLHecNHrvAN1FNI+l1IudeSv4W8BGYPQQtTcBtw39o5TpTVjLphuYXa4ZApoItlkdZ9dQhZcZomcJ1rSFOmAtcALoJNj/e93fJ4A1BFuvhRrgvDHem6UGX42/23QXCb4G6AAGiN9tBoDPgClFdP4Sfg8wuZQEduOveWvZNAM3EwSuLQcsNvSagD7htqcNvhb/kNpo8NYDd0sIvtDuAusM3a3C6yPlid0mAl34u01zkeAvuMRmAWNdm+We/VIkCX0T4/CX0o6kwWfxa5vlwqnBXzZ9wCpgVIz2auPt5oDnhbtKOJdjtB/gFel4A/9Q6TCCX5h0hoBXjST2CGesMUmNScQ3S6e94q/D321Wpgi+gDWiMYC/zvcL54Mkwoel0wrxr8Vf8/pqa4FDBEsjB3wFvCicLHBRtFYL513xH0ySgIrOE/+34l9vBG9Vq//iH2IbhHNM/PONyYqFDq51epf4Z4r/kBF8oR0Q7mzxd4r/WfH3JElAf1xjxK+l8PgYv24IYYwXf078T4i/T4O1tqV8TIKjYvi3IvqqLxNjK7xvaCsBnaUJYl8Re6rYP0QEoL46sf8W+2mx9Q2ZCeg6mya2rtNFYrdFJPCh2K/FaE8XWyfPTOCS2C+L/V3MrDVEJNAQ01e1dWyNzYQeZF+Kvw64w8MfZaX4T1L8R3xSuJVOI+80dZvdJ/0THWQN+Pu3BvmF83XI83qCH1qh7z3Drpc+hbLkcyO56xLLnCQJZPCLuRbh1ALXgAXyfIv0+9G18LMt0meBmyQtI1qk32VS3CRuxz9gssJ53RDslH7vuRZ1WGXwN4LRhta2pMFDUNrqgbYupk8j/qEz0TX9woqrKt8Xfj/BXWsqfCIivQSXtsWwU/iHQz4tEHdG6MxwY4X5H6cNHmASwXWffplZH9gVBOdHmNsc8jeLrwf7zqcK/7LrCsFbLAlviFgeOOeSC2OxcK4yuIYaY0yGfkZOcto63pJSgy+gXQTv4FeoB4XTnkBHa/sqHp4vSZZaYmQZXCJ/Lf4JBEVaeOAmQ0c/VW8DzwjnGxlnKNeWg/AkwV1lHlgqvlYJrBt7v87gr+9W4Sx1z4+4McuKLPAR/ql8SoLaGqGh9z2nxF9JUPBleUyYil8qvBDBrzf40xkCEt2zRKCFwcvlJ+DXCP5vwM8hO0PwH59hg1U6xGElyX4zjxx6Y9BPsltkq7SYPxwJjGAE/wXcB8J8eESa001CAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAzLTE2VDAxOjEzOjM4KzAwOjAw6TzNwwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMy0xNlQwMToxMzozOCswMDowMJhhdX8AAAAodEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL3RtcC9tYWdpY2stQ092U29IUHBpvouTAAAAAElFTkSuQmCC"
                            , name: "Radio Tower"
                        })
                    }
                }

                return this.symbolSvc.GetAPRSSymbol(this.stationSettingsStore.stationSettings.symbol, this.stationSettingsStore.stationSettings.symbolOverlay)
            }
        }
    })
</script>

<style scoped lang="sass">
.avatar-img
    background: transparent
</style>

