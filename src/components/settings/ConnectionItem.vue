<template>
    <v-expansion-panel>
        <v-expansion-panel-header>{{ connection.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-form
                        id="connection-settings-form"
                        @submit.prevent="save"
                        v-model="isValid"
                        >
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                            <v-text-field label="Name" v-model="conn.name" :rules="[rules.required]"></v-text-field>
                        </v-flex>

                        <v-flex xs12 md4 class="px-2">
                            <v-select
                                :items="connectionTypeOptions"
                                item-text="name"
                                item-value="id"
                                v-model="conn.connectionType"

                            ></v-select>
                        </v-flex>
                    </v-layout>

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

                    <v-layout row wrap>
                        <v-flex xs12 class="px-2">
                            <v-btn color="primary" class="mr-4" type="submit" :disabled="!isValid" form="connection-settings-form">Save</v-btn>
                            <v-btn color="normal" class="mr-4" @click="reset">Reset</v-btn>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12 md12 class="px-2">
                            <!--<v-switch v-model="connection.isEnabled" v-on:change="(event) => this.$emit('enableConnection', event)" label="Enabled"></v-switch>-->
                            <v-switch v-model="connection.isEnabled" label="Enabled"></v-switch>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>


<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import { Connection } from '@/models/Connection'
    import { ConnectionProps } from '@/models/ConnectionProps'
    import { ConnectionTypes } from '@/enums/ConnectionTypes'
    //import store from '@/store'

    @Component({
        props: ['connection']
    })
    export default class ConnectionItem extends Vue {
        @Prop()
        private connection: Connection

        private conn: ConnectionProps = new ConnectionProps()

        private isValid: boolean = false
        private rules = { required: value => !!value || "Required." }

        private created() {
            this.conn.id = this.connection.id

            this.reset()
        }

        private get connectionTypeOptions() {
            let map = []

            Object.keys(ConnectionTypes).forEach(k => {
                map.push({ id: k, name: ConnectionTypes[k] });
            });

            return map
        }

        private reset(): void {
            Vue.set(this.conn, 'name', this.connection.name)
            Vue.set(this.conn, 'connectionType', this.connection.connectionType)
            Vue.set(this.conn, 'host', this.connection.host)
            Vue.set(this.conn, 'port', this.connection.port)
            Vue.set(this.conn, 'filter', this.connection.filter)
        }

        private save(): void {
            if(this.isValid === true) {
                this.$emit('saveConnection', this.conn)
            }
        }
    }

/*
  , computed: {
        isConnected() {
            if(this.item.connection !== null && this.item.connection !== undefined) {
                return this.item.connection.isConnected();
            }

            return false;
        }
    },
    methods: {
        cancel() {}
        , remove() {}
        , edit() {}
        , reset() {
            this.item.name = this.originalName;
        }
        , save() {
            this.originalName = this.item.name;
        }
    }
};
*/
</script>