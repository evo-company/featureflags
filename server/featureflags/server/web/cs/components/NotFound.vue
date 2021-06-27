<template>
    <layout type="center">
        <h1>Page Not Found</h1>
    </layout>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import Layout from './Layout.vue';

    @Component({
        name: 'not-found',
        components: {Layout}
    })
    export default class NotFound extends Vue {}
</script>
