<template>
    <v-expansion-panel>
        <v-expansion-panel-header>Station Settings</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form 
                    @submit.prevent="saveStationInfo"
                    id="station-settings-form"
                    v-model="isStationSettingsValid"
                    >
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs12 md8>
                            <v-text-field
                                    v-model="stationInfo.callsign"
                                    label="Callsign"
                                    :rules="[rules.required]"
                                    >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-text-field v-model="stationInfo.ssid"
                                    label="ssid"
                                    >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field v-model="stationInfo.passcode"
                                    label="Passcode"
                                    :rules="[rules.required]">
                            </v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-select 
                                    :items="aprsSymbols"
                                    v-model="stationInfo.symbol"
                                    label="Station Symbol"
                                    item-text="name"
                                    item-value="key"
                                    max-height="auto"
                                    :clearable=true
                                    @blur="updateSymbol(`${stationInfo.symbol}`)"
                                    @change="updateSymbol(`${stationInfo.symbol}`)"
                                    >
                                <template slot="selection" slot-scope="data">
                                    <v-chip
                                            :input-value="data.selected"
                                            :key="JSON.stringify(data.item)"
                                            :label=true
                                            :outlined=true
                                            @input="data.parent.selectItem(data.item)"
                                            >
                                        <v-avatar>
                                            <img :src="getImgUrl(data.item.value)">
                                        </v-avatar>
                                        {{ data.item.name }}
                                    </v-chip>
                                </template>
                                <template slot="item" slot-scope="data">
                                    <v-list-item-avatar :tile=true>
                                        <img :src="getImgUrl(data.item.value)">
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-select
                                    :items="aprsSymbolOverlays"
                                    v-model="stationInfo.symbolOverlay"
                                    label="Symbol Overlay"
                                    item-text="name"
                                    item-value = "key"
                                    max-height="auto"
                                    :disabled="!isOverlayEnabled"
                                    :clearable=true
                                    @blur="updateOverlay(`${stationInfo.symbolOverlay}`)"
                                    @change="updateOverlay(`${stationInfo.symbolOverlay}`)"
                                    >
                                <template slot="selection" slot-scope="data">
                                    <v-chip
                                            :input-value="data.selected"
                                            :key="JSON.stringify(data.item)"
                                            :label=true
                                            :outlined=true
                                            @input="data.parent.selectItem(data.item)"
                                            >
                                        <v-avatar>
                                            <img :src="getImgUrl(data.item.value)">
                                        </v-avatar>
                                        {{ data.item.name }}
                                    </v-chip>
                                </template>
                                <template slot="item" slot-scope="data">
                                    <template>
                                        <v-list-item-avatar :tile=true>
                                            <img :src="getImgUrl(data.item.value)">
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </template>
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-btn color="success" class="mr-4" type="submit" :disabled="!isStationSettingsValid" form="station-settings-form">Save</v-btn>
                <v-btn color="error" class="mr-4" @click="resetStationInfo">Reset</v-btn>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script lang="ts">
    import { APRSSymbol, APRSSymbolService, StationSettings, StringUtil } from 'js-aprs-engine';
    import store from '../../store';
    
    let symbolSvc = new APRSSymbolService();

    export default {
        data: () => ({
            isStationSettingsValid: true
            , items: ['Foo', 'Bar', 'Fizz', 'Buzz']
            , model: 'Foo'
            , stationInfo: {
                callsign: store.state.stationSettings.callsign
                , passcode: store.state.stationSettings.passcode
                , ssid: store.state.stationSettings.ssid
                , symbol: store.state.stationSettings.symbol
                , symbolOverlay: store.state.stationSettings.symbol
            }, rules: {
                required: value => !!value || 'Required.',
            }
        })
        , created() {
            // load settings here
            //https://jsfiddle.net/awolf2904/3rabkzsn/1/
            store.dispatch('getStationSettings');
        }
        , computed: {
            aprsSymbols() {
                return symbolSvc.GetSymbols();
            }
            , aprsSymbolOverlays() {
                return symbolSvc.GetOverlays();
            }
            , isOverlayEnabled(): boolean {
                return !StringUtil.IsNullOrWhiteSpace(this.stationInfo.symbol)
                        && symbolSvc.GetSymbolByKey(this.stationInfo.symbol).isAllowOverlay === true
                        ;
            }
        }
        , methods: {
            getImgUrl(url: string) {
                // TODO: This will be incorrect once js-aprs-engine is a full blown npm module
                return require('js-aprs-engine/dist/' + url);
            }, saveStationInfo() {
                if(this.isStationSettingsValid) {
                    store.commit('setStationSettings', {
                        callsign: this.stationInfo.callsign
                        , passcode: this.stationInfo.passcode
                        , ssid: this.stationInfo.ssid
                    });
                }
            }
            , resetStationInfo() {
                this.stationInfo.callsign = store.state.stationSettings.callsign;
                this.stationInfo.passcode = store.state.stationSettings.passcode;
                this.stationInfo.ssid = store.state.stationSettings.ssid;
                this.stationInfo.symbol = store.state.stationSettings.symbol;
                this.stationInfo.symbolOverlay = store.state.stationSettings.symbolOverlay;
            }
            , updateSymbol(key: string) {
                // Dropdowns are being special and set this as a string, not an actual null/undefined value.
                this.stationInfo.symbol = (key === 'undefined') ? undefined : key

                let symbol = this.stationInfo.symbol ? symbolSvc.GetSymbolByKey(this.stationInfo.symbol) : null;

                if(symbol == null || symbol.isAllowOverlay === false) {
                    this.stationInfo.symbolOverlay = undefined;
                }
            }
            , updateOverlay(key: string) {
                this.stationInfo.symbolOverlay = key;
            }
        }
    }
</script>