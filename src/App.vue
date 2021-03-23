<template>
  <v-app>
    <Navigation/>
    <v-main class="fill-height">
        <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
    import Vue from "vue";
    import Navigation from "./components/Navigation";
    import 'vuetify/dist/vuetify.min.css';
    import 'material-design-icons-iconfont/dist/material-design-icons.css'
    import '@mdi/font/css/materialdesignicons.css'

    export default Vue.extend({
        name: "App",
        components: {
            Navigation
        },
        data: () => ({})
    })
</script>
