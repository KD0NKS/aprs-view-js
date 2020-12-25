import ActionTypes from './ActionTypes';
import App from './App.vue';
import DataEventTypes from '@/enums/DataEventTypes';
import router from './router';
import store from './store';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify'

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(Vuetify);

const vuetifyOptions = {}

new Vue({
  router,
  store,
  vuetify: new Vuetify(vuetifyOptions),
  render: (h) => h(App),
  created() {
    this.$store.state.connectionService.on(DataEventTypes.DATA, (data) => {
      this.$store.dispatch(ActionTypes.ADD_DATA, data);
    });

    this.$store.state.connectionService.on(DataEventTypes.PACKET, (packet) => {
      this.$store.dispatch(ActionTypes.ADD_PACKET, packet)
    });
  }
}).$mount('#app');