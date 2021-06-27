import * as _ from "lodash";
import * as Fuse from "fuse.js";

import {IState} from "./mutations";
import {ISearchResult} from "./types";

import {featureflags} from "../proto";
import Type = featureflags.graph.Variable.Type;
import Operator = featureflags.graph.Check.Operator;
import Project = featureflags.graph.Project;
import Flag = featureflags.graph.Flag;
import IRef = featureflags.graph.IRef;

export const TYPES: {[k: number]: {operators: number[]}} = {
    [Type.STRING]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL,
            Operator.PERCENT,
            Operator.CONTAINS,
            Operator.REGEXP,
            Operator.WILDCARD
        ]
    },
    [Type.NUMBER]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL,
            Operator.PERCENT
        ]
    },
    [Type.TIMESTAMP]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL
        ]
    },
    [Type.SET]: {
        operators: [
            Operator.EQUAL,
            Operator.SUBSET,
            Operator.SUPERSET
        ]
    }
};

export const KIND_TO_TYPE = {
    'value_string': Type.STRING,
    'value_number': Type.NUMBER,
    'value_timestamp': Type.TIMESTAMP,
    'value_set': Type.SET,
};

const _OPERATORS: {[k: number]: {title: string}} = {
    [Operator.EQUAL]: {title: 'equal'},
    [Operator.LESS_THAN]: {title: 'less than'},
    [Operator.LESS_OR_EQUAL]: {title: 'less or equal'},
    [Operator.GREATER_THAN]: {title: 'greater than'},
    [Operator.GREATER_OR_EQUAL]: {title: 'greater or equal'},
    [Operator.PERCENT]: {title: 'percent'},
    [Operator.CONTAINS]: {title: 'contains'},
    [Operator.REGEXP]: {title: 'regexp'},
    [Operator.WILDCARD]: {title: 'wildcard'},
    [Operator.SUPERSET]: {title: 'includes'},
    [Operator.SUBSET]: {title: 'included in'}
};

export const getters = {
    authenticated: (state: IState) => {
        if (!state.cached.auth) {
            return;
        } else {
            return state.graph.Root.authenticated;
        }
    },
    project: (state: IState) => (projectId: string) => {
        return state.graph.Project[projectId];
    },
    projects: (state: IState, getters: any) => {
        return _.map(state.graph.Root.projects, (ref) => {
            return getters.project(ref.Project)
        })
    },
    variable: (state: IState) => (variableId: string) => {
        return state.graph.Variable[variableId];
    },
    variables: (state: IState, getters: any) => (flagId: string) => {
        let projectId = getters.flag(flagId).project.Project;
        let project: Project = getters.project(projectId);
        return _.map(project.variables, (ref) => {
            return getters.variable(ref.Variable);
        });
    },
    flag: (state: IState) => (flagId: string) => {
        return state.edit[flagId] || state.graph.Flag[flagId];
    },
    condition: (state: IState) => (conditionId: string) => {
        return state.graph.Condition[conditionId];
    },
    conditions: (state: IState, getters: any) => (flagId: string) => {
        let flag: Flag = getters.flag(flagId);
        return _.map(flag.conditions, (ref) => {
            return getters.condition(ref.Condition)
        })
    },
    check: (state: IState) => (checkId: string) => {
        return state.graph.Check[checkId];
    },
    operators: (state: IState, getters: any) => (checkId: string) => {
        let check = getters.check(checkId);
        if (!check.variable) {
            return []
        }
        let varType = state.graph.Variable[check.variable.Variable].type;
        let operators = TYPES[varType].operators;
        return _.map(operators, (op: number) => {
            return {id: op, title: _OPERATORS[op].title}
        });
    },
    dirty: (state: IState) => (flagId: string) => {
        return (state.edit[flagId] !== undefined);
    },
    searcher (state: IState, getters: any) {
        let flagRefs = _.get(state, ['graph', 'Root', 'flags'], []);
        let data = _.map(flagRefs, (ref: IRef): ISearchResult => {
            let flag = getters.flag(ref.Flag);
            let projectName = getters.project(flag.project.Project).name;
            return {
                id: flag.id,
                name:  projectName + '.' + flag.name,
            }
        });
        return new Fuse(data, {
            keys: ['name'],
            threshold: 0,
            tokenize: true,
            matchAllTokens: true,
            tokenSeparator: /[ _.-]+/g,
        });
    }
};
