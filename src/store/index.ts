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
import { PacketUtil } from '@/utils'
import { EventedArray } from '@/models/arrays/EventedArray'

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
    //, aprsPackets: Array<aprsPacket>
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
const packetUtil: PacketUtil = new PacketUtil()
const maxDataLength = 200

/* NOTE!  For performance reasons, DO NOT use a state level array for this! */
const aprsPackets = new EventedArray<aprsPacket>()

export default store(function (/* { ssrContext } */) {
    const Store = createStore<IState>({
        state: {
            aprsData: []
            //, aprsPackets: new Array<aprsPacket>()
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
            , async [MutationTypes.ADD_DATA](state, data: string) {
                state.aprsData.push(data)

                // TODO: This should probably be a setting to cache x amount of data.
                if(state.aprsData.length > maxDataLength) {
                    state.aprsData.slice(100)
                }

                return
            }
            , async [MutationTypes.ADD_PACKET](state, packet: aprsPacket) {
                aprsPackets.push(packet)
                return
            }
            , async [MutationTypes.CLEAR_OLD_PACKETS](state) {
                // DO NOT! use lodash here.  Its internal bowels use Array.prototype.splice rather than the given array's overridden version.
                aprsPackets.remove(packet => (
                    (new Date().getTime() - packet.receivedTime) >= (state.mapSettings.pointLifetime * 60000)
                    && (packet.latitude != null || packet.longitude != null)
                ))

                return
            }
            , [MutationTypes.DELETE_CONNECTION](state, connectionId: string) {
                const index = _.findIndex(state.connections, c => c.id == connectionId)

                if(index > -1) {
                    state.connections.splice(index, 1)
                    LocalStorage.remove(`connections.${connectionId}`)
                }
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
            , async [ActionTypes.ADD_DATA]({ commit }, packet: string) {
                commit(MutationTypes.ADD_DATA, packet)
                return
            }
            , async [ActionTypes.ADD_PACKET]({ commit }, packet: aprsPacket) {
                commit(MutationTypes.ADD_PACKET, packet)
                return
            }
            , async [ActionTypes.CLEAR_OLD_PACKETS]({ commit }) {
                commit(MutationTypes.CLEAR_OLD_PACKETS)
                return
            }
            , [ActionTypes.DELETE_CONNECTION]({ commit }, connectionId: string) {
                commit(MutationTypes.DELETE_CONNECTION, connectionId)
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
            , [GetterTypes.GET_PACKET]: state => id => _.find(aprsPackets, p => p.id == id)
            , [GetterTypes.GET_PACKETS]: state => aprsPackets
            , [GetterTypes.GET_PACKETS_BY_NAME]: state => name => _.filter(aprsPackets, p => (p.itemname == name || p.objectname == name || p.sourceCallsign == name))
            , [GetterTypes.MAP_SETTINGS]: state => state.mapSettings
            , [GetterTypes.SOFTWARE_SETTINGS]: state => state.softwareSettings
            , [GetterTypes.STATION_SETTINGS]: state => state.stationSettings
        }

        // enable strict mode (adds overhead!)
        // for dev mode and --debug builds onl
        , strict: !!process.env.DEBUGGING,
    })

    let dataListener = global.connectionService.getDataStream((data) => {
        Store.dispatch(ActionTypes.ADD_DATA, data.toString())
    })

    let packetListener = global.connectionService.getPacketStream((packet) => {
        Store.dispatch(ActionTypes.ADD_PACKET, packet)
    })

    onbeforeunload = () => {
        dataListener()
        packetListener()
    }

    return Store
})

export function useStore() {
    return vuexUseStore(storeKey)
}
