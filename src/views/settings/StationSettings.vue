<template>
    <div class="stationSettings" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Station Settings</h1>
        </div>

        <v-form 
                @submit.prevent="saveStationInfo"
                id="station-settings-form"
                v-model="isStationSettingsValid"
                >
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12 md8 class="px-2">
                        <v-text-field
                                v-model="stationInfo.callsign"
                                label="Callsign"
                                :rules="[rules.required]"
                                >
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md4 class="px-2">
                        <v-text-field v-model="stationInfo.ssid"
                                label="ssid"
                                >
                        </v-text-field>
                    </v-flex>
                </v-layout>
                
                <v-layout row wrap>
                    <v-flex xs12 class="px-2">
                        <v-text-field v-model="stationInfo.passcode"
                                label="Passcode"
                                :rules="[rules.required]">
                        </v-text-field>
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs12 class="px-2">
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
                    <v-flex xs12 class="px-2">
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

                <v-layout row wrap>
                    <v-flex xs12 class="px-2">
                        <v-btn color="primary" class="mr-4" type="submit" :disabled="!isStationSettingsValid" form="station-settings-form">Save</v-btn>
                        <v-btn color="normal" class="mr-4" @click="resetStationInfo">Reset</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
	</div>
</template>

<script lang="ts">
    import { APRSSymbolService, StationSettings, StringUtil } from 'js-aprs-engine';
    
    let symbolSvc = new APRSSymbolService();
    
    export default {
        data: () => ({
            isStationSettingsValid: true
            , stationInfo: {
                // TODO: Make mutation file for settings and set these one at a time.
                callsign: StationSettings.callsign
                , passcode: StationSettings.passcode
                , ssid: StationSettings.ssid
                , symbol: StationSettings.symbol
                , symbolOverlay: StationSettings.symbol
            }, rules: {
                required: value => !!value || 'Required.',
            }
        })
        , created() {
            // load settings here
            //https://jsfiddle.net/awolf2904/3rabkzsn/1/
            //store.dispatch('getStationSettings');
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
                    StationSettings.callsign = this.stationInfo.callsign;
                    StationSettings.passcode = this.stationInfo.passcode;
                    StationSettings.ssid = this.stationInfo.ssid;
                    StationSettings.symbol = this.stationInfo.symbol;
                    StationSettings.symbolOverlay = this.stationInfo.symbolOverlay;
                }
            }
            , resetStationInfo() {
                this.stationInfo.callsign = StationSettings.callsign;
                this.stationInfo.passcode = StationSettings.passcode;
                this.stationInfo.ssid = StationSettings.ssid;
                this.stationInfo.symbol = StationSettings.symbol;
                this.stationInfo.symbolOverlay = StationSettings.symbolOverlay;
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
