<template>
    <div class="about">
        <AboutAPRSViewJS></AboutAPRSViewJS>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import AboutAPRSViewJS from '@/components/AboutAPRSViewJS.vue';

    @Component({
        components: {
            AboutAPRSViewJS,
        }
    })
    export default class About extends Vue {}
</script>