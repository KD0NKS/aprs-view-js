import _ from 'lodash'
import { LocalStorage } from 'quasar'

import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex'
import { store } from 'quasar/wrappers'
import { InjectionKey } from 'vue'

import { ActionTypes, GetterTypes, MutationTypes, StorageKeys } from '@/enums'
import { Mapper } from '@/utils/mappers'

import { aprsPacket } from 'js-aprs-fap'

import { IMapSettings, ISoftwareSettings, IStationSettings, MapSettings, SoftwareSettings, StationSettings } from '@/models/settings'
import { IConnection } from '@/models/connections'

//import { ConnectionService } from '@/services'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const _mapper = new Mapper()
const appId = 'js-aprs-view 0.0.1'

export interface IState {
    // Define your own store structure, using submodules if needed
    // example: ExampleStateInterface;
    // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
    aprsData: string[]
    , aprsPackets: Array<aprsPacket>
    , connections: Array<IConnection>
    , packetTimer: any
    , mapSettings: IMapSettings
    , softwareSettings: ISoftwareSettings
    , stationSettings: IStationSettings
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: VuexStore<IState>;
    }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<IState>> = Symbol('vuex-key')

export default store(function (/* { ssrContext } */) {
    const Store = createStore<IState>({
        state: {
            aprsData: []
            , aprsPackets: new Array<aprsPacket>()
            , connections: new Array<IConnection>()
            , mapSettings: new MapSettings()
            , packetTimer: undefined
            , softwareSettings: new SoftwareSettings()
            , stationSettings: new StationSettings()
        }
        , mutations: {
            [MutationTypes.ADD_CONNECTION](state: IState, settings: IConnection) {
                const connection = _.find(state.connections, { id: settings.id })

                if(connection != null) {
                    this.state.connections[settings.id] = settings
                } else {
                    this.state.connections.push(settings)
                }

                global.connectionService.addConnection(settings)
            }
            , [MutationTypes.ADD_PACKET](state, packet: aprsPacket) {
                state.aprsPackets.push(packet)
            }
            , [MutationTypes.CLEAR_OLD_PACKETS](state) {
                const toRemove = _.filter(state.aprsPackets, packet => (new Date().getTime() - packet.receivedTime) >= (state.mapSettings.pointLifetime * 60000)).map(p => p.id)
                this.dispatch(
                    ActionTypes.REMOVE_PACKETS
                    , toRemove)
            }
            , [MutationTypes.DELETE_CONNECTION](state, connectionId: string) {
                const index = _.findIndex(state.connections, c => c.id == connectionId)

                if(index > -1) {
                    state.connections.splice(index, 1)
                    LocalStorage.remove(`connections.${connectionId}`)
                }
            }
            , [MutationTypes.REMOVE_PACKETS](state: IState, ids: string[]) {
                _.remove(state.aprsPackets, function (p) { return _.includes(ids, p.id) })
                //bus.$emit(BusEventTypes.PACKETS_REMOVED, ids)
            }
            , [MutationTypes.SET_MAP_SETTINGS](state: IState, settings: IMapSettings) {
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

                LocalStorage.set(StorageKeys.MAP_SETTINGS, state.mapSettings)
            }
            , [MutationTypes.SAVE_CONNECTION](state: IState, settings: IConnection) {
                let connection = _.find(state.connections, c => c.id == settings.id)

                if(connection != null) {
                    LocalStorage.set(`connections.${settings.id}`, settings.toJSON())

                    _mapper.CopyInto<IConnection, IConnection>(settings, connection)
                    global.connectionService.updateConnection(_.clone(settings))
                }
                // TODO: Error notification to tell user saving failed
            }
            , [MutationTypes.SET_CONNECTION_STATUS](state: IState,  { connectionId, isEnabled }) {
                let connection = _.find(state.connections, c => c.id == connectionId)

                if(connection != null) {
                    connection.isEnabled = isEnabled
                    global.connectionService.setConnectionStatus(connectionId, isEnabled)
                }
            }
            , [MutationTypes.SET_SOFTWARE_SETTINGS](state: IState, settings: ISoftwareSettings) {
                _mapper.CopyInto<ISoftwareSettings, SoftwareSettings>(settings, state.softwareSettings)

                LocalStorage.set(StorageKeys.SOFTWARE_SETTINGS, state.softwareSettings)
            }
            , [MutationTypes.SET_STATION_SETTINGS](state: IState, settings: IStationSettings) {
                // state.stationSettings.propname = settings.propname doesn't work here
                state.stationSettings.callsign = settings.callsign
                state.stationSettings.passcode = settings.passcode
                state.stationSettings.ssid = settings.ssid
                state.stationSettings.symbol = settings.symbol
                state.stationSettings.symbolOverlay = settings.symbolOverlay

                LocalStorage.set(StorageKeys.STATION_SETTINGS, _mapper.Map<StationSettings>(state.stationSettings, StationSettings))

                global.connectionService.updateStationSettings(_.clone(settings))
            }
        }
        , actions: {
            [ActionTypes.ADD_CONNECTION]({ commit}, connection: IConnection) {
                commit(MutationTypes.ADD_CONNECTION, connection)
            }
            , [ActionTypes.ADD_PACKET]({ commit }, packet: aprsPacket) {
                commit(MutationTypes.ADD_PACKET, packet)
            }
            , [ActionTypes.CLEAR_OLD_PACKETS]({ commit }) {
                commit(MutationTypes.CLEAR_OLD_PACKETS)
            }
            , [ActionTypes.DELETE_CONNECTION]({ commit }, connectionId: string) {
                commit(MutationTypes.DELETE_CONNECTION, connectionId)
            }
            , [ActionTypes.REMOVE_PACKETS]({ commit }, ids: string[]) {
                commit(MutationTypes.REMOVE_PACKETS, ids)
            }
            , [ActionTypes.SAVE_CONNECTION]({ commit }, settings: IConnection) {
                commit(MutationTypes.SAVE_CONNECTION, settings)
            }
            , [ActionTypes.SET_CONNECTION_STATUS]({ commit }, { connectionId, isEnabled}) {
                commit(MutationTypes.SET_CONNECTION_STATUS, { connectionId: connectionId, isEnabled: isEnabled })
            }
            , [ActionTypes.SET_MAP_SETTINGS]({ commit }, settings: IMapSettings) {
                commit(MutationTypes.SET_MAP_SETTINGS, settings)
            }
            , [ActionTypes.SET_SOFTWARE_SETTINGS]({ commit }, settings: ISoftwareSettings) {
                commit(MutationTypes.SET_SOFTWARE_SETTINGS, settings)
            }
            , [ActionTypes.SET_STATION_SETTINGS]({ commit }, settings: IStationSettings) {
                commit(MutationTypes.SET_STATION_SETTINGS, settings)
            }
        }
        , getters: {
            [GetterTypes.APP_ID]() {
                return appId
            }
            , [GetterTypes.GET_PACKET]: state => id => {
                return _.find(state.aprsPackets, p => p.id == id)
            }
            , [GetterTypes.GET_PACKETS_BY_NAME]: state => name => {
                return _.filter(state.aprsPackets, p => (p.itemname == name || p.objectname == name || p.sourceCallsign == name))
            }
            , [GetterTypes.MAP_SETTINGS](state) {
                return state.mapSettings
            }
            , [GetterTypes.SOFTWARE_SETTINGS](state) {
                return state.softwareSettings
            }
            , [GetterTypes.STATION_SETTINGS](state) {
                return state.stationSettings
            }
        }

        // enable strict mode (adds overhead!)
        // for dev mode and --debug builds onl
        , strict: !!process.env.DEBUGGING,
    })

    let packetListener = global.connectionService.getPacketStream((packet) => {
        Store.dispatch(ActionTypes.ADD_PACKET, packet)
    })

    return Store
})

export function useStore() {
    return vuexUseStore(storeKey)
}
