import ActionTypes from './ActionTypes';
import App from './App.vue';
import { ConnectionManager, DataEventTypes } from 'js-aprs-engine';
import router from './router';
import store from './store';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify'

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(Vuetify);

const vuetifyOptions = {}
ConnectionManager.appId = 'aprs-view-js v1.0.0'

new Vue({
  router,
  store,
  vuetify: new Vuetify(vuetifyOptions),
  render: (h) => h(App),
  created() {
    this.$store.dispatch(ActionTypes.INIT_STATION_SETTINGS)
    
    ConnectionManager.on(DataEventTypes.DATA, (data) => {
      this.$store.dispatch(ActionTypes.ADD_DATA, data);
    });

    ConnectionManager.on(DataEventTypes.PACKET, (packet) => {
      this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
    });
  }
}).$mount('#app');