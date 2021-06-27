<template>
    <div>
        <div class="header">
            <div class="header-content">
                <router-link :to="{name: 'home'}">
                    <code class="home">FeatureFlags</code>
                </router-link>
                <span class="now-title">now:</span>
                <code>{{time}}</code>
                <a v-if="authenticated" href="javascript:" @click="signOut"
                    class="sign-out">Sign out</a>
            </div>
        </div>
        <div v-if="isTypeDefault" class="content-default">
            <slot></slot>
        </div>
        <div v-else-if="isTypeCenter" class="content-center">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import * as strftime from 'strftime'
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import {wrapIO} from "./utils";

    @Component({
        name: 'layout',
        props: {
            type: {
                type: String,
                validator: (value: string) => {
                    return ['default', 'center'].indexOf(value) !== -1
                },
                default: 'default'
            }
        },
    })
    export default class Layout extends Vue {
        type: string;
        time: string = '';
        _interval: number;

        created () {
            let format = '%Y-%m-%d %H:%M %Z';
            this.time = strftime(format);
            this._interval = setInterval(
                () => this.time = strftime(format),
                1000
            );
        }
        beforeDestroy () {
            clearInterval(this._interval);
        }
        get authenticated () {
            return this.$store.state.graph.Root.authenticated;
        }
        get isTypeDefault () {
            return this.type === 'default';
        }
        get isTypeCenter () {
            return this.type === 'center';
        }
        signOut () {
            wrapIO(
                this,
                this.$store.dispatch('signOut')
                .then(() => {
                    this.$router.push({name: 'sign-in'});
                })
            );
        }
    }
</script>

<style scoped>
    .header {
        padding: 5px 0;
    }
    .header-content {
        width: 750px;
        margin: 0 auto;
        display: flex;
    }
    .now-title {
        padding-left: 50px;
        padding-right: 5px;
        color: gray;
    }
    .sign-out {
        margin-left: auto;
    }
    .content-default {
        width: 750px;
        margin: 0 auto;
    }
    .content-center {
        width: 300px;
        margin: 50px auto;
    }
    .home {
        font-weight: bold;
    }
</style>
