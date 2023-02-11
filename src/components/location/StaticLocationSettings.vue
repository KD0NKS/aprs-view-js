<template>
    <div class="row justify-between">
        <div class="col-md-6 q-pa-sm">
            <!-- TODO: limit to 4 decimal places -->
            <!-- TODO: Support ambiguity -->
            <q-input label="Latitude" v-model="localLatitude" type="number" step="any" :rules="[ rules.required ]" dense />
        </div>
        <div class="col-md-6 q-pa-sm">
            <q-input label="Longitude" v-model="localLongitude" type="number" step="any" :rules="[ rules.required ]" dense />
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-md-12 q-pa-sm">
            <label>Transmit Interval</label>
            <q-slider v-model="localTransmitInterval" :label-value="localTransmitInterval + ' min'" :min="1" :max="30" :step="1" snap label-always switch-label-side label delse  />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"

    export default defineComponent({
        name: "StaticLocationSettings"
        , props: {
            latitude: {
                type: Number
                , requried: false
            }
            , longitude: {
                type: Number
                , requried: false
            }
            , transmitInterval: {
                type: Number
                , required: false
            }
        }
        , emits: [
            "updateLatitude"
            , "updateLongitude"
            , "updateTransmitInterval"
        ]
        , setup(props) {
            const localLatitude = ref(props.latitude)
            const localLongitude = ref(props.longitude)
            const localTransmitInterval = ref(props.transmitInterval)

            return {
                localLatitude
                , localLongitude
                , localTransmitInterval
                , rules: {
                    required: value => !!value || 'Required.'
                }
            }
        }
        , watch: {
            // LATITUDE
            latitude: {
                handler: function(value) {
                    this.localLatitude = value
                }
            }
            , localLatitude: {
                handler: function(value) {
                    this.$emit('updateLatitude', value)
                }
            }
            // LONGITUDE
            , longitude: {
                handler: function(value) {
                    this.localLongitude = value
                }
            }
            , localLongitude: {
                handler: function(value) {
                    this.$emit('updateLongitude', value)
                }
            }
            // transmitInterval
            , transmitInterval: {
                handler: function(value) {
                    this.localTransmitInterval = value
                }
            }
            , localTransmitInterval: {
                handler: function(value) {
                    this.$emit('updateTransmitInterval', value)
                }
            }
        }
    })
</script>


