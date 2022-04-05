<template>
    <q-page class="q-pa-md">
        <h1>Output</h1>

        <q-card style="height: 100vh">
            <q-card-section class="q-pa-none">
                <q-scroll-area class="console" style="height: 100vh">
                    <div class="console" v-for="(data, i) in aprsData" :key="i">
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

<style scoped lang="sass">
.console
    background-color: #000
    color: #7CFC00
    font-family: monospace
    padding: 10px
    wrap: hard
</style>
