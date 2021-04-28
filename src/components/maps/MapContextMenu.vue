<template>
    <v-menu v-model="isShowContextMenu"
            :close-on-content-click="true"
            :nudge-width="200"
            :position-x="positionX"
            :position-y="positionY"
            >
        <v-card>
            <v-list>
                <v-list-item v-on:click="$emit('clearAll')">Clear all stations</v-list-item>
                <!--
                <v-list-item v-on:click="$emit('station-position', { x: positionX, y: positionY })">Set my station's position here</v-list-item>
                <v-list-item></v-list-item>
                <v-list-item>Create object here</v-list-item>
                -->
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        props: ['contextMenu', 'positionX', 'positionY' ]
    })
    export default class MapContextMenu extends Vue {
        @Prop()
        private contextMenu: boolean

        @Prop()
        private positionX: number

        @Prop()
        private positionY: number

        private get isShowContextMenu() {
            return this.contextMenu
        }

        private set isShowContextMenu(value: boolean) {
            this.$emit("close")
        }
    }

    /*
    @Component({
        props: ['packet']
    })
    export default class StationFeatureCard extends Vue {
        @Prop()
        private packet: aprsPacket
    }
    */
</script>
