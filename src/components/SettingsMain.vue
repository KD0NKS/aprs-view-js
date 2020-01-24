<template>
    <div id="settingsMain" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Settings</h1>
        </div>

        <v-expansion-panels
                :multiple="true"
                :focusable="true"
                :value=[0]>
            <StationSettings></StationSettings>
            <ConnectionList></ConnectionList>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts">
    //import { Component, Vue } from 'vue-property-decorator';
    import ConnectionList from '@/components/settings/ConnectionList.vue';
    import StationSettings from '@/components/settings/StationSettings.vue';

    export default {
        components: {
            ConnectionList
            , StationSettings
        }
    }
</script>