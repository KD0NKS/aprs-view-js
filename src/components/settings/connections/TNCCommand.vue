<template>
    <v-list-item dense>
        {{ command }}
    </v-list-item>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: [ 'command' ]
    })
    export default class TNCCommand extends Vue {
        @Prop()
        private command: string
    }
</script>
