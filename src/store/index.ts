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
import { ConnectionViewModel } from '@/models/ConnectionViewModel'
import { Mapper } from '@/utils/mappers'
import { stat } from 'original-fs'
import { BusEventTypes } from '@/enums'
import { SoftwareSettings } from '@/models/SoftwareSettings'
import { ISoftwareSettings } from '@/models/ISoftwareSettings'

Vue.use(Vuex)

const persistentStorage = new Store();

export default new Vuex.Store({
    state: {
        aprsData: []
        , aprsPackets: new Array<aprsPacket>()
        , connectionService: new ConnectionService()
        , mapSettings: new MapSettings()
        , packetTimer: null
        , softwareSettings: new SoftwareSettings()
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
        [MutationTypes.REMOVE_PACKETS](state, ids: string[]) {
            _.remove(state.aprsPackets, function (p) { return _.includes(ids, p.id) })
            bus.$emit(BusEventTypes.PACKETS_REMOVED, ids)
        },
        [MutationTypes.RESET_PACKET_TIMER](state, minutes) { // TODO: This is a terrible hack for now
            // Clear the timer
            if(state.packetTimer)
                clearInterval(state.packetTimer)

            // Remove any packets that wouldn't fit the time filtering
            this.commit(MutationTypes.REMOVE_PACKETS, state.aprsPackets.filter(packet => (new Date().getTime() - packet.receivedTime) >= (minutes * 60000)).map(p => p.id))

            // Set the interval to the new time
            state.packetTimer = setInterval(() => {
                this.commit(MutationTypes.REMOVE_PACKETS, state.aprsPackets.filter(packet => (new Date().getTime() - packet.receivedTime) >= (minutes * 60000)).map(p => p.id))
            }, 60000) // 60000ms per minute
        },
        [MutationTypes.SAVE_CONNECTION](state, connectionProps: ConnectionViewModel) {
            const connection = state.connectionService.getConnection(connectionProps.id)

            if(connection) {
                Mapper.CopyInto<ConnectionViewModel, Connection>(connectionProps, connection)

                persistentStorage.set(`connections.${connectionProps.id}`, Mapper.Map<ConnectionViewModel>(connection, ConnectionViewModel))
            }
        },
        [MutationTypes.SET_MAP_SETTINGS](state, settings: IMapSettings) {
            if(settings.pointLifetime != state.mapSettings.pointLifetime)
                this.commit(MutationTypes.RESET_PACKET_TIMER, settings.pointLifetime)

            Mapper.CopyInto<IMapSettings, MapSettings>(settings, state.mapSettings)

            persistentStorage.set('mapSettings', state.mapSettings)
        },
        [MutationTypes.SET_SOFTWARE_SETTINGS](state, settings: ISoftwareSettings) {
            Mapper.CopyInto<ISoftwareSettings, SoftwareSettings>(settings, state.softwareSettings)

            persistentStorage.set('softwareSettings', state.softwareSettings)
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
            this.commit(MutationTypes.REMOVE_PACKETS, ids)
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


