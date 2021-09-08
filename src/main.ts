import * as _ from 'lodash'
import ActionTypes from './ActionTypes'
import App from './App.vue'
import { DataEventTypes } from '@/enums'
import router from '@/router'
import store from '@/store'
import Store from 'electron-store'
import Vue from 'vue'
//import Vuelidate from 'vuelidate'
import vuetify from '@/plugins/vuetify'
import { Mapper } from '@/utils/mappers'
import MutationTypes from '@/MutationTypes'
import { Connection } from '@/models/connections/Connection'
import { aprsPacket } from 'js-aprs-fap'
import { ConnectionViewModel, MapSettings, StationSettings } from '@/models'
import { SoftwareSettings } from './models/SoftwareSettings'

export const bus = new Vue()

const persistentStorage = new Store()

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        // Load station settings.
        const mapSettings = Mapper.Map<MapSettings>(persistentStorage.get('mapSettings'), MapSettings)
        const softwareSettings = Mapper.Map<SoftwareSettings>(persistentStorage.get('softwareSettings'), SoftwareSettings)
        const stationSettings = Mapper.Map<StationSettings>(persistentStorage.get('stationSettings'), StationSettings)

        if(mapSettings) {
            this.$store.commit(MutationTypes.SET_MAP_SETTINGS, mapSettings)
        }

        if(softwareSettings) {
            this.$store.commit(MutationTypes.SET_SOFTWARE_SETTINGS, softwareSettings)
        }

        if(stationSettings) {
            this.$store.commit(MutationTypes.SET_STATION_SETTINGS, stationSettings)
        }

        // Load connections.
        _.forEach(Object.entries(persistentStorage.get('connections')), (element) => {
            // Create a new connection by using the element and mapping it to a connection view model
            this.$store.dispatch(
                ActionTypes.ADD_CONNECTION
                , new Connection(
                    Mapper.Map<ConnectionViewModel>(element[1], ConnectionViewModel)
                )
            )
        })

        // TODO: packet service - packet settings

        this.$store.state.connectionService.on(DataEventTypes.DATA, (data: string) => {
            this.$store.dispatch(ActionTypes.ADD_DATA, data);
        })

        let packetCount: number = 0 // NOTE: temporary id until database is implemented
        this.$store.state.connectionService.on(DataEventTypes.PACKET, (packet: aprsPacket) => {
            if(packet) {
                packet.id = packetCount.toString()
                this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
                packetCount++
            }
        })

        // TODO: Gracefully kill all connections
        //app.on('before-quit', () => { })
    }
}).$mount('#app');
