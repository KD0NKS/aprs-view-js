import { StationSettings } from 'js-aprs-engine';
import Vue from 'vue';
import Vuex from 'vuex';
import { IStationSettings } from 'js-aprs-engine';
import { StationSettingsViewModel } from './models/StationSettingsViewModel';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stationSettings: new StationSettingsViewModel()
    },
    mutations: {
        setStationSettings(state, settings: IStationSettings) {
            state.stationSettings = settings;

            StationSettings.callsign = state.stationSettings.callsign;
            StationSettings.passcode = state.stationSettings.passcode;
            StationSettings.ssid = state.stationSettings.ssid;
            StationSettings.symbol = state.stationSettings.symbol;
            StationSettings.symbolOverlay = state.stationSettings.symbolOverlay;

            StationSettings.NotifyObservers();
        }
    },
    actions: {
        getStationSettings({ state, commit }) {
            commit('setStationSettings', StationSettings);
        }
    },
    getters: {
        StationSettings(state) {
            return state.stationSettings;
        }
    }
});