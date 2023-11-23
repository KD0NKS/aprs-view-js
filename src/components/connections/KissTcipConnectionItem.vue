<template>
    <div class="q-gutter-md row" dense>
        <q-input label="URL" v-model="model.host" :rules="[ rules.required ]" class="col-8" dense />
        <q-input label="Port" v-model="model.port" :rules="[ rules.required ]" class="col-3" dense />
    </div>
    <br />
</template>

<script lang="ts">
    import { defineComponent } from "vue"

    import { KissTcipConnection } from "../../models/connections/KissTcipConnection"

    export default defineComponent({
        props: {
            model: {
                type: KissTcipConnection
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
