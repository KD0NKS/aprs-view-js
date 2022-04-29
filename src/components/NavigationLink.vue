<!--https://quasar.dev/vue-components/expansion-item-->

<template>
    <q-item clickable v-ripple :to="action" v-if="!subLinks">
        <q-item-section avatar>
            <q-icon :name="icon" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
    </q-item>

    <q-expansion-item
            :content-inset-level="1"
            :label="title"
            :icon="icon"
            v-if="subLinks"
            >
        <q-card>
            <q-item clickable v-ripple v-for="subLink in subLinks" :to="subLink.action" :key="subLink.title">
                <q-item-section v-if="subLink.icon">
                    <q-icon :name="subLink.icon" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ subLink.title }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-card>
    </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "NavigationLink",
    props: {
        title: {
            type: String,
            required: true,
        }
        , action: {
            type: String,
            default: "#",
        }
        , icon: {
            type: String,
            default: "",
        }
        , subLinks: {
            type: Array,
            default: null,
        }
    },
})
</script>
