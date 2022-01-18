<template>
    <Card shadow v-bind:class="{invalid: invalid}">
        <Row :gutter="5" style="margin-bottom: 10px">
            <Col span="16">
                <span class="project-name">
                    <Icon type="social-octocat"></Icon>
                    {{ project }}
                </span>
                <code class="flag-name">{{ flag.name }}</code>
                <span v-if="flag.overridden.value" class="status status-overridden">overridden</span>
                <span v-else class="status status-default">default</span>
            </Col>
            <Col span="8" style="display: flex; justify-content: flex-end;">
                <ButtonGroup style="padding: 0 4px;">
                    <Button size="small" type="warning" :disabled="!flag.overridden.value" v-on:click="reset">reset</Button>
                    <Button size="small" type="info" :disabled="dirty === false" v-on:click="save">apply</Button>
                    <Button size="small" type="error" :disabled="dirty === false" v-on:click="cancel">cancel</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row :gutter="5">
            <Col span="6">
                <i-switch v-model="enabled" size="large">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
            </Col>
            <Col span="18">
                <conditions v-bind:flag-id="flag.id"></conditions>
            </Col>
        </Row>
    </Card>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import {wrapIO} from "./utils";
    import Conditions from './Conditions.vue';
    import {MISSING_VALUE} from "../store/actions";

    @Component({
        name: 'flag',
        props: {flagId: String},
        components: {Conditions}
    })
    export default class Flag extends Vue {
        flagId: string;
        invalid: boolean = false;

        get project () {
            return this.$store.getters.project(this.flag.project.Project).name
        }
        get flag () {
            return this.$store.getters.flag(this.flagId)
        }
        get enabled () {
            return this.$store.getters.flag(this.flagId).enabled.value;
        }
        set enabled (value) {
            this.$store.commit('setEnabled', {flagId: this.flagId, value});
        }
        get dirty () {
            return this.$store.getters.dirty(this.flagId);
        }
        save () {
            wrapIO(
                this,
                this.$store.dispatch('save', this.flagId)
                .catch((reason) => {
                    if (reason === MISSING_VALUE) {
                        this.invalid = true;
                        setTimeout(() => {
                            this.invalid = false;
                        }, 500);
                    } else {
                        return Promise.reject(reason);
                    }
                })
            );
        }
        reset () {
            wrapIO(this, this.$store.dispatch('reset', this.flagId));
        }
        cancel () {
            this.$store.commit('cancel', this.flagId);
        }
    }
</script>

<style scoped>
    .flag-name {
        margin-left: 5px;
        background: rgb(238, 238, 238);
        padding: 3px 6px;
        border-radius: 3px;
    }
    .status {
        margin-left: 5px;
    }
    .status-overridden {
        color: green;
    }
    .status-default {
        color: gray;
    }
</style>
