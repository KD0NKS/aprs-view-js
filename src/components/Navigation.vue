<template id="Navigation">
    <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            permanent
            app>
        <v-list>
            <v-list-item :class="mini && 'px-2'">
                <v-list-item-avatar>
                    <v-img
                            :src="icon"
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
    import { APRSSymbolService, StationSettings } from 'js-aprs-engine';
    let symbolSvc = new APRSSymbolService();

    export default {
        computed: {
            callsign() {
                if(StationSettings.ssid) {
                    return `${StationSettings.callsign}-${StationSettings.ssid}`;
                }

                return StationSettings.callsign;
            },
            icon() {
                if(!StationSettings.symbol) {
                    return require('../assets/radio-tower.png');
                } else {
                    return this.getImgUrl(symbolSvc.GetSymbolByKey(StationSettings.symbol).value);
                }
            },
            symbol() {
                return StationSettings.symbol;
            }
        }
        , data() {
            return {
                drawer: true
                , items: [
                    /*
                    { title: 'Dashboard', icon: 'dashboard', action: "/" }
                    , { title: 'Map', icon: 'map', action: '/map' }
                    , { title: 'Messages', icon: 'message', action: "/messages" }
                    */
                    { title: 'Output', icon: 'mdi-console-line', action: "/output" }
                    , { title: 'Settings', icon: 'settings'
                        , subLinks: [
                            { title: 'Station', action: '/stationSettings' }
                            , { title: 'Connections', action: '/connectionSettings' }
                        ] 
                    }
                    , { title: 'About', icon: 'info', action: "/about" }
                ]
                , mini: true
            }
        }
        , methods: {
            getImgUrl(url: string) {
                // TODO: This will be incorrect once js-aprs-engine is a full blown npm module
                return require('js-aprs-engine/dist/' + url);
            }
        }
    }
</script>