<template>
    <div class="row justify-between">
        <div class="col-xs-8 q-pa-sm">
            <q-input label="URL" v-model="model.host" :rules="[ rules.required ]" dense />
        </div>
        <div class="col-xs-4 q-pa-sm">
            <q-input label="Port" v-model="model.port" :rules="[ rules.required ]" dense />
        </div>
    </div>
    <div class="row justify-between">
        <div class="col-xs-12 q-pa-sm">
            <q-input label="Filter" v-model="model.filter" dense />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue"

    import { ISConnection } from "@/models/connections"

    export default defineComponent({
        props: {
            model: {
                type: ISConnection
                , required: true
            }
        }
        , setup() {
            return {
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        }
    })
</script>
