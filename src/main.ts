import ActionTypes from './ActionTypes'
import App from './App.vue'
import DataEventTypes from '@/enums/DataEventTypes'
import router from './router'
import store from './store'
import Vue from 'vue'
//import Vuelidate from 'vuelidate'
import vuetify from './plugins/vuetify'

const vuetifyOptions = {}

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        this.$store.state.connectionService.on(DataEventTypes.DATA, (data) => {
            this.$store.dispatch(ActionTypes.ADD_DATA, data);
        })

        this.$store.state.connectionService.on(DataEventTypes.PACKET, (packet) => {
            this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
        })
    }
}).$mount('#app');
