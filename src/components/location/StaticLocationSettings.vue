<template>
    <div class="q-gutter-md row" dense>
        <!-- TODO: limit to 4 decimal places -->
        <!-- TODO: Support ambiguity -->
        <q-input label="Latitude" v-model="localLatitude" type="number" step="any" :rules="[ rules.required ]" class="col-6" dense />
        <q-input label="Longitude" v-model="localLongitude" type="number" step="any" :rules="[ rules.required ]" class="col-5" dense />
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
        }
        , setup(props) {
            const localLatitude = ref(props.latitude)
            const localLongitude = ref(props.longitude)

            return {
                localLatitude
                , localLongitude
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
        }
    })
</script>


