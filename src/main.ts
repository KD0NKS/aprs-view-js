import ActionTypes from './ActionTypes'
import App from './App.vue'
import DataEventTypes from '@/enums/DataEventTypes'
import router from './router'
import store from './store'
import Store from 'electron-store'
import Vue from 'vue'
//import Vuelidate from 'vuelidate'
import vuetify from './plugins/vuetify'
import { ConnectionSettingsMapper, StationSettingsMapper } from '@/utils/mappers'
import MutationTypes from './MutationTypes'
import { Connection } from './models/Connection'

const persistentStorage = new Store();

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        // Load station settings.
        const stationSettings = StationSettingsMapper.ObjectToStationSettings(persistentStorage.get('stationSettings'))
        this.$store.commit(MutationTypes.SET_STATION_SETTINGS, stationSettings)

        // Load connections.
        const connections = Object.entries(persistentStorage.get('connections')).map(element => {
            const props = ConnectionSettingsMapper.ObjectToConnectionSettings(element[1])

            return new Connection(props)
        })

        connections.forEach(conn => {
            this.$store.dispatch(ActionTypes.ADD_CONNECTION, conn)
        })

        this.$store.state.connectionService.on(DataEventTypes.DATA, (data) => {
            this.$store.dispatch(ActionTypes.ADD_DATA, data);
        })

        this.$store.state.connectionService.on(DataEventTypes.PACKET, (packet) => {
            this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
        })
    }
}).$mount('#app');
