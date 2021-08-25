<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="COM Port"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="Data Bits"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="Stop Bits"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="Parity"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="Baud Rate"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <!-- INIT COMMANDS -->
        </v-layout>

        <v-layout row wrap>
            <!-- TERM COMMANDS -->
        </v-layout>
    </div>
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
