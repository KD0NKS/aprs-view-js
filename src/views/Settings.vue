<template>
    <div class="settings" justify="space-around">
        <SettingsMain></SettingsMain>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SettingsMain from '@/components/SettingsMain.vue';

    @Component({
        components: {
            SettingsMain
        }
    })
    
    export default class Settings extends Vue {}
</script>