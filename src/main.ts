import { ConnectionManager } from 'js-aprs-engine';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import ActionTypes from './ActionTypes';

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
    
    ConnectionManager.on('data', (data) => {
      this.$store.dispatch(ActionTypes.ADD_PACKET, data);
    });
  }
}).$mount('#app');