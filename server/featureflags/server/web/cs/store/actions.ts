import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";

import {call} from "./utils";
import {IState} from "./mutations";
import {G, FLAG_NODE_FULL} from "../query";

import {featureflags, google, hiku} from "../proto";
import IReply = featureflags.backend.IReply;
import Node = hiku.protobuf.query.Node;
import IOperation = featureflags.backend.IOperation;
import IRef = featureflags.graph.IRef;
import IEitherId = featureflags.backend.IEitherId;
import Operation = featureflags.backend.Operation;
import Check = featureflags.graph.Check;
import Request = featureflags.backend.Request;
import Type = featureflags.graph.Variable.Type;
import {KIND_TO_TYPE} from "./getters";
import Timestamp = google.protobuf.Timestamp;
import Set = featureflags.graph.Set;

const _SCOPE = uuidv4();

interface ICheckErrors {
    internalError?: boolean;
    missingValue?: boolean;
}

export const MISSING_VALUE = 'Please enter missing values';

function _getOps (state: IState, flagId: string) {
    let ops: IOperation[] = [];
    let errors: ICheckErrors = {};
    let flag = state.graph.Flag[flagId];
    let flag_ = state.edit[flagId];
    if (flag_ === undefined) {
        return {ops, errors};
    }

    if (flag.enabled.value === true && flag_.enabled.value === false) {
        ops.push(Operation.create({
            disable_flag: {
                flag_id: {value: flagId}
            }
        }));
    } else if (flag.enabled.value === false && flag_.enabled.value === true) {
        ops.push(Operation.create({
            enable_flag: {
                flag_id: {value: flagId}
            }
        }));
    }

    _.forEach(_.difference(flag_.conditions, flag.conditions), (conditionRef: IRef) => {
        let condition = state.graph.Condition[conditionRef.Condition];
        let conditionChecks: IEitherId[] = [];

        _.forEach(condition.checks, (checkRef: IRef) => {
            if (_.startsWith(checkRef.Check, 'temp')) {
                let check = <Check>state.graph.Check[checkRef.Check];
                if (check.kind === undefined) {
                    errors.missingValue = true;
                    return;
                }
                if (check.operator === 0) {
                    errors.missingValue = true;
                    return;
                }

                let op = Operation.create({
                    add_check: {
                        local_id: {scope: _SCOPE, value: checkRef.Check},
                        variable: {value: check.variable.Variable},
                        operator: check.operator
                    }
                });

                let variable = state.graph.Variable[check.variable.Variable];
                if (variable.type !== KIND_TO_TYPE[check.kind]) {
                    errors.internalError = true;
                    console.log(check, variable);
                    return;
                }
                switch (variable.type) {
                    case Type.STRING:
                        if (!_.isString(check.value_string) || !check.value_string) {
                            errors.internalError = true;
                            console.log(check);
                        } else {
                            op.add_check.value_string = check.value_string;
                        }
                        break;
                    case Type.NUMBER:
                        if (!_.isNumber(check.value_number || !check.hasOwnProperty('value_number'))) {
                            errors.internalError = true;
                            console.log(check);
                        } else {
                            op.add_check.value_number = check.value_number;
                        }
                        break;
                    case Type.TIMESTAMP:
                        if (!(check.value_timestamp instanceof Timestamp)) {
                            errors.internalError = true;
                            console.log(check);
                        } else {
                            op.add_check.value_timestamp = check.value_timestamp;
                        }
                        break;
                    case Type.SET:
                        if (!(check.value_set instanceof Set) || !check.value_set.items.length) {
                            errors.internalError = true;
                            console.log(check);
                        } else {
                            op.add_check.value_set = check.value_set;
                        }
                        break;
                    default:
                        errors.internalError = true;
                        console.log(variable);
                }
                ops.push(op);
                conditionChecks.push({local_id: {scope: _SCOPE,
                                                 value: checkRef.Check}});
            } else {
                conditionChecks.push({id: {value: checkRef.Check}})
            }
        });
        ops.push(Operation.create({
            add_condition: {
                flag_id: {value: flagId},
                local_id: {scope: _SCOPE, value: conditionRef.Condition},
                checks: conditionChecks
            }
        }));
    });
    _.forEach(_.difference(flag.conditions, flag_.conditions), (ref: IRef) => {
        ops.push(Operation.create({
            disable_condition: {
                condition_id: {value: ref.Condition}
            }
        }));
    });
    return {ops, errors};
}

export interface ISignIn {
    username: string;
    password: string;
}

interface IContext {
    commit: (mutation: string, payload: any) => void;
    state: IState;
}

export const actions = {
    signIn: ({commit}: IContext, {username, password}: ISignIn) => {
        let query = G.node([G.field('authenticated')]);
        let request = Request.create({
            operations: [
                Operation.create({sign_in: {username, password}})
            ],
            query
        });
        return call(request)
        .then((reply: IReply) => {
            commit('load', {query, result: reply.result});
            return Promise.resolve(reply.result.Root.authenticated);
        });
    },
    signOut: ({commit}: IContext) => {
        let query = G.node([G.field('authenticated')]);
        let request = Request.create({
            operations: [
                Operation.create({sign_out: {}})
            ],
            query
        });
        return call(request)
        .then((reply: IReply) => {
            commit('load', {query, result: reply.result});
            return Promise.resolve(reply.result.Root.authenticated);
        });
    },
    pull: ({commit}: IContext, query: Node) => {
        let request = Request.create({query: query});
        return call(request)
        .then((reply: IReply) => {
            if (reply.result !== null) {
                commit('load', {query, result: reply.result});
            }
        });
    },
    save: ({state, commit}: IContext, flagId: string) => {
        let {ops, errors} = _getOps(state, flagId);
        if (errors.internalError) {
            return Promise.reject('Internal error: unable to build request');
        } else if (errors.missingValue) {
            return Promise.reject(MISSING_VALUE);
        } else if (ops.length > 0) {
            let query = G.node([
                G.link('flag', FLAG_NODE_FULL,
                       {fields: {id: {stringValue: flagId}}})
            ]);
            let request = Request.create({
                operations: ops,
                query: query
            });
            return call(request)
            .then((reply: IReply) => {
                commit('load', {query, result: reply.result});
                commit('cancel', flagId);
            });
        }
    },
    reset: ({commit}: IContext, flagId: string) => {
        let query = G.node([
            G.link('flag', FLAG_NODE_FULL,
                   {fields: {id: {stringValue: flagId}}})
        ]);
        let request = Request.create({
            operations: [Operation.create({reset_flag: {flag_id: {value: flagId}}})],
            query: query
        });
        return call(request)
        .then((reply: IReply) => {
            commit('load', {query, result: reply.result});
            commit('cancel', flagId);
        });
    }
};
