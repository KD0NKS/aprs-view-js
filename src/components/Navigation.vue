<template id="Navigation">
    <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            :mini-variant-width="60"
            permanent
            app>
        <v-list>
            <v-list-item :class="mini && 'px-2'">
                <v-list-item-avatar tile>
                    <v-img
                        :key="symbol.key"
                        :src="symbol.value"
                        class="my-3"
                        contain>
                    </v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ callsign }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                    <v-btn text icon @click.stop="mini = !mini">
                        <v-icon>chevron_left</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>

            <div v-for="item in items" :key="item.title">
                <v-list-item
                        v-if="!item.subLinks"
                        :key="item.title"
                        :to="item.action"
                        >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group
                        v-else
                        :key="item.title"
                        no-action
                        :prepend-icon="item.icon"
                        :value="false">
                    <template v-slot:activator>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </template>

                    <v-list-item
                            v-for="sublink in item.subLinks"
                            :key="sublink.title"
                            :to="sublink.action"
                            >
                        <v-list-item-content>
                            <v-list-item-title>{{ sublink.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </div>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import APRSSymbol from '@/models/APRSSymbol'
    import { APRSSymbolService } from '@/services/APRSSymbolService'
    import Component from 'vue-class-component'
    import store from '@/store'
    import Vue from 'vue'
    import { StringUtil } from '@/utils'

    @Component({})
    export default class Navigation extends Vue {
        private symbolSvc: APRSSymbolService = new APRSSymbolService()
        private drawer = true
        private items = [
            /*
            { title: 'Dashboard', icon: 'dashboard', action: "/" }
            , { title: 'Messages', icon: 'message', action: "/messages" }
            */
            { title: 'Map', icon: 'map', action: '/map' }
            , { title: 'Output', icon: 'mdi-console-line', action: "/output" }
            , { title: 'Settings', icon: 'settings'
                , subLinks: [
                    { title: 'Station', action: '/stationSettings' }
                    , { title: 'Connections', action: '/connectionSettings' }
                ]
            }
            , { title: 'About', icon: 'info', action: "/about" }
        ]
        private mini = true

        private get callsign(): string {
            if(!StringUtil.IsNullOrWhiteSpace(store.state?.stationSettings?.ssid)) {
                return `${store?.state?.stationSettings?.callsign}-${store.state.stationSettings.ssid}`
            }

            return store?.state?.stationSettings?.callsign ?? ''
        }

        private get symbol(): APRSSymbol {
            if(StringUtil.IsNullOrWhiteSpace(store?.state?.stationSettings?.symbol)) {
                return new APRSSymbol({
                    key: "logo"
                    , value: require('@/assets/radio-tower.png')
                    , name: "Radio Tower"
                    })
            } else {
                return this.symbolSvc.GetSymbolByKey(store.state.stationSettings.symbol)
            }
        }
    }
</script>
