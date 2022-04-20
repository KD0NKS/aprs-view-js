<template>
    <q-page class="q-pa-md column" style="height: 100vh">
        <div class="col col-xs-1">
            <span class="text-h4 h4">Output</span>
        </div>

        <q-card class="col fill">
            <q-card-section class="q-pa-none" style="height: 100%">
                <q-scroll-area
                        class="q-pa-md bg-dark text-green rounded-borders"
                        style="height: 100%"
                        :bar-style="{ borderRadius: '5px', background: 'lightgray', width: '10px', opacity: 0.8 }"
                        :thumb-style="{ borderRadius: '5px', background: 'black', width: '10px', opacity: 0.5 }"
                        >
                    <div v-for="(data, i) in aprsData" :key="i">
                        {{ data }}
                    </div>
                </q-scroll-area>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { mapState } from 'vuex'
    import _ from 'lodash'

    export default defineComponent({
        name: "Output"
        , computed: {
            ...mapState(['aprsData'])
        }
    })
</script>
