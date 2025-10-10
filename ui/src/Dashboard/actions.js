import forEach from 'lodash/forEach';
import difference from 'lodash/difference';
import startsWith from 'lodash/startsWith';
import isNumber from 'lodash/isNumber';
import filter from 'lodash/filter';
import map from 'lodash/map';
import trim from 'lodash/trim';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

import * as moment from 'moment'
const { isMoment } = moment;
import { v4 as uuidv4 } from 'uuid';

import { KIND_TO_TYPE, Type } from './constants';
import { useMutation } from '@apollo/client';
import {
  DELETE_FLAG_MUTATION,
  FLAG_QUERY,
  RESET_FLAG_MUTATION,
  SAVE_FLAG_MUTATION,
  DELETE_VALUE_MUTATION,
  VALUE_QUERY,
  RESET_VALUE_MUTATION,
  SAVE_VALUE_MUTATION,
} from './queries';
import { message } from 'antd';
import { useState } from 'react';

/**
 * Save flag operations
 */
class Operation {
  static _SCOPE = uuidv4();

  static disableFlag(flagId) {
    return {
      type: 'disable_flag',
      payload: {
        flag_id: flagId
      }
    }
  }

  static enableFlag(flagId) {
    return {
      type: 'enable_flag',
      payload: {
        flag_id: flagId
      }
    }
  }

  static _localId(value) {
    return { scope: Operation._SCOPE, value: value };
  }

  static addCheck(check) {
    return {
      type: 'add_check',
      payload: {
        local_id: Operation._localId(check.id),
        kind: check.kind,
        variable: check.variable,
        operator: check.operator,
        value_string: undefined,
        value_number: undefined,
        value_timestamp: undefined,
        value_set: undefined,
      }
    }
  }

  static addCondition(flagId, conditionId, conditionChecks, position) {
    return {
      type: 'add_condition',
      payload: {
        flag_id: flagId,
        local_id: Operation._localId(conditionId),
        checks: conditionChecks,
        position: position
      }
    }
  }

  static disableCondition(conditionId) {
    return {
      type: 'disable_condition',
      payload: {
        condition_id: conditionId
      }
    }
  }
}

export const INTERNAL_ERROR = 'Internal error';
export const MISSING_VALUE = 'Please enter missing values';


export function getSaveOperations(flag, editFlag, conditions, checks, variablesMap) {
  let ops = [];
  let errors = {};
  let flag_ = editFlag;

  if (!flag_.dirty) {
    return { ops, errors };
  }

  if (flag.enabled === true && flag_.enabled === false) {
    ops.push(Operation.disableFlag(flag.id));
  } else if (flag.enabled === false && flag_.enabled === true) {
    ops.push(Operation.enableFlag(flag.id));
  }

  const originalConditions = flag.conditions.map((c) => c.id);
  const newConditions = flag_.conditions;

  // First, remove conditions that are no longer present
  forEach(difference(originalConditions, newConditions), (conditionId) => {
    ops.push(Operation.disableCondition(conditionId));
  });

  // Then, add new conditions/update existing conditions/checks
  forEach(difference(newConditions, originalConditions), (conditionId) => {
    let condition = conditions[conditionId];
    let conditionChecks = [];

    forEach(condition.checks, (checkId) => {
      if (startsWith(checkId, 'temp')) {
        const check = checks[checkId];
        if (check.kind === undefined) {
          errors.missingValue = true;
          return;
        }
        if (check.operator === null || check.operator === undefined) {
          errors.missingValue = true;
          return;
        }

        let op = Operation.addCheck(check);
        let variable = variablesMap[check.variable];
        if (variable.type !== KIND_TO_TYPE[check.kind]) {
          errors.internalError = true;
          console.log(check, variable);
          return;
        }
        switch (variable.type) {
          case Type.STRING:
            if (!isString(check.value_string) || !check.value_string) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_string = check.value_string;
            }
            break;
          case Type.NUMBER:
            if (!isNumber(check.value_number) && check.hasOwnProperty('value_number')) {
              errors.invalidValue = "Number value is invalid";
              console.log(check);
            } else if (!isNumber(check.value_number) || !check.hasOwnProperty('value_number')) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_number = check.value_number;
            }
            break;
          case Type.TIMESTAMP:
            if (!isMoment(check.value_timestamp)) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_timestamp = check.value_timestamp.unix();
            }
            break;
          case Type.SET:
            if (!check.value_set || !check.value_set.length) {
              errors.internalError = true;
              console.log(check);
            } else {
              let items = filter(map(check.value_set.split(','), trim));
              if (items.length > 0) {
                items = Array.from(new Set(items))
              }
              op.payload.value_set = items;
            }
            break;
          default:
            errors.internalError = true;
            console.log(variable);
        }
        ops.push(op);
        conditionChecks.push({
          local_id: Operation._localId(checkId)
        });
      } else {
        conditionChecks.push({ id: checkId })
      }
    });
    ops.push(Operation.addCondition(flag.id, conditionId, conditionChecks, condition.position));

  });
  return { ops, errors };
}


export const useActions = (flag) => {
  const [saveFlagFailed, setSaveFlagFailed] = useState(false);

  const [saveFlagMut] = useMutation(SAVE_FLAG_MUTATION, {
    refetchQueries: [{
      query: FLAG_QUERY,
      variables: {
        id: flag.id
      }
    }],
    onCompleted: (data) => {
      if (data.saveFlag && data.saveFlag.errors) {
        message.error(data.saveFlag.errors.join(', '));
      } else {
        message.success(`Flag "${flag.name}" saved successfully`);
      }
    },
    onError: (error) => {
      message.error(`Error saving flag "${flag.name}": ${error.message}`);
    }
  });
  const [resetFlagMut] = useMutation(RESET_FLAG_MUTATION, {
    variables: {
      id: flag.id
    },
    refetchQueries: [{
      query: FLAG_QUERY,
      variables: {
        id: flag.id
      }
    }]
  });
  const [deleteFlagMut] = useMutation(DELETE_FLAG_MUTATION, {
    variables: {
      id: flag.id
    },
    update(cache) {
      const normalizedId = cache.identify({ id: flag.id, __typename: 'Flag' });
      cache.evict({ id: normalizedId });
      cache.gc();
    }
  });

  const saveFlag = (flagState, conditions, checks, project) => {
    const {
      ops,
      errors
    } = getSaveOperations(flag, flagState, conditions, checks, project.variablesMap);
    if (!isEmpty(errors)) {
      if (errors.invalidValue) {
        message.error(errors.invalidValue);
      } else if (errors.internalError) {
        message.error(INTERNAL_ERROR);
      } else if (errors.missingValue) {
        message.error(MISSING_VALUE);
      }
      setSaveFlagFailed(true)
      setTimeout(() => {
        setSaveFlagFailed(false)
      }, 500);
      return;
    }
    saveFlagMut({
      variables: {
        operations: ops
      }
    });
  }

  const resetFlag = () => {
    resetFlagMut();
  }

  const deleteFlag = () => {
    deleteFlagMut();
  }

  return {
    saveFlag,
    saveFlagFailed,
    resetFlag,
    deleteFlag,
  }
}

/**
 * Save value operations
 */
class ValueOperation {
  static _SCOPE = uuidv4();

  static disableValue(valueId) {
    return {
      type: 'disable_value',
      payload: {
        value_id: valueId
      }
    }
  }

    static updateValueOverride(valueId, valueOverride) {
    return {
      type: 'update_value_value_override',
      payload: {
        value_id: valueId,
        value_override: valueOverride,
      }
    }
  }

  static enableValue(valueId) {
    return {
      type: 'enable_value',
      payload: {
        value_id: valueId
      }
    }
  }

  static _localId(value) {
    return { scope: ValueOperation._SCOPE, value: value };
  }

  static addCheck(check) {
    return {
      type: 'add_check',
      payload: {
        local_id: ValueOperation._localId(check.id),
        kind: check.kind,
        variable: check.variable,
        operator: check.operator,
        value_string: undefined,
        value_number: undefined,
        value_timestamp: undefined,
        value_set: undefined,
      }
    }
  }

  static addCondition(valueId, conditionId, conditionChecks, valueConditionOverride, position) {
    return {
      type: 'add_value_condition',
      payload: {
        value_id: valueId,
        local_id: ValueOperation._localId(conditionId),
        checks: conditionChecks,
        value_condition_override: valueConditionOverride,
        position: position
      }
    }
  }

  static disableCondition(conditionId) {
    return {
      type: 'disable_value_condition',
      payload: {
        condition_id: conditionId
      }
    }
  }
}

export function getValueSaveOperations(value, editValue, conditions, checks, variablesMap) {
  let ops = [];
  let errors = {};
  let value_ = editValue;

  if (!value_.dirty) {
    return { ops, errors };
  }

  if (value.enabled === true && value_.enabled === false) {
    ops.push(ValueOperation.disableValue(value.id));
  } else if (value.enabled === false && value_.enabled === true) {
    ops.push(ValueOperation.enableValue(value.id));
  }

  if (value.enabled === true && value.value_override !== value_.value_override) {
    ops.push(ValueOperation.updateValueOverride(value.id, value_.value_override));
  }

  const originalConditions = value.conditions.map((c) => c.id);
  const newConditions = value_.conditions;

  // First, remove conditions that are no longer present
  forEach(difference(originalConditions, newConditions), (conditionId) => {
    ops.push(ValueOperation.disableCondition(conditionId));
  });

  // Then, add new conditions/update existing conditions/checks
  forEach(difference(newConditions, originalConditions), (conditionId) => {
    let condition = conditions[conditionId];
    let conditionChecks = [];

    forEach(condition.checks, (checkId) => {
      if (startsWith(checkId, 'temp')) {
        const check = checks[checkId];
        if (check.kind === undefined) {
          errors.missingValue = true;
          return;
        }
        if (check.operator === null || check.operator === undefined) {
          errors.missingValue = true;
          return;
        }

        let op = ValueOperation.addCheck(check);
        let variable = variablesMap[check.variable];
        if (variable.type !== KIND_TO_TYPE[check.kind]) {
          errors.internalError = true;
          console.log(check, variable);
          return;
        }
        switch (variable.type) {
          case Type.STRING:
            if (!isString(check.value_string) || !check.value_string) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_string = check.value_string;
            }
            break;
          case Type.NUMBER:
            if (!isNumber(check.value_number) || !check.hasOwnProperty('value_number')) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_number = check.value_number;
            }
            break;
          case Type.TIMESTAMP:
            if (!isMoment(check.value_timestamp)) {
              errors.internalError = true;
              console.log(check);
            } else {
              op.payload.value_timestamp = check.value_timestamp.unix();
            }
            break;
          case Type.SET:
            if (!check.value_set || !check.value_set.length) {
              errors.internalError = true;
              console.log(check);
            } else {
              let items = filter(map(check.value_set.split(','), trim));
              if (items.length > 0) {
                items = Array.from(new Set(items))
              }
              op.payload.value_set = items;
            }
            break;
          default:
            errors.internalError = true;
            console.log(variable);
        }
        ops.push(op);
        conditionChecks.push({
          local_id: ValueOperation._localId(checkId)
        });
      } else {
        conditionChecks.push({ id: checkId })
      }
    });
    if (condition.value_override === null || condition.value_override === undefined) {
        errors.missingValue = true;
        return;
      }
    ops.push(ValueOperation.addCondition(value.id, conditionId, conditionChecks, condition.value_override, condition.position));

  });
  return { ops, errors };
}


export const useValueActions = (value) => {
  const [saveValueFailed, setSaveValueFailed] = useState(false);

  const [saveValueMut] = useMutation(SAVE_VALUE_MUTATION, {
    refetchQueries: [{
      query: VALUE_QUERY,
      variables: {
        id: value.id,
      }
    }]
  });
  const [resetValueMut] = useMutation(RESET_VALUE_MUTATION, {
    variables: {
      id: value.id
    },
    refetchQueries: [{
      query: VALUE_QUERY,
      variables: {
        id: value.id
      }
    }]
  });
  const [deleteValueMut] = useMutation(DELETE_VALUE_MUTATION, {
    variables: {
      id: value.id
    },
    update(cache) {
      const normalizedId = cache.identify({ id: value.id, __typename: 'Value' });
      cache.evict({ id: normalizedId });
      cache.gc();
    }
  });

  const saveValue = (valueState, conditions, checks, project) => {
    const {
      ops,
      errors
    } = getValueSaveOperations(value, valueState, conditions, checks, project.variablesMap);
    if (!isEmpty(errors)) {
      if (errors.internalError) {
        message.error(INTERNAL_ERROR);
      } else if (errors.missingValue) {
        message.error(MISSING_VALUE);
      }
      setSaveValueFailed(true)
      setTimeout(() => {
        setSaveValueFailed(false)
      }, 500);
      return;
    }
    saveValueMut({
      variables: {
        operations: ops
      }
    });
  }

  const resetValue = () => {
    resetValueMut();
  }

  const deleteValue = () => {
    deleteValueMut();
  }

  return {
    saveValue,
    saveValueFailed,
    resetValue,
    deleteValue,
  }
}
