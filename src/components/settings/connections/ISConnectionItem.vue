<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 md8 class="px-2">
                <v-text-field label="URL" v-model="conn.host" :rules="[rules.required]"></v-text-field>
            </v-flex>
            <v-flex xs12 md4 clsss="px-2">
                <v-text-field label="Port" v-model="conn.port" type="number" :rules="[rules.required]"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md12 class="px-2">
                <v-text-field label="Filter" v-model="conn.filter"></v-text-field>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
    import { Connection } from '@/models'
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: ['connection']
    })
    export default class ISConnectionItem extends Vue {
        @Prop()
        private connection: Connection
        private rules = { required: value => !!value || "Required." }

        private conn: ConnectionViewModel = new ConnectionViewModel()
    }
</script>
