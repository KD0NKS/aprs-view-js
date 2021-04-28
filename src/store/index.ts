import * as _ from 'lodash'
import ActionTypes from '../ActionTypes'
import { ConnectionService } from '@/services'
import GetterTypes from '../GetterTypes'
import Store from 'electron-store'
import MutationTypes from '../MutationTypes'
import Vue from 'vue'
import Vuex from 'vuex'
import { Connection, IConnection, IMapSettings, IStationSettings, MapSettings, StationSettings } from '@/models'
import { aprsPacket } from 'js-aprs-fap'
import { ConnectionViewModel } from '@/models/ConnectionViewModel'
import { Mapper } from '@/utils/mappers'

Vue.use(Vuex)

const persistentStorage = new Store();

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: new Array<aprsPacket>()
        , connectionService: new ConnectionService()
        , mapSettings: new MapSettings()
        , stationSettings: new StationSettings()
    },
    mutations: {
        [MutationTypes.ADD_CONNECTION](state, connection: IConnection) {
            state.connectionService.addConnection(connection)

            persistentStorage.set(`connections.${connection.id}`, Mapper.Map<ConnectionViewModel>(connection, ConnectionViewModel))
        },
        [MutationTypes.DELETE_CONNECTION](state, connectionId: string) {
            state.connectionService.deleteConnection(connectionId)
            persistentStorage.delete(`connections.${connectionId}`)
        },
        [MutationTypes.SAVE_CONNECTION](state, connectionProps: ConnectionViewModel) {
            const connection = state.connectionService.getConnection(connectionProps.id)

            if(connection) {
                Mapper.CopyInto<ConnectionViewModel, Connection>(connectionProps, connection)

                persistentStorage.set(`connections.${connectionProps.id}`, Mapper.Map<ConnectionViewModel>(connection, ConnectionViewModel))
            }
        },
        [MutationTypes.SET_MAP_SETTINGS](state, settings: IMapSettings) {
            Mapper.CopyInto<IMapSettings, MapSettings>(settings, state.mapSettings)

            persistentStorage.set('mapSettings', state.mapSettings)
        },
        [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            Vue.set(state.stationSettings, 'callsign', settings.callsign)
            Vue.set(state.stationSettings, 'passcode', settings.passcode)
            Vue.set(state.stationSettings, 'ssid', settings.ssid)
            Vue.set(state.stationSettings, 'symbol', settings.symbol)
            Vue.set(state.stationSettings, 'symbolOverlay', settings.symbolOverlay)

            this.state.connectionService.ChangeEvent()

            persistentStorage.set('stationSettings', Mapper.Map<StationSettings>(state.stationSettings, StationSettings))
        }
    },
    actions: {
        [ActionTypes.ADD_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.ADD_CONNECTION, connection)
        },
        [ActionTypes.ADD_DATA]({ state }, packet: string) {
            state.aprsData.push(packet)
        },
        [ActionTypes.ADD_PACKET]({ state }, packet: aprsPacket) {
            state.aprsPackets.push(packet)
        },
        [ActionTypes.REMOVE_PACKETS]({ state }, ids: string[]) {
            _.remove(state.aprsPackets, function(p) { return _.includes(ids, p.id) })
        }
    },
    getters: {
        [GetterTypes.GET_PACKET]: state => id => {
            return state.aprsPackets.find((packet) => packet.id == id)
        },
        [GetterTypes.MAP_SETTINGS](state) {
            return state.mapSettings
        },
        [GetterTypes.STATION_SETTINGS](state) {
            return state.stationSettings
        }
    }
})


