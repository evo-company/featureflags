<template>
    <div>
        <div v-for="(condition, i) in conditions" v-bind:key="i" class="condition">
            <div v-for="(checkRef, j) in condition.checks" v-bind:key="j">
                <check
                    v-bind:flag-id="flagId"
                    v-bind:condition-id="condition.id"
                    v-bind:check-id="checkRef.Check">
                </check>
            </div>
            <div>
                <ButtonGroup class="button-group">
                    <Button type="dashed" size="small" v-on:click="addCheck(condition.id)">
                        <Icon type="plus-round"></Icon> and
                    </Button>
                    <Button type="dashed" size="small" v-on:click="deleteCondition(condition.id)">
                        <Icon type="close-round"></Icon> del
                    </Button>
                </ButtonGroup>
            </div>
        </div>
        <div class="button-big">
            <Button type="dashed" size="small" long v-on:click="addCondition">
                <span v-if="conditions.length"><Icon type="plus-round"></Icon> or</span>
                <span v-else>add condition</span>
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import Check from './Check.vue';

    @Component({
        name: 'conditions',
        props: {flagId: String},
        components: {Check}
    })
    export default class Conditions extends Vue {
        flagId: string;

        get conditions () {
            return this.$store.getters.conditions(this.flagId)
        }
        addCondition () {
            this.$store.commit('addCondition', {flagId: this.flagId});
        }
        deleteCondition (conditionId: string) {
            this.$store.commit('deleteCondition',
                               {flagId: this.flagId, conditionId});
        }
        addCheck (conditionId: string) {
            this.$store.commit('addCheck',
                               {flagId: this.flagId, conditionId});
        }
    }
</script>

<style scoped>
    .button-group {
        margin: 2px;
    }
    .button-big {
        padding: 0 4px;
    }
    .condition {
        background: #eeeeee;
        padding: 2px;
        border-radius: 5px;
        margin-bottom: 4px;
    }
</style>
