import { ConnectionManager, IConnection, StationSettings } from 'js-aprs-engine';
import Vue from 'vue';
import Vuex from 'vuex';
import { IStationSettings } from 'js-aprs-engine';
import ActionTypes from './ActionTypes';
import MutationTypes from './MutationTypes';
import GetterTypes from './GetterTypes';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: []
        , stationSettings: null
    },
    mutations: {
        [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
            if(state.stationSettings == null)
                state.stationSettings = StationSettings;
            
            // state.stationSettings.propname = settings.propname doesn't work here
            Vue.set(state.stationSettings, 'callsign', settings.callsign);
            Vue.set(state.stationSettings, 'passcode', settings.passcode);
            Vue.set(state.stationSettings, 'ssid', settings.ssid);
            Vue.set(state.stationSettings, 'symbol', settings.symbol);
            Vue.set(state.stationSettings, 'symbolOverlay', settings.symbolOverlay);
        },
        saveSSID(state, ssid: string) {
            state.stationSettings.ssid = ssid;
        },
        saveSymbol(state, symbol: string) {
            state.stationSettings.symbol = symbol;
        }
    },
    actions: {
        [ActionTypes.INIT_STATION_SETTINGS]({ commit }) {
            commit(MutationTypes.SET_STATION_SETTINGS, StationSettings);
        },
        [ActionTypes.ADD_CONNECTION]({ state }, connection: IConnection) {
            ConnectionManager.addConnection(connection);
        },
        [ActionTypes.ADD_DATA]({ state }, packet: String) {
            state.aprsData.push(packet);
        },
        [ActionTypes.ADD_PACKET]({ state }, packet: String) {
            state.aprsPackets.push(packet);
        }
    },
    getters: {
        [GetterTypes.CONNECTION_MANAGER]() {
            return ConnectionManager;
        }
        , [GetterTypes.DATA_CONNECTIONS](state) {
            return ConnectionManager.getConnections().values();
        }
        , [GetterTypes.STATION_SETTINGS](state) {
            return state.stationSettings;
        }
    }
});