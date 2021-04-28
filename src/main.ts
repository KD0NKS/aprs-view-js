import ActionTypes from './ActionTypes'
import App from './App.vue'
import DataEventTypes from '@/enums/DataEventTypes'
import router from '@/router'
import store from './store'
import Store from 'electron-store'
import Vue from 'vue'
//import Vuelidate from 'vuelidate'
import vuetify from './plugins/vuetify'
import { Mapper } from '@/utils/mappers'
import MutationTypes from './MutationTypes'
import { Connection } from './models/Connection'
import { aprsPacket } from 'js-aprs-fap'
import { BusEventTypes } from './enums'
import { ConnectionViewModel, MapSettings, StationSettings } from './models'

export const bus = new Vue()
const persistentStorage = new Store()

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        // Load station settings.
        const stationSettings = Mapper.Map<StationSettings>(persistentStorage.get('stationSettings'), StationSettings)
        const mapSettings = Mapper.Map<MapSettings>(persistentStorage.get('mapSettings'), MapSettings)

        const MAX_DATA = 2000
        const MAX_PACKET_TTL = 30

        this.$store.commit(MutationTypes.SET_STATION_SETTINGS, stationSettings)

        // Load connections.
        const connections = Object.entries(persistentStorage.get('connections')).map(element => {
            const props = Mapper.Map<ConnectionViewModel>(element[1], ConnectionViewModel)

            return new Connection(props)
        })

        connections.forEach(conn => {
            this.$store.dispatch(ActionTypes.ADD_CONNECTION, conn)
        })

        // TODO: packet service - packet settings

        this.$store.state.connectionService.on(DataEventTypes.DATA, (data: string) => {
            this.$store.dispatch(ActionTypes.ADD_DATA, data);
        })

        let packetCount: number = 0 // NOTE: temporary id until database is implemented
        this.$store.state.connectionService.on(DataEventTypes.PACKET, (packet: aprsPacket) => {
            packet.id = packetCount.toString()
            this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
            packetCount++
        })

        const st = this.$store

        setInterval(function () {
            // 60000ms per minute
            const toRemove = st.state.aprsPackets.filter(packet => (new Date().getTime() - packet.receivedTime) >= (MAX_PACKET_TTL * 60000)).map(p => p.id)

            st.dispatch(ActionTypes.REMOVE_PACKETS, toRemove)
            bus.$emit(BusEventTypes.PACKETS_REMOVED, toRemove)
        }, 60000)
    }
}).$mount('#app');
