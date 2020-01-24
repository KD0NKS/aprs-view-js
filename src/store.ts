import { ConnectionManager, IConnection, StationSettings } from 'js-aprs-engine';
import Vue from 'vue';
import Vuex from 'vuex';
import { IStationSettings } from 'js-aprs-engine';
import { StationSettingsViewModel } from './models/StationSettingsViewModel';
import ActionTypes from './ActionTypes';
import MutationTypes from './MutationTypes';
import GetterTypes from './GetterTypes';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: []
        ,stationSettings: new StationSettingsViewModel()
    },
    mutations: {
        [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
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