import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify'
import App from './App.vue';
import router from './router';
import store from './store';

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
      this.$store.dispatch('getStationSettings')
  }
}).$mount('#app');