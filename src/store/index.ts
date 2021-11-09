import Vue from 'vue'
import Vuex from 'vuex'
import { bus } from '@/main'

import * as _ from 'lodash'
import Store from 'electron-store'

import ActionTypes from '@/ActionTypes'
import GetterTypes from '@/GetterTypes'
import MutationTypes from '@/MutationTypes'

import { BusEventTypes } from '@/enums'

import { aprsPacket } from 'js-aprs-fap'
import { Mapper } from '@/utils/mappers'
import { IMapSettings, MapSettings, ISoftwareSettings, IStationSettings , SoftwareSettings, StationSettings, IConnection } from '@/models'

import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
import { ConnectionService } from '@/services'

Vue.use(Vuex)

const persistentStorage = new Store()
const _mapper = new Mapper()

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: new Array<aprsPacket>()
        , mapSettings: new MapSettings()
        , packetTimer: undefined
        , softwareSettings: new SoftwareSettings()
        , stationSettings: new StationSettings()
        , connectionService: new ConnectionService()
    },
    mutations: {
        [MutationTypes.ADD_CONNECTION](state, settings: IConnection) {
            persistentStorage.set(`connections.${settings.id}`, _mapper.Map<ConnectionViewModel>(settings, ConnectionViewModel))
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
            persistentStorage.delete(`connections.${connectionId}`)
        },
        [MutationTypes.REMOVE_PACKETS](state, ids: string[]) {
            _.remove(state.aprsPackets, function (p) { return _.includes(ids, p.id) })
            bus.$emit(BusEventTypes.PACKETS_REMOVED, ids)
        },
        [MutationTypes.SAVE_CONNECTION](state, connectionProps: ConnectionViewModel) {
            if(connectionProps && connectionProps.id) {
                persistentStorage.set(`connections.${connectionProps.id}`, connectionProps)
            }
            // TODO: Error notification to tell user saving failed
        },
        [MutationTypes.SET_MAP_SETTINGS](state, settings: IMapSettings) {
            if(!this.packetTimer) {
                // Set the interval to the new time
                this.packetTimer = setInterval(
                    () => this.dispatch(ActionTypes.CLEAR_OLD_PACKETS)
                    , 60000) // 60000ms per minute
            }

            if(settings.pointLifetime != state.mapSettings.pointLifetime) {
                this.dispatch(ActionTypes.CLEAR_OLD_PACKETS)
            }

            _mapper.CopyInto<IMapSettings, MapSettings>(settings, state.mapSettings)

            persistentStorage.set('mapSettings', state.mapSettings)
        },
        [MutationTypes.SET_SOFTWARE_SETTINGS](state, settings: ISoftwareSettings) {
            _mapper.CopyInto<ISoftwareSettings, SoftwareSettings>(settings, state.softwareSettings)

            persistentStorage.set('softwareSettings', _mapper.Map<SoftwareSettings>(state.softwareSettings, SoftwareSettings))
        },
        [MutationTypes.SET_STATION_SETTINGS](state, settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            Vue.set(state.stationSettings, 'callsign', settings.callsign)
            Vue.set(state.stationSettings, 'passcode', settings.passcode)
            Vue.set(state.stationSettings, 'ssid', settings.ssid)
            Vue.set(state.stationSettings, 'symbol', settings.symbol)
            Vue.set(state.stationSettings, 'symbolOverlay', settings.symbolOverlay)

            state.connectionService.ChangeEvent()

            persistentStorage.set('stationSettings', _mapper.Map<StationSettings>(state.stationSettings, StationSettings))
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
        [ActionTypes.SET_MAP_SETTINGS]({ commit }, settings: IMapSettings) {
            commit(MutationTypes.SET_MAP_SETTINGS, settings)
        },
        [ActionTypes.SET_SOFTWARE_SETTINGS]({ commit }, settings: ISoftwareSettings) {
            commit(MutationTypes.SET_SOFTWARE_SETTINGS, settings)
        },
        [ActionTypes.SET_STATION_SETTINGS]({ commit }, settings: IStationSettings) {
            commit(MutationTypes.SET_STATION_SETTINGS, settings)
        }
    },
    getters: {
        [GetterTypes.APP_ID]() {
            return 'js-aprs-view 0.0.1'
        }
        , [GetterTypes.GET_PACKET]: state => id => {
            return state.aprsPackets.find((packet) => packet.id == id)
        }
        , [GetterTypes.GET_PACKETS_BY_NAME]: state => name => {
            return _.filter(state.aprsPackets, p => (p.itemname == name || p.objectname == name || p.sourceCallsign == name))
        }
        , [GetterTypes.MAP_SETTINGS](state) {
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
