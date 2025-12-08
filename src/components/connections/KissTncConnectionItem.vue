<template>
    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="COM Port"
                :options="comPorts"
                v-model="model.comPort"
                :rules="[ rules.required ]"
                @focus="updateSerialPorts"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-input label="Baud Rate" v-model="model.baudRate" type="number" dense />
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="Data Bits"
                :options="dataBitOptions"
                v-model="model.dataBits"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-select label="Stop Bits"
                :options="stopBitOptions"
                v-model="model.stopBits"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="Parity"
                :options="parityOptions"
                v-model="model.parity"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-select label="Character Set"
                :options="charSetOptions"
                v-model="model.charset"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="EOL Character"
                :options="eolCharOptions"
                v-model="model.messageDelimeter"
                :rules="[ rules.required ]"
                emit-value
                map-options
                dense
                >
            </q-select>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"

    import { KissSerialConnection } from "../../models/connections"
    import { EolCharEnum } from "../../enums"

    export default defineComponent({
        props: {
            model: {
                type: KissSerialConnection
                , required: true
            }
        }
        , setup() {
            const comPorts = ref<string[]>([])

            return {
                comPorts
                , charSetOptions: [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]
                , dataBitOptions: [ 5, 6, 7, 8 ]
                , parityOptions: [ 'none', 'even', 'odd', 'mark', 'space' ]
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , stopBitOptions: [ 1, 2 ]
            }
        }, mounted() {
            this.updateSerialPorts()
        }
        , computed: {
            eolCharOptions() {
                return Object.keys(EolCharEnum).map((key) => {
                    return {
                        label: key
                        , value: EolCharEnum[key]
                    }
                });
            }
        }
        , methods: {
            async updateSerialPorts(): Promise<void> {
                // TODO: Sort by name
                this.comPorts = await window.connectionService.getComPorts()
            }
        }
    })
</script>

