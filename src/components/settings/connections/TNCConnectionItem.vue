<template>
    <div></div>
</template>

<script lang="ts">
    import { Connection } from '@/models'
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: ['connection']
    })
    export default class TNCConnectionItem extends Vue {
        @Prop()
        private connection: Connection
        private rules = { required: value => !!value || "Required." }

        private conn: ConnectionViewModel = new ConnectionViewModel()
    }
</script>
