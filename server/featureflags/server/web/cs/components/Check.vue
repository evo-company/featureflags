<template>
    <div style="display: flex;">
        <Button class="square-button" type="dashed" size="small" v-on:click="deleteCheck">
            <Icon type="minus-round"></Icon>
        </Button>
        <div class="input-wrapper" v-bind:class="{empty: variableEmpty}">
            <Select v-model="variable" placeholder="variable" size="small">
                <Option v-for="variable in variables" v-bind:key="variable.id" v-bind:value="variable.id">
                    {{ variable.name }}
                </Option>
            </Select>
        </div>
        <div class="input-wrapper" v-bind:class="{empty: operatorEmpty}">
            <Select v-model="operator" placeholder="operator" size="small">
                <Option v-for="op in operators" v-bind:key="op.id" v-bind:value="op.id">
                    {{ op.title }}
                </Option>
            </Select>
        </div>
        <div v-if="isStringType" class="input-wrapper" v-bind:class="{empty: valueEmpty}">
            <Input v-model="stringValue" size="small" />
        </div>
        <div v-else-if="isNumberType" number class="input-wrapper" v-bind:class="{empty: valueEmpty}">
            <Input v-model="numberValue" size="small" />
        </div>
        <div v-else-if="isTimestampType" class="input-wrapper" v-bind:class="{empty: valueEmpty}">
            <DatePicker v-model="timestampValue" format="yyyy-MM-dd HH:mm" type="datetime" size="small" placeholder="Select"></DatePicker>
        </div>
        <div v-else-if="isSetType" class="input-wrapper" v-bind:class="{empty: valueEmpty}">
            <Input v-model="setValue" size="small" />
        </div>
        <div v-else class="input-wrapper">
            <Input disabled size="small" />
        </div>
    </div>
</template>

<script lang="ts">
    import * as _ from 'lodash';
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import {IDeleteCheckPayload} from '../store/types';
    import {ISetVariablePayload, ISetOperatorPayload} from '../store/types';
    import {ISetValueString, ISetValueNumber} from '../store/types';
    import {ISetValueSet, ISetValueTimestamp} from '../store/types';

    import {featureflags} from "../proto";
    import Type = featureflags.graph.Variable.Type;
    import Variable = featureflags.graph.Variable;

    function _parseNumber (value: string) {
        if (/^([-+])?([0-9]+(\.[0-9]+)?)$/.test(value)) {
            return Number(value);
        } else {
            return NaN;
        }
    }

    @Component({
        name: 'check',
        props: {flagId: String, conditionId: String, checkId: String},
    })
    export default class Check extends Vue {
        flagId: string;
        conditionId: string;
        checkId: string;

        get _variableTypes () {
            return _.fromPairs(_.map(
                this.variables,
                (v: Variable) => {return [v.id, v.type]}
            ));
        }
        get _variableType () {
            return (this.check.variable?
                    this._variableTypes[this.check.variable.Variable]:
                    undefined);
        }

        get check (): featureflags.graph.Check {
            return this.$store.getters.check(this.checkId);
        }

        // variable
        get variables () {
            return this.$store.getters.variables(this.flagId);
        }
        get variableEmpty () {
            return this.check.variable === null;
        }
        get variable () {
            return this.check.variable? this.check.variable.Variable: "";
        }
        set variable (variableId: string) {
            let payload: ISetVariablePayload = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId, variableId: variableId
            };
            this.$store.commit('setVariable', payload);
        }

        // operator
        get operators () {
            return this.$store.getters.operators(this.checkId);
        }
        get operatorEmpty () {
            return this.check.operator === 0;
        }
        get operator (): ''|number {
            return this.check.operator || '';
        }
        set operator (value: ''|number) {
            let numValue = <number>(value === ''? 0 : value);
            let payload: ISetOperatorPayload = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId,
                value: numValue
            };
            this.$store.commit('setOperator', payload);
        }

        get valueEmpty () {
            return this.check.kind === undefined;
        }

        // string type
        get isStringType () {
            return this._variableType === Type.STRING;
        }
        get stringValue () {
            return this.check.value_string;
        }
        set stringValue (value: string) {
            let payload: ISetValueString = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId, value: value || null
            };
            this.$store.commit('setValueString', payload);
        }

        // number type
        get isNumberType () {
            return this._variableType === Type.NUMBER;
        }
        get numberValue () {
            let rawValue = this.$store.state.raw.numberInput[this.checkId];
            if (rawValue !== undefined) {
                return rawValue;
            } else if (this.check.hasOwnProperty('value_number')) {
                return this.check.value_number.toString();
            } else {
                return '';
            }
        }
        set numberValue (value: string) {
            this.$store.state.raw.numberInput[this.checkId] = value;

            let numberValue = _parseNumber(value);
            if (isNaN(numberValue)) {
                numberValue = null;
            }
            let payload: ISetValueNumber = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId, value: numberValue
            };
            this.$store.commit('setValueNumber', payload);
        }

        // timestamp type
        get isTimestampType () {
            return this._variableType === Type.TIMESTAMP;
        }
        get timestampValue (): ''|Date {
            if (this.check.value_timestamp === null) {
                return '';
            } else {
                return new Date(<number>this.check.value_timestamp.seconds * 1000);
            }
        }
        set timestampValue (value: ''|Date) {
            let secondsUTC: number;
            if (value === '') {
                secondsUTC = null;
            } else {
                secondsUTC = Math.floor(value.getTime() / 1000);
            }
            let payload: ISetValueTimestamp = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId, value: secondsUTC
            };
            this.$store.commit('setValueTimestamp', payload);
        }

        // set type
        get isSetType () {
            return this._variableType === Type.SET;
        }
        get setValue () {
            let rawValue = this.$store.state.raw.setInput[this.checkId];
            if (rawValue !== undefined) {
                return rawValue;
            } else if (this.check.value_set === null) {
                return '';
            } else {
                return this.check.value_set.items.join(',');
            }
        }
        set setValue (value: string) {
            this.$store.state.raw.setInput[this.checkId] = value;

            let items = _.filter(_.map(value.split(','), _.trim));
            if (!items.length) {
                items = null;
            }
            let payload: ISetValueSet = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId, value: items
            };
            this.$store.commit('setValueSet', payload);
        }

        deleteCheck () {
            let payload: IDeleteCheckPayload = {
                flagId: this.flagId, conditionId: this.conditionId,
                checkId: this.checkId
            };
            this.$store.commit('deleteCheck', payload);
        }
    }
</script>

<style scoped>
    .square-button {
        margin: 2px;
    }
    .input-wrapper {
        width: 100%;
        flex-grow: 1;
        padding: 2px;
    }
    .input-wrapper.empty {
        background-color: rgba(255, 255, 0, 0.85);
        border-radius: 5px;
    }
</style>
