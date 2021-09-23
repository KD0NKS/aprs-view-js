import * as _ from 'lodash'
import ActionTypes from '../ActionTypes'
import { bus } from '@/main'
import { ConnectionService } from '@/services'
import GetterTypes from '../GetterTypes'
import Store from 'electron-store'
import MutationTypes from '../MutationTypes'
import Vue from 'vue'
import Vuex from 'vuex'
import { Connection, IConnection, IMapSettings, IStationSettings, MapSettings, StationSettings } from '@/models'
import { aprsPacket } from 'js-aprs-fap'
import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
import { Mapper } from '@/utils/mappers'
import { BusEventTypes } from '@/enums'
import { SoftwareSettings } from '@/models/SoftwareSettings'
import { ISoftwareSettings } from '@/models/ISoftwareSettings'

Vue.use(Vuex)

const persistentStorage = new Store()
let packetTimer = undefined

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: new Array<aprsPacket>()
        , connectionService: new ConnectionService()
        , mapSettings: new MapSettings()
        , softwareSettings: new SoftwareSettings()
        , stationSettings: new StationSettings()
    },
    mutations: {
        [MutationTypes.ADD_CONNECTION](state, connection: IConnection) {
            state.connectionService.addConnection(connection)

            persistentStorage.set(`connections.${connection.id}`, Mapper.Map<ConnectionViewModel>(connection, ConnectionViewModel))
        },
        [MutationTypes.ADD_DATA](state, data: string) {
            state.aprsData.push(data)

            // TODO: This should probably be a setting to cache x amount of data.
            if (state.aprsData.length > 1000) {
                state.aprsData.slice(100)
            }
        },
        [MutationTypes.ADD_PACKET](state, packet: aprsPacket) {
            state.aprsPackets.push(packet)
            bus.$emit(BusEventTypes.PACKET_ADDED, packet)
        },
        [MutationTypes.CLEAR_OLD_PACKETS](state) {
            const toRemove = _.filter(state.aprsPackets, packet => (new Date().getTime() - packet.receivedTime) >= (state.mapSettings.pointLifetime * 60000)).map(p => p.id)
            this.dispatch(
                ActionTypes.REMOVE_PACKETS
                , toRemove)
        },
        [MutationTypes.DELETE_CONNECTION](state, connectionId: string) {
            state.connectionService.deleteConnection(connectionId)
            persistentStorage.delete(`connections.${connectionId}`)
        },
        [MutationTypes.REMOVE_PACKETS](state, ids: string[]) {
            _.remove(state.aprsPackets, function (p) { return _.includes(ids, p.id) })
            bus.$emit(BusEventTypes.PACKETS_REMOVED, ids)
        },
        [MutationTypes.SAVE_CONNECTION](state, connectionProps: ConnectionViewModel) {
            const connection = state.connectionService.getConnection(connectionProps.id)

            if(connection) {
                Mapper.CopyInto<ConnectionViewModel, Connection>(connectionProps, connection)

                persistentStorage.set(`connections.${connectionProps.id}`, Mapper.Map<ConnectionViewModel>(connection, ConnectionViewModel))
            }
        },
        [MutationTypes.SET_MAP_SETTINGS](state, settings: IMapSettings) {
            console.log('set map settings')
            if(settings.pointLifetime != state.mapSettings.pointLifetime) {
                // Clear the timer
                if(!packetTimer) {
                    // Set the interval to the new time
                    packetTimer = setInterval(
                        this.dispatch(ActionTypes.CLEAR_OLD_PACKETS)
                        , 60000) // 60000ms per minute
                }

                // Remove any packets that wouldn't fit the time filtering
                this.dispatch(ActionTypes.CLEAR_OLD_PACKETS)
            }

            Mapper.CopyInto<IMapSettings, MapSettings>(settings, state.mapSettings)

            persistentStorage.set('mapSettings', state.mapSettings)
        },
        [MutationTypes.SET_SOFTWARE_SETTINGS](state, settings: ISoftwareSettings) {
            Mapper.CopyInto<ISoftwareSettings, SoftwareSettings>(settings, state.softwareSettings)

            persistentStorage.set('softwareSettings', Mapper.Map<SoftwareSettings>(state.softwareSettings, SoftwareSettings))
        },
        [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            Vue.set(state.stationSettings, 'callsign', settings.callsign)
            Vue.set(state.stationSettings, 'passcode', settings.passcode)
            Vue.set(state.stationSettings, 'ssid', settings.ssid)
            Vue.set(state.stationSettings, 'symbol', settings.symbol)
            Vue.set(state.stationSettings, 'symbolOverlay', settings.symbolOverlay)

            state.connectionService.ChangeEvent()

            persistentStorage.set('stationSettings', Mapper.Map<StationSettings>(state.stationSettings, StationSettings))
        }
    },
    actions: {
        [ActionTypes.ADD_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.ADD_CONNECTION, connection)
        },
        [ActionTypes.ADD_DATA]({ commit }, packet: string) {
            commit(MutationTypes.ADD_DATA, packet)
        },
        [ActionTypes.ADD_PACKET]({ commit }, packet: aprsPacket) {
            commit(MutationTypes.ADD_PACKET, packet)
        },
        [ActionTypes.CLEAR_OLD_PACKETS]({ commit }) {
            commit(MutationTypes.CLEAR_OLD_PACKETS)
        },
        [ActionTypes.DELETE_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.DELETE_CONNECTION, connection)
        },
        [ActionTypes.REMOVE_PACKETS]({ commit }, ids: string[]) {
            commit(MutationTypes.REMOVE_PACKETS, ids)
        },
        [ActionTypes.SAVE_CONNECTION]({ commit }, connection: IConnection) {
            commit(MutationTypes.SAVE_CONNECTION, connection)
        },
        [ActionTypes.SET_MAP_SETTINGS]({ commit }, settings: IStationSettings) {
            commit(MutationTypes.SET_MAP_SETTINGS, settings)
        }
    },
    getters: {
        [GetterTypes.GET_PACKET]: state => id => {
            return state.aprsPackets.find((packet) => packet.id == id)
        },
        [GetterTypes.MAP_SETTINGS](state) {
            return state.mapSettings
        },
        [GetterTypes.SOFTWARE_SETTINGS](state) {
            return state.softwareSettings
        },
        [GetterTypes.STATION_SETTINGS](state) {
            return state.stationSettings
        }
    }
})
