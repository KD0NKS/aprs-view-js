<template>
    <v-list-item dense>
        <v-text-field v-model="localCommand" />
    </v-list-item>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

    @Component({
        props: [ 'command' ]
    })
    export default class TNCCommand extends Vue {
        // TODO: Something doesn't smell right in this file: https://laternastudio.com/blog/using-sync-inside-a-v-for-loop-with-vuejs/
        @Prop()
        private command: string

        public localCommand: string = ""

        mounted() {
            this.localCommand = this.command ?? ""
        }

        @Watch('command')
        onCommandChanged(value: string) {
            this.localCommand = this.command
        }

        @Watch('localCommand')
        onLocalCommandChanged(value: string) {
            this.$emit('update:command', this.localCommand)
        }
    }
</script>
