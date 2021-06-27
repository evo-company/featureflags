import Vuex from 'vuex';

import {getters} from "./getters";
import {actions} from "./actions";
import {IState, mutations} from "./mutations";
import {featureflags} from "../proto";
import Result = featureflags.graph.Result;
import Root = featureflags.graph.Root;

export function createStore () {
    return new Vuex.Store({
        state: <IState>{
            graph: Result.create({
                Root: Root.create(),
                Project: {},
                Variable: {},
                Flag: {},
                Condition: {},
                Check: {},
            }),
            edit: {},
            cached: {
                auth: false,
                search: false,
                flags: []
            },
            raw: {
                numberInput: {},
                setInput: {}
            }
        },
        getters,
        actions,
        mutations,
        strict: true
    })
}
