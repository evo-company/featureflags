import Vue from "vue";
import * as _ from "lodash";

import {featureflags, google, hiku} from "../proto";
import IRef = featureflags.graph.IRef;

import Ref = featureflags.graph.Ref;
import Set = featureflags.graph.Set;
import Result = featureflags.graph.Result;
import Node = hiku.protobuf.query.Node;
import Item = hiku.protobuf.query.Item;
import Project = featureflags.graph.Project;
import IProject = featureflags.graph.IProject;
import Variable = featureflags.graph.Variable;
import IVariable = featureflags.graph.IVariable;
import Flag = featureflags.graph.Flag;
import IFlag = featureflags.graph.IFlag;
import Condition = featureflags.graph.Condition;
import ICondition = featureflags.graph.ICondition;
import Check = featureflags.graph.Check;
import ICheck = featureflags.graph.ICheck;
import Timestamp = google.protobuf.Timestamp;

import {KIND_TO_TYPE, TYPES} from "./getters";
import {IDeleteCheckPayload, ISetEnabledPayload} from './types';
import {ISetOperatorPayload, ISetVariablePayload} from './types';
import {ISetValueNumber, ISetValueString} from './types';
import {ISetValueSet, ISetValueTimestamp} from './types';

export interface IState {
    graph: Result;
    edit: {[k: string]: IFlag};
    cached: {
        auth: boolean,
        search: boolean,
        flags: string[]
    },
    raw: {
        numberInput: {[k: string]: string},
        setInput: {[k: string]: string}
    }
}

function _ts(seconds?: number) {
    let timestamp = null;
    if (seconds !== null) {
        timestamp = Timestamp.create({seconds});
    }
    return timestamp;
}

function _set(items: string[]) {
    let set = null;
    if (items !== null) {
        if (!items.length) {
            throw `Empty set provided`
        }
        set = Set.create({items});
    }
    return set;
}

function _replace (array: Array<IRef>, value: IRef, newValue: IRef) {
    let idx = _.findIndex(array, value);
    if (idx >= 0) {
        Vue.set(array, idx, newValue);
    } else {
        throw `Value ${value} not found in array ${array}`
    }
}

function _remove (array: Array<IRef>, value: IRef) {
    let idx = _.findIndex(array, value);
    if (idx >= 0) {
        array.splice(idx, 1);
    } else {
        throw `Value ${value} not found in array ${array}`
    }
}

function touchFlag (state: IState, flagId: string): IFlag {
    let flag = state.edit[flagId];
    if (flag === undefined) {
        flag = Vue.set(state.edit, flagId,
                       _.cloneDeep(state.graph.Flag[flagId]));
    }
    return flag;
}

function touchCondition (state: IState, flagId: string, conditionId: string): ICondition {
    let condition = state.graph.Condition[conditionId];
    if (!_.startsWith(conditionId, 'temp')) {
        condition = _.assign(_.cloneDeep(condition), {id: _.uniqueId('temp')});
        Vue.set(state.graph.Condition, condition.id, condition);
        let flag = touchFlag(state, flagId);
        _replace(flag.conditions, Ref.create({Condition: conditionId}),
                 Ref.create({Condition: condition.id}));
    }
    return condition;
}

function touchCheck (state: IState, flagId: string, conditionId: string, checkId: string): Check {
    let check = <Check>state.graph.Check[checkId];
    if (!_.startsWith(checkId, 'temp')) {
        check = _.assign(_.cloneDeep(check), {id: _.uniqueId('temp')});
        Vue.set(state.graph.Check, check.id, check);
        let condition = touchCondition(state, flagId, conditionId);
        _replace(condition.checks, Ref.create({Check: checkId}),
                 Ref.create({Check: check.id}));
    }
    return check;
}

type IGraphNode = IProject|IVariable|IFlag|ICondition|ICheck;

function getRef(res: Result, ref: Ref) {
    let obj: IGraphNode;
    let idx: {[k: string]: IGraphNode};
    let cls: () => IGraphNode;
    let key: string;
    switch (ref.to) {
        case 'Project':
            idx = res.Project;
            key = ref.Project;
            cls = Project.create;
            break;
        case 'Variable':
            idx = res.Variable;
            key = ref.Variable;
            cls = Variable.create;
            break;
        case 'Flag':
            idx = res.Flag;
            key = ref.Flag;
            cls = Flag.create;
            break;
        case 'Condition':
            idx = res.Condition;
            key = ref.Condition;
            cls = Condition.create;
            break;
        case 'Check':
            idx = res.Check;
            key = ref.Check;
            cls = Check.create;
            break;
        default:
            throw `Invalid ref.to: ${ref.to}`;
    }
    obj = idx[key];
    if (obj === undefined) {
        obj = Vue.set(idx, key, cls());
    }
    return obj;
}

function update(srcGraph: Result, dstGraph: Result, query: Node, src: any, dst: any) {
    if (src instanceof Check && src.kind) {
        _rset(dst, 'kind', src.kind);
    }
    for (let i=0; i<query.items.length; i++) {
        let item = <Item>query.items[i];
        if (item.value === 'field') {
            if (src.hasOwnProperty(item.field.name) || dst[item.field.name] !== src[item.field.name]) {
                _rset(dst, item.field.name, src[item.field.name]);
            }
        } else if (item.value === 'link') {
            let linkedValue = src[item.link.name];
            if (_.isArray(linkedValue)) {
                for (let j=0; j<linkedValue.length; j++) {
                    let ref = linkedValue[j];
                    let srcItem  = getRef(srcGraph, ref);
                    let dstItem = getRef(dstGraph, ref);
                    update(srcGraph, dstGraph, <Node>item.link.node, srcItem, dstItem);
                }
                _rset(dst, item.link.name, _.map(linkedValue, (ref: Ref) => {
                    return Ref.toObject(ref);
                }));
            } else if (linkedValue instanceof Ref) {
                let srcItem = getRef(srcGraph, linkedValue);
                let dstItem = getRef(dstGraph, linkedValue);
                update(srcGraph, dstGraph, <Node>item.link.node, srcItem, dstItem);
                _rset(dst, item.link.name, Ref.toObject(linkedValue));
            } else {
                throw `Invalid linked value: ${linkedValue}`;
            }
        }
    }
}

function _rset (obj: any, key: any, val: any) {
    if (obj.hasOwnProperty(key)) {
        obj[key] = val;
        return val;
    }
    let ob = (<any>obj).__ob__;
    (<any>Vue).util.defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}

function _setCheckValue (check: Check, name: string, value: any) {
    if (value === null) {
        delete (<any>check)[name];
        _rset(check, 'kind', undefined);
    } else {
        _rset(check, name, value);
        _rset(check, 'kind', name);
    }
}

export const mutations = {
    load (state: IState, {query, result}: {query: Node, result: Result}) {
        update(result, state.graph, query, result.Root, state.graph.Root);
    },
    cancel (state: IState, flagId: string) {
        Vue.delete(state.edit, flagId);
        _.forEach(state.graph.Flag[flagId].conditions, (conditionRef) => {
            _.forEach(state.graph.Condition[conditionRef.Condition].checks, (checkRef) => {
                Vue.delete(state.raw.numberInput, checkRef.Check);
                Vue.delete(state.raw.setInput, checkRef.Check);
            });
        });
    },
    addCondition (state: IState, {flagId}: {flagId: string}) {
        let _condition = Condition.create({id: _.uniqueId('temp')});
        Vue.set(state.graph.Condition, _condition.id, _condition);
        let flag = touchFlag(state, flagId);
        flag.conditions.push(Ref.create({Condition: _condition.id}));

        // adding empty check
        this.commit('addCheck', {flagId, conditionId: _condition.id});
    },
    deleteCondition (state: IState, {flagId, conditionId}: {flagId: string, conditionId: string}) {
        let conditions = touchFlag(state, flagId).conditions;
        _remove(conditions, Ref.create({Condition: conditionId}));
    },
    addCheck (state: IState, {flagId, conditionId}: {flagId: string, conditionId: string}) {
        let _check = Check.create({id: _.uniqueId('temp')});
        Vue.set(state.graph.Check, _check.id, _check);
        _rset(_check, 'kind', undefined);
        let condition = touchCondition(state, flagId, conditionId);
        condition.checks.push(Ref.create({Check: _check.id}));
    },
    deleteCheck (state: IState, {flagId, conditionId, checkId}: IDeleteCheckPayload) {
        let condition = touchCondition(state, flagId, conditionId);
        _remove(condition.checks, Ref.create({Check: checkId}));
        if (condition.checks.length === 0) {
            this.commit('deleteCondition', {flagId, conditionId: condition.id});
        }
    },
    setEnabled (state: IState, {flagId, value}: ISetEnabledPayload) {
        touchFlag(state, flagId).enabled.value = value;
    },
    setVariable (state: IState, {flagId, conditionId, checkId, variableId}: ISetVariablePayload) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        _rset(check, 'variable', Ref.create({Variable: variableId}));
        // maybe clear operator
        let type = state.graph.Variable[variableId].type;
        let operators = TYPES[type].operators;
        if (check.operator !== 0 && operators.indexOf(check.operator) < 0) {
            _rset(check, 'operator', 0);
        }
        // maybe clear value
        let valueType = KIND_TO_TYPE[check.kind];
        if (type !== valueType) {
            _rset(check, 'kind', undefined);
            delete check.value_string;
            delete check.value_number;
            delete check.value_timestamp;
            delete check.value_set;
            Vue.delete(state.raw.numberInput, checkId);
            Vue.delete(state.raw.setInput, checkId);
        }
    },
    setOperator (state: IState, {flagId, conditionId, checkId, value}: ISetOperatorPayload) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        if (value === 0) {
            delete check.operator;
        } else {
            _rset(check, 'operator', value);
        }
    },
    setValueString (state: IState, {flagId, conditionId, checkId, value}: ISetValueString) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        _setCheckValue(check, 'value_string', value);
        delete check.value_number;
        delete check.value_timestamp;
        delete check.value_set;
    },
    setValueNumber (state: IState, {flagId, conditionId, checkId, value}: ISetValueNumber) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        delete check.value_string;
        _setCheckValue(check, 'value_number', value);
        delete check.value_timestamp;
        delete check.value_set;
    },
    setValueTimestamp (state: IState, {flagId, conditionId, checkId, value}: ISetValueTimestamp) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        delete check.value_string;
        delete check.value_number;
        _setCheckValue(check, 'value_timestamp', _ts(value));
        delete check.value_set;
    },
    setValueSet (state: IState, {flagId, conditionId, checkId, value}: ISetValueSet) {
        let check = touchCheck(state, flagId, conditionId, checkId);
        delete check.value_string;
        delete check.value_number;
        delete check.value_timestamp;
        _setCheckValue(check, 'value_set', _set(value));
    },
    authCached (state: IState) {
        state.cached.auth = true;
    },
    searchCached (state: IState) {
        state.cached.search = true;
    },
    flagsCached (state: IState, flagIds: string[]) {
        state.cached.flags = _.concat(state.cached.flags, flagIds);
    }
};
