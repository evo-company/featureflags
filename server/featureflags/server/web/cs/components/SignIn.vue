<template>
    <layout type="center">
        <div v-bind:class="{invalid: invalid}">
            <h1>Sign in to <code>FeatureFlags</code></h1>
            <div class="row">
                <div class="input-wrapper" v-bind:class="{empty: usernameEmpty}">
                    <Input type="text" v-model="username" @on-enter="signIn" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </div>
            </div>
            <div class="row">
                <div class="input-wrapper" v-bind:class="{empty: passwordEmpty}">
                    <Input type="password" v-model="password" @on-enter="signIn" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </div>
            </div>
            <div class="row">
                <Button type="primary" @click="signIn">Sign in</Button>
            </div>
        </div>
    </layout>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import Layout from './Layout.vue';
    import {wrapIO} from "./utils";
    import {ISignIn} from "../store/actions";

    @Component({
        name: 'sign-in',
        components: {Layout}
    })
    export default class SignIn extends Vue {
        invalid: boolean = false;
        username: string = '';
        password: string = '';

        get usernameEmpty () {
            return !this.username;
        }
        get passwordEmpty () {
            return !this.password;
        }
        showInvalid () {
            this.invalid = true;
            setTimeout(() => {
                this.invalid = false;
            }, 500);
        }
        signIn () {
            if (this.username && this.password) {
                wrapIO(
                    this,
                    this.$store.dispatch('signIn', <ISignIn>{
                        username: this.username,
                        password: this.password,
                    })
                    .then((authenticated: boolean) => {
                        if (!authenticated) {
                            this.showInvalid();
                        } else {
                            this.$router.push({name: 'home'});
                        }
                    })
                );
            } else {
                this.showInvalid();
            }
        }
    }
</script>

<style scoped>
    .row {
        margin-top: 15px;
    }
    .input-wrapper {
        padding: 1px 2px 3px;
    }
    .input-wrapper.empty {
        background-color: rgba(255, 255, 0, 0.85);
        border-radius: 5px;
    }
</style>
