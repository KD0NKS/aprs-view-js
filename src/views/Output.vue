<!-- This window outputs raw packets, not 1 line per parsed packet. -->

<template>
    <div class="output" style="padding: 10px">
        <div class="text-xs-center mb-3">
            <h1>Output</h1>
        </div>

        <v-list :disabled="true" :dense="true">
            <v-list-item-group v-model="aprsData">
                <v-list-item v-for="(output, i) in aprsData.slice(-100)" :key="i">
                    {{ output }}
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<script lang="ts">
    import { mapState } from 'vuex';

    export default {
        computed: mapState(['aprsData'])
    }
</script>