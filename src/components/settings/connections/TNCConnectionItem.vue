<template>
    <div></div>
</template>

<script lang="ts">
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: [ 'connection', 'rules' ]
    })
    export default class TNCConnectionItem extends Vue {
        @Prop()
        private rules: any

        @Prop()
        private connection: ConnectionViewModel
    }
</script>
