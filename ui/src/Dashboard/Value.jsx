import uniqueId from "lodash/uniqueId";
import startsWith from "lodash/startsWith";
import assign from "lodash/assign";
import cloneDeep from "lodash/cloneDeep";
import without from "lodash/without";
import moment from 'moment';

import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Switch,
  Divider,
  Popconfirm,
  message,
  Input,
  Modal,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  CopyOutlined,
} from '@ant-design/icons';

import './Value.less';

import {
  ValueContext,
  useValueState,
  useProject,
} from './context';
import { ValueConditions } from './ValueConditions';
import { TYPES, KIND_TO_TYPE, KIND, TYPE_TO_KIND } from './constants';
import { useValueActions } from './actions';
import { copyToClipboard, replaceValueInArray, formatTimestamp } from './utils';
import { useLazyQuery } from "@apollo/client";
import { VALUE_LAST_ACTION_TIMESTAMP_QUERY } from "./queries";


const ResetButton = ({ onClick, disabled }) => {
  const style = disabled ? {} : { background: '#f90', color: '#fff' };
  return (
    <Button onClick={onClick} disabled={disabled} style={style}>
      reset
    </Button>
  );
}

const CancelButton = ({ onClick, disabled }) => {
  const style = disabled ? {} : { background: '#ff4d00', color: '#fff' };
  return (
    <Button onClick={onClick} style={style} disabled={disabled}>
      cancel
    </Button>
  );
}
const DeleteButton = ({ onClick }) => {
  const { name } = useValueState()

  function confirm() {
    onClick();
    message.success(`Value ${name} deleted`);
  }

  return (
    <Popconfirm
      title="Are you sure to delete this value?"
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
    >
      <Button type="primary" danger>
        delete
      </Button>
    </Popconfirm>
  );
}

const Buttons = ({ onReset, onCancel, onSave, onDelete, onToggle, onValueOverrideChange }) => {
  const { dirty, overridden, enabled, value_override } = useValueState();
  return (
    <Row align='middle'>
      <Col span={3}>
        <Switch
          onChange={onToggle}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={enabled}
        />
      </Col>
      <Col span={4}>
        {overridden ?
          <span style={{ color: 'green' }}>overriden</span> : 'default'}
      </Col>
      <Col span={6} offset={8}>
        <Space size={2}>
          <ResetButton onClick={onReset} disabled={!overridden}>
            reset
          </ResetButton>
          <Button onClick={onSave} type="primary" disabled={!dirty}>
            apply
          </Button>
          <CancelButton onClick={onCancel} disabled={!dirty}/>
          <DeleteButton onClick={onDelete}/>
        </Space>
      </Col>
      <Col span={8} offset={16} style={{ marginTop: 20 }}>
        <Space size={0}>
          <div>Current value</div>
          <Input
              value={value_override}
              disabled={!enabled}
              size={"middle"}
              style={{ width: 165 }}
              onChange={onValueOverrideChange}
          />
        </Space>
      </Col>
    </Row>
  );
}

const ValueTitle = ({ name, valueId, createdTimestamp, reportedTimestamp }) => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ valueHistory, setValueHistory ] = useState({
    lastAction: 'Loading...',
  });

  const [ loadLastActionTimestamp ] = useLazyQuery(VALUE_LAST_ACTION_TIMESTAMP_QUERY, {
    fetchPolicy: "network-only",
    variables: { id: valueId },
    onCompleted: (data) => {
      setValueHistory({ lastAction: `${data?.valueLastActionTimestamp || "N/A"}` });
    },
    onError: () => {
      message.error("Error fetching last action");
      setValueHistory({ lastAction: "N/A" });
    },
  });

  const getValueHistory = () => {
    loadLastActionTimestamp();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const copyValue = () => {
    copyToClipboard(name, `Value ${name} copied to clipboard`);
  }

  const TimestampRow = ({ label, timestamp }) => (
    <p>
      {label}: <b style={{ color: 'green' }}>{formatTimestamp(timestamp)}</b>
    </p>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div
        className='value-name'
        onClick={copyValue}
      >
        <Space size={8}>
          <CopyOutlined />
          {name}
        </Space>
      </div>
      <Button onClick={getValueHistory}>
        HISTORY
      </Button>
      <Modal
        title="Value History"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <TimestampRow label="Created" timestamp={createdTimestamp} />
        <TimestampRow label="Last Reported" timestamp={reportedTimestamp} />
        <TimestampRow label="Last Action" timestamp={valueHistory.lastAction} />
      </Modal>
    </div>
  )
}

const getInitialValueState = (value) => ({
  valueId: value.id,
  name: value.name,
  dirty: false,
  overridden: value.overridden,
  enabled: value.enabled,
  value_default: value.value_default,
  value_override: value.value_override,
  // TODO sort conditions, because after save, the order is not guaranteed now
  conditions: value.conditions.map((c) => c.id),
  createdTimestamp: value.created_timestamp,
  reportedTimestamp: value.reported_timestamp,
});

const getInitialConditions = (value) => {
  return value.conditions.reduce((acc, c) => {
    acc[c.id] = {
      ...c,
      checks: c.checks.map((check) => check.id),
      value_override: c.value_override,
    };
    return acc;
  }, {});
};

const getInitialChecks = (value, project) => {
  const getKind = (check) => {
    const variableId = check.variable.id
    const variable = project.variablesMap[variableId];
    const variableType = variable ? variable.type : undefined;
    return TYPE_TO_KIND[variableType]
  };

  return value.conditions.reduce((acc, c) => {
    c.checks.forEach((check) => {
      acc[check.id] = {
        ...check,
        kind: getKind(check),
        value_timestamp: check.value_timestamp
          ? moment(check.value_timestamp)
          : null,
        variable: check.variable.id,
      };
    });
    return acc;
  }, {});
};


export const Value = ({ value }) => {
  const project = useProject();
  const [valueState, setValueState] = useState(getInitialValueState(value));
  const [conditions, setConditions] = useState(getInitialConditions(value));
  const [checks, setChecks] = useState(getInitialChecks(value, project));
  const {
    saveValue,
    saveValueFailed,
    resetValue,
    deleteValue,
  } = useValueActions(value);

  useEffect(() => {
    setValueState(getInitialValueState(value));
    setConditions(getInitialConditions(value));
    setChecks(getInitialChecks(value, project));
  }, [value]);

  const updateValue = (opts, cb = null) => {
    const data = typeof opts === 'function' ? opts(valueState) : opts;
    const _value = {
      ...valueState,
      ...data,
      dirty: true
    };
    setValueState(_value);
    if (cb) cb(_value);
  }

  const newTempCondition = () => {
    // creating empty check for new condition
    const check = newTempCheck();
    _setCheck(check);

    return {
      id: uniqueId('temp'),
      checks: [check.id],
    }
  }

  const newTempCheck = () => {
    return {
      id: uniqueId('temp'),
      kind: undefined,
    }
  }

  const _setCondition = (condition) => {
    setConditions({
      ...conditions,
      [condition.id]: condition
    });
  }

  const _setCheck = (check) => {
    setChecks({
      ...checks,
      [check.id]: check
    });
  }

  const touchCondition = (conditionId) => {
    let condition = conditions[conditionId];

    if (!startsWith(conditionId, 'temp')) {
      condition = assign(cloneDeep(condition), { id: uniqueId('temp') });

      _setCondition(condition);
      let valueConditions = valueState.conditions;
      replaceValueInArray(valueConditions, conditionId, condition.id);
      updateValue({ conditions: valueConditions })
    }
    return condition;
  }

  const touchCheck = (conditionId, checkId) => {
    let check = checks[checkId];

    if (!startsWith(checkId, 'temp')) {
      check = assign(cloneDeep(check), { id: uniqueId('temp') });

      _setCheck(check);
      let condition = touchCondition(conditionId);
      replaceValueInArray(condition.checks, checkId, check.id);
      _setCondition(condition);
    }

    return check;
  }

  const setVariable = (conditionId, checkId, variableId) => {
    let check = touchCheck(conditionId, checkId);
    check.variable = variableId;

    // maybe clear operator
    const type = project.variablesMap[variableId].type;
    const operators = TYPES[type].operators;
    if (check.operator !== undefined && operators.indexOf(check.operator) < 0) {
      check.operator = undefined;
    }

    // maybe clear value
    const valueType = KIND_TO_TYPE[check.kind];

    if (type !== valueType) {
      check.kind = undefined;
      delete check.value_string;
      delete check.value_number;
      delete check.value_timestamp;
      delete check.value_set;
    }

    _setCheck(check);
  }

  const setOperator = (conditionId, checkId, operator) => {
    let check = touchCheck(conditionId, checkId);

    if (operator === 0 || operator === null) {
      delete check.operator;
    } else {
      check.operator = operator;
    }

    _setCheck(check);
  }

  const _setValue = (check, kind, value) => {
    if (value === null) {
      delete check[kind];
      check.kind === undefined;
    } else {
      check[kind] = value;
      check.kind = kind;
    }
  }

  const setValueString = (conditionId, checkId, value) => {
    let check = touchCheck(conditionId, checkId);
    _setValue(check, KIND.VALUE_STRING, value);
    delete check.value_number;
    delete check.value_timestamp;
    delete check.value_set;

    _setCheck(check);
  }

  const setValueNumber = (conditionId, checkId, value) => {
    let check = touchCheck(conditionId, checkId);
    _setValue(check, KIND.VALUE_NUMBER, value);
    delete check.value_string;
    delete check.value_timestamp;
    delete check.value_set;

    _setCheck(check);
  }

  const setValueTimestamp = (conditionId, checkId, value) => {
    let check = touchCheck(conditionId, checkId);
    _setValue(check, KIND.VALUE_TIMESTAMP, value);
    delete check.value_string;
    delete check.value_number;
    delete check.value_set;

    _setCheck(check);
  }

  const setValueSet = (conditionId, checkId, value) => {
    let check = touchCheck(conditionId, checkId);
    _setValue(check, KIND.VALUE_SET, value);
    delete check.value_string;
    delete check.value_number;
    delete check.value_timestamp;

    _setCheck(check);
  }

  const toggleEnabled = () => {
    updateValue((state) => ({ enabled: !state.enabled }))
  }

  const valueOverrideState = (event) => {
    updateValue((state) => ({ value_override: event.target.value }))
  }

  const rollbackState = () => {
    setValueState(getInitialValueState(value));
  }

  const addCheck = (conditionId) => {
    const check = newTempCheck();
    _setCheck(check);
    let condition = touchCondition(conditionId);
    condition.checks.push(check.id);
    _setCondition(condition);
  }

  const updateValueConditionOverride = (conditionId, valueOverride) => {
    let condition = touchCondition(conditionId);
    condition.value_override = valueOverride;
    _setCondition(condition);
  }

  const deleteCheck = (conditionId, checkId) => {
    let condition = touchCondition(conditionId);
    condition.checks = without(condition.checks, checkId);
    _setCondition(condition);
    if (condition.checks.length === 0) {
      deleteCondition(condition);
    }
  }

  const addCondition = () => {
    const newCond = newTempCondition();
    _setCondition(newCond);
    updateValue((state) => ({
      conditions: state.conditions.concat(newCond.id)
    }));
  }

  const deleteCondition = (cond) => {
    updateValue((state) => ({
      conditions: state.conditions.filter((id) => id !== cond.id)
    }));
  }

  const ctx = {
    state: valueState,
    conditions,
    checks,
    addCondition,
    deleteCondition,
    addCheck,
    deleteCheck,
    setVariable,
    setOperator,
    setValueString,
    setValueNumber,
    setValueTimestamp,
    setValueSet,
    updateValueConditionOverride,
  }

  return (
    <Card
      size="small"
      className={saveValueFailed ? 'invalid' : ''}
      title={<ValueTitle
          name={value.name}
          valueId={value.id}
          createdTimestamp={value.created_timestamp}
          reportedTimestamp={value.reported_timestamp}
      />}
      style={{ width: 800, borderRadius: '5px' }}
    >
      <ValueContext.Provider value={ctx}>
        <Buttons
          onToggle={toggleEnabled}
          onReset={resetValue}
          onCancel={rollbackState}
          onSave={() => saveValue(
            valueState,
            conditions,
            checks,
            project
          )}
          onDelete={deleteValue}
          onValueOverrideChange={valueOverrideState}
        />
        <Divider style={{ margin: '10px 0' }}/>
        <ValueConditions />
      </ValueContext.Provider>
    </Card>
  );
}
