<template>
  <v-app>
    <Navigation/>
    <v-content class="fill-height">
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
    import Navigation from "./components/Navigation";
    //import Router from "./router";
    
    import 'vuetify/dist/vuetify.min.css';
    import 'material-design-icons-iconfont/dist/material-design-icons.css'

    export default {
        name: "App",
        components: {
            Navigation,
            //Router
        },
        data() {
            return {};
        }
    };
</script>