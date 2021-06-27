<template>
    <div v-if="loading">loading...</div>
    <router-view v-else></router-view>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import {G} from "../query";
    import SignIn from './SignIn.vue';
    import {wrapIO} from "./utils";

    @Component({
        name: 'root',
        components: {SignIn}
    })
    export default class Root extends Vue {
        loading: boolean = true;
        created () {
            this.fetchData();
        }
        fetchData () {
            let query = G.node([G.field('authenticated')]);
            wrapIO(
                this,
                this.$store.dispatch('pull', query)
                .then(() => {
                    this.$store.commit('authCached');
                    this.loading = false;
                })
                .catch((reason: string) => {
                    return Promise.reject('Data load failed: ' + reason);
                })
            )
        }
    }
</script>

<style>
    @keyframes shake {
        8%, 41% {
            transform: translateX(-10px);
        }
        25%, 58% {
            transform: translateX(10px);
        }
        75% {
            transform: translateX(-5px);
        }
        92% {
            transform: translateX(5px);
        }
        0%, 100% {
            transform: translateX(0);
        }
    }
    .invalid {
        animation: shake .5s linear;
    }
</style>
