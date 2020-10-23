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
        , connectionManager: null
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
        }, [MutationTypes.ADD_CONNECTION](state, connection: IConnection) {
            state.connectionManager.addConnection(connection);
        }, [MutationTypes.INIT_CONNECTION_MANAGER](state) {
            state.connectionManager = ConnectionManager;
        }
    },
    actions: {
        [ActionTypes.INIT_STATION_SETTINGS]({ commit }) {
            commit(MutationTypes.SET_STATION_SETTINGS, StationSettings);
            commit(MutationTypes.INIT_CONNECTION_MANAGER);
        },
        [ActionTypes.ADD_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.ADD_CONNECTION, connection);
        },
        [ActionTypes.ADD_DATA]({ state }, packet: String) {
            state.aprsData.push(packet);
        },
        [ActionTypes.ADD_PACKET]({ state }, packet: String) {
            state.aprsPackets.push(packet);
        }
    },
    getters: {
        [GetterTypes.STATION_SETTINGS](state) {
            return state.stationSettings;
        }
    }
});