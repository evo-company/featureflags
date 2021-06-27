<template>
    <layout>
        <search></search>
        <div class="flags-list">
            <flag v-for="flag in selectedFlags" v-bind:key="flag.id"
                  v-bind:flag-id="flag.id" class="flags-list-item"></flag>
        </div>
    </layout>
</template>

<script lang="ts">
    import * as _ from 'lodash'
    import Vue from 'vue'
    import {Watch} from "vue-property-decorator";
    import Component from 'vue-class-component'

    import {G, FLAG_NODE_MIN, FLAG_NODE_FULL, PROJECT_NODE} from "../query";
    import Flag from './Flag.vue';
    import Layout from './Layout.vue';
    import Search from './Search.vue';
    import {wrapIO} from "./utils";

    @Component({
        name: 'page',
        components: {Layout, Flag, Search}
    })
    export default class Page extends Vue {
        get selectedIds () {
            let ids = (<any>this.$route.params).selectedIds;
            if (ids === undefined) {
                return [];
            } else {
                return _.uniq(ids.split(';'));
            }
        }
        get selectedFlags () {
            return _.map(_.intersection(this.selectedIds,
                                        this.$store.state.cached.flags),
                         this.$store.getters.flag);
        }
        created () {
            if (this.$store.getters.authenticated) {
                this.fetchData();
            } else {
                this.$router.push({name: 'sign-in'});
            }
        }
        @Watch('$route')
        onRoute() {
            this.fetchData();
        }
        fetchData () {
            // base query
            let query = G.node([]);
            // with search
            if (!this.$store.state.cached.search) {
                query.items.push(G.link('flags', FLAG_NODE_MIN));
                query.items.push(G.link('projects', PROJECT_NODE));
            }
            // with uncached flags
            let flagIds = _.difference(this.selectedIds,
                                       this.$store.state.cached.flags);
            if (flagIds.length) {
                query.items.push(G.link(
                    'flags_by_ids',
                    FLAG_NODE_FULL,
                    {fields: {ids: {listValue: {
                        values: _.map(flagIds,
                                      (i: string) => {return {stringValue: i}})
                    }}}}
                ));
            }
            if (query.items.length) {
                wrapIO(
                    this,
                    this.$store.dispatch('pull', query)
                    .then(() => {
                        if (!this.$store.state.cached.search) {
                            this.$store.commit('searchCached');
                        }
                        if (flagIds.length) {
                            // in case if there are invalid ids in url
                            let loadedFlags = _.intersection(
                                flagIds,
                                _.keys(this.$store.state.graph.Flag)
                            );
                            if (loadedFlags.length) {
                                this.$store.commit('flagsCached', loadedFlags);
                            }
                        }
                    })
                    .catch((reason: string) => {
                        return Promise.reject('Data load failed: ' + reason);
                    })
                )
            }
        }
    }
</script>

<style scoped>
    .flags-list {
        margin-top: 15px;
    }
    .flags-list-item {
        margin-bottom: 15px;
    }
</style>
