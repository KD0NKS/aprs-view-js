<template>
    <q-layout view="hHh lpR fFf">
        <navigation />

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
    import { defineComponent } from "vue"
    import Navigation from "components/Navigation.vue"

    export default defineComponent({
        name: "MainLayout",
        components: {
            Navigation
        }
    })
</script>
