<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 md8 class="px-2">
                <v-text-field label="URL" v-model="connection.host" :rules="[rules.required]"></v-text-field>
            </v-flex>
            <v-flex xs12 md4 clsss="px-2">
                <v-text-field label="Port" v-model="connection.port" type="number" :rules="[rules.required]"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md12 class="px-2">
                <v-text-field label="Filter" v-model="connection.filter"></v-text-field>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'

    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'

    @Component({
        props: [ 'connection', 'rules' ]
    })
    export default class ISConnectionItem extends Vue {
        @Prop()
        private rules: any

        @Prop()
        private connection: ConnectionViewModel
    }
</script>
