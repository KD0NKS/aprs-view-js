<template>
    <div class="q-gutter-md row" dense>
        <q-input label="URL" v-model="model.host" :rules="[ rules.required ]" class="col-8" />
        <q-input label="Port" v-model="model.port" :rules="[ rules.required ]" class="col-3" />
    </div>
    <div class="q-gutter-md row">
        <q-input label="Filter" v-model="model.filter" class="col-11" />
    </div>
    <br />
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
