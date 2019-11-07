<template>
    <v-expansion-panel>
        <v-expansion-panel-header>Connection Settings</v-expansion-panel-header>
        <v-expansion-panel-content>

        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script type="ts">
    import store from '../../store';

    export default {
        data: () => ({
            
        })
        , created() {
            // load settings here
            //https://jsfiddle.net/awolf2904/3rabkzsn/1/
            //store.dispatch('getStationSettings');
        }
        , computed: {
        }
        , methods: {
        }
    }
</script>