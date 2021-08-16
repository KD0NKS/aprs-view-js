<template>
    <v-menu v-model="isShowContextMenu"
            :close-on-content-click="true"
            :nudge-width="200"
            :position-x="positionX"
            :position-y="positionY"
            >
        <v-card>
            <v-list dense>
                <v-list-item v-on:click="$emit('clearAll')">Clear all stations</v-list-item>
                <v-list-item v-on:click="$emit('stationPosition', coordinate)">Set my station's position here</v-list-item>
                <!--
                <v-list-item></v-list-item>
                <v-list-item>Create object here</v-list-item>
                -->
                <v-divider />
                <v-list-item to="/mapSettings">Settings</v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import { Coordinate } from 'ol/coordinate'

    @Component({
        props: ['contextMenu', 'coordinate', 'positionX', 'positionY' ]
    })
    export default class MapContextMenu extends Vue {
        @Prop()
        private contextMenu: boolean

        @Prop()
        private coordinate: Coordinate

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
</script>
