<template>
    <div>
        <Dropdown trigger="custom" :visible="focused" placement="bottom-start"
            class="dropdown" v-on:on-click="onClick">
            <Input type="text" v-model="searchInput" placeholder="Search flags"
                ref="searchInput"
                v-on:on-keyup="onKeyUp"
                v-on:on-keydown="onKeyDown"
                @on-focus="onFocus" @on-blur="onBlur"></Input>
            <DropdownMenu slot="list">
                <DropdownItem
                    :name="-1"
                    :selected="selectedIndex === -1">
                    show all matches ({{ results.length }})
                </DropdownItem>
                <DropdownItem v-for="(result, index) in results"
                    :name="index"
                    :key="index"
                    :selected="selectedIndex === index">
                    {{ result.name }}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script lang="ts">
    import * as _ from 'lodash';
    import * as Fuse from "fuse.js";
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import {ISearchResult} from "../store/types";

    @Component({
        name: 'search',
    })
    export default class Search extends Vue {
        searchInputValue = "";
        selectedIndex = -1;
        focused = false;

        get searchInput () {
            return this.searchInputValue;
        }
        set searchInput (value) {
            this.searchInputValue = value;
            this.selectedIndex = -1;
        }
        get results (): ISearchResult[] {
            let pattern = (
                this.searchInputValue
                .replace(/[_.-]+/g, ' ')
                .trim()
            );
            return (<Fuse<ISearchResult>>this.$store.getters.searcher).search(pattern);
        }
        onFocus () {
            this.focused = true;
        }
        onBlur () {
            this.focused = false;
        }
        onKeyUp (event: KeyboardEvent) {
            if (event.key === 'ArrowUp') {
                this.prevResult();
            } else if (event.key === 'ArrowDown') {
                this.nextResult();
            } else if (event.key === 'Enter') {
                this.showResult(event);
            }
        }
        onKeyDown (event: KeyboardEvent) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
            }
        }
        onClick (index: number) {
            this.selectedIndex = index;
            this.showResult();
        }
        prevResult () {
            this.selectedIndex = _.max([this.selectedIndex - 1, -1]);
        }
        nextResult () {
            this.selectedIndex = _.min([this.selectedIndex + 1,
                                        this.results.length - 1]);
        }
        showResult (event?: KeyboardEvent) {
            let ids: string[];
            let selected: string[];
            if (this.selectedIndex === -1) {
                selected = _.map(this.results, 'id');
            } else {
                selected = [this.results[this.selectedIndex].id];
            }
            if (event !== undefined && event.shiftKey) {
                ids = ((<any>this.$route.params).selectedIds || '')
                    .split(';')
                    .filter((s: string) => s.length > 0);
                ids = _.uniq(_.concat(ids, selected));
            } else {
                ids = selected;
            }
            if (ids.length) {
                this.$router.push({name: 'select',
                                   params: {selectedIds: ids.join(';')}});
            } else {
                this.$router.push({name: 'home'});
            }
            (<HTMLElement>this.$refs.searchInput).blur();
        }
    }
</script>

<style scoped>
    .dropdown {
        display: block;
    }
</style>
