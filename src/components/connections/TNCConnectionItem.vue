<template>
    <div class="q-gutter-md row items-start">
        <!-- TODO: COM PORT -->
        <q-input label="Baud Rate" v-model="model.baudRate" type="number" class="col-5" />
    </div>

    <div class="q-gutter-md row items-start">
        <q-select label="Data Bits"
            :options="dataBitOptions"
            v-model="model.dataBits"
            :rules="[ rules.required ]"
            class="col-6"
            >
        </q-select>

        <q-select label="Stop Bits"
            :options="stopBitOptions"
            v-model="model.stopBits"
            :rules="[ rules.required ]"
            class="col-5"
            >
        </q-select>
    </div>

    <div class="q-gutter-md row items-start">
        <q-select label="Parity"
            :options="parityOptions"
            v-model="model.parity"
            :rules="[ rules.required ]"
            class="col-6"
            >
        </q-select>

        <q-select label="Character Set"
            :options="charSetOptions"
            v-model="model.charset"
            :rules="[ rules.required ]"
            class="col-5"
            >
        </q-select>
    </div>

    <div class="q-gutter-md row items-start">
        <q-input label="MYCALL Command" v-model="model.mycallCommand" class="col-6" />
        <q-select label="EOL Character"
            :options="eolCharOptions"
            v-model="model.messageDelimeter"
            :rules="[ rules.required ]"
            emit-value
            map-options
            class="col-5"
            >
        </q-select>
    </div>

    <div class="row">
        <div class="col-6">
            <q-list v-for="(item, index) in model.initCommands" :key="index" dense>
                <TNCCommand :command="item" @removeCommand="removeCommand(model.initCommands, index)" />
            </q-list>

            <q-btn flat @click="addCommand(model.initCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>

        <div class="col-6">
            <q-list v-for="(item, index) in model.exitCommands" :key="index" dense>
                <TNCCommand :command="item" @removeCommand="removeCommand(model.exitCommands, index)" />
            </q-list>

            <q-btn flat @click="addCommand(model.exitCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue"
    import _ from "lodash"

    import { EolCharEnum } from "@/enums"
    import { TNCConnection } from "@/models/connections"

    import TNCCommand from '@/components/connections/TNCCommand.vue'

    export default defineComponent({
        props: {
            model: {
                type: TNCConnection
                , required: true
            }
        }
        , components: {
            TNCCommand
        }
        , setup() {
            return {
                charSetOptions: [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]
                , dataBitOptions: [ 5, 6, 7, 8 ]
                , stopBitOptions: [ 1, 2 ]
                , parityOptions: [ 'none', 'even', 'odd', 'mark', 'space' ]
                , rules: {
                    required: value => !!value || 'Required.'
                }
            }
        }
        , computed: {
            eolCharOptions() {
                return _.map(
                    Object.keys(EolCharEnum)
                    , key => {
                        return {
                            label: key
                            , value: EolCharEnum[key]
                        }
                    }
                )
            }
        }
        , methods: {
            addCommand(list): void {
                list.push('')
            }
            , removeCommand(list, index): void {
                list.splice(index, 1)
            }
        }
        // TODO: May need watchers here
    })
</script>
