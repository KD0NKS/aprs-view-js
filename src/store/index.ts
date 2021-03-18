import ActionTypes from '../ActionTypes'
import { ConnectionService } from '@/services/ConnectionService'
import GetterTypes from '../GetterTypes'
import Store from 'electron-store'
import { IConnection } from '@/models/IConnection'
import IStationSettings from '@/models/IStationSettings'
import MutationTypes from '../MutationTypes'
import Vue from 'vue';
import Vuex from 'vuex';
import { StationSettingsMapper } from '@/utils/mappers'
import { StationSettings } from '@/models/StationSettings'
import { ConnectionProps } from '@/models/ConnectionProps'

Vue.use(Vuex)

const persistentStorage = new Store()
console.log(persistentStorage.get('connections'))

export default new Vuex.Store({
    state: {
        aprsData: new Array<string>()
        , aprsPackets: new Array<string>()
        , connectionService: new ConnectionService()
        , stationSettings: StationSettingsMapper.ObjectToStationSettings(persistentStorage.get('stationSettings')) || new StationSettings()
    },
    mutations: {
        [MutationTypes.SAVE_CONNECTION](state, connectionProps: ConnectionProps) {
            const connection = state.connectionService.getConnection(connectionProps.id)

            if(connection) {
                connection.name = connectionProps.name
                connection.connectionType = connectionProps.connectionType
                connection.host = connectionProps.host
                connection.port = connectionProps.port
                connection.filter = connectionProps.filter
            }
        }
        , [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            Vue.set(state.stationSettings, 'callsign', settings.callsign)
            Vue.set(state.stationSettings, 'passcode', settings.passcode)
            Vue.set(state.stationSettings, 'ssid', settings.ssid)
            Vue.set(state.stationSettings, 'symbol', settings.symbol)
            Vue.set(state.stationSettings, 'symbolOverlay', settings.symbolOverlay)

            this.state.connectionService.ChangeEvent()

            persistentStorage.set('stationSettings', state.stationSettings)
        }, [MutationTypes.ADD_CONNECTION](state, connection: IConnection) {
            state.connectionService.addConnection(connection)
        }
    },
    actions: {
        [ActionTypes.ADD_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.ADD_CONNECTION, connection)
        },
        [ActionTypes.ADD_DATA]({ state }, packet: string) {
            state.aprsData.push(packet)
        },
        [ActionTypes.ADD_PACKET]({ state }, packet: string) {
            state.aprsPackets.push(packet)
        }
    },
    getters: {
        [GetterTypes.STATION_SETTINGS](state) {
            return state.stationSettings
        }
    }
})
