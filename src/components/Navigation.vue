<template id="Navigation">
    <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            permanent
            app>

        <v-list-item>
            <v-list-item-avatar>
                <v-img
                        :src="require('../assets/radio-tower.png')"
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

        <v-divider></v-divider>

        <v-list dense>
            <v-list-item
                    v-for="item in items"
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
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import { StationSettings } from 'js-aprs-engine';

    export default {
        computed: {
            callsign() {
                return StationSettings.callsign;
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
                    , { title: 'Settings', icon: 'settings', action: "/settings" }
                    , { title: 'About', icon: 'info', action: "/about" }
                ]
                , mini: true
            }
        }
    }
</script>