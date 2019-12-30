<template>
    <div class="output" justify="space-around">
        <div class="text-xs-center mb-3">
            <h1>Output</h1>
        </div>

        <v-list-group>
            <v-list-item-group v-model="aprsData">
                <v-list-item v-for="(output, i) in aprsData.slice(-100)" :key="i">
                    {{ output }}
                </v-list-item>
            </v-list-item-group>
        </v-list-group>
    </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
    export default {
        computed: mapState(['aprsData'])
    }
</script>