<template>
    <q-item class="row justify-between q-pa-none" dense>
            <div class="col-xs-1 q-pa-sm">
                <q-item-section avatar class="handle">
                    <q-icon name="drag_indicator" />
                </q-item-section>
            </div>
            <div class="col-xs-10 q-pa-sm">
                <q-item-section class="col-10">
                    <q-input v-model="localCommand" :rules="[ rules.required ]" dense />
                </q-item-section>
            </div>
            <div class="col-xs-1 q-pa-sm">
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
