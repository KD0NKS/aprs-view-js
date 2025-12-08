<template>
    <q-item class="row q-pa-none" dense>
        <div class="column col-xs-1 items-center">
            <q-item-section class="handle">
                <q-icon name="drag_indicator" style="font-size: 1.715em" />
            </q-item-section>
        </div>
        <div class="column col-xs-10 q-pa-none justify-end">
            <q-item-section class="col-xs-10">
                <q-input v-model="localCommand" :rules="[ rules.required ]" dense />
            </q-item-section>
        </div>
        <div class="column col-xs-1 q-pa-none">
            <q-item-section>
                <q-btn flat dense>
                    <q-icon name="clear" @click="$emit('removeCommand')" />
                </q-btn>
            </q-item-section>
        </div>
    </q-item>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"

    export default defineComponent({
        name: "TNCCommand"
        , props: {
            command: {
                type: String
                , required: true
            }
        }
        , setup(props) {
            const localCommand = ref(props.command)

            return {
                localCommand
                , rules: {
                    required: value => !!value || 'Required.'
                }
            }
        }
        , watch: {
            command: {
                handler: function(value) {
                    this.localCommand = value
                }
            }
            , localCommand: {
                handler: function(value) {
                    this.$emit('updateCommand', value)
                }
            }
        }
    })
</script>
