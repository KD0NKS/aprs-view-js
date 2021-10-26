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
import { aprsPacket } from 'js-aprs-fap'
import { MapSettings, SoftwareSettings, StationSettings } from './models'

// NOTE!  When listening to bus, you MUST stop listening to events before destroying the component.
// Failure to do so will result in n + 1 events being triggered
// https://stackoverflow.com/questions/41879836/vue-js-method-called-multiple-times-using-emit-and-on-when-it-should-only-be-c
export const bus = new Vue()

const persistentStorage = new Store()

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        const _mapper = new Mapper()

        // Load station settings.
        const mapSettings = _mapper.Map<MapSettings>(persistentStorage.get('mapSettings'), MapSettings)
        const softwareSettings = _mapper.Map<SoftwareSettings>(persistentStorage.get('softwareSettings'), SoftwareSettings)
        const stationSettings = _mapper.Map<StationSettings>(persistentStorage.get('stationSettings'), StationSettings)

        if(mapSettings) {
            this.$store.dispatch(ActionTypes.SET_MAP_SETTINGS, mapSettings)
        }

        if(softwareSettings) {
            this.$store.dispatch(ActionTypes.SET_SOFTWARE_SETTINGS, softwareSettings)
        }

        if(stationSettings) {
            this.$store.dispatch(ActionTypes.SET_STATION_SETTINGS, stationSettings)
        }

        // Load connections.
        _.forEach(Object.entries(persistentStorage.get('connections')), (element) => {
            // Create a new connection by using the element and mapping it to a connection view model
            this.$store.state.connectionService.addConnection(element[1])
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
