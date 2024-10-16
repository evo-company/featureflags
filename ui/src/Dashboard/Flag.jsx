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
  Flex,
  Space,
  Switch,
  Divider,
  Popconfirm,
  message,
  Modal,
  Tag,
  Timeline,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  CopyOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

import './Flag.less';

import {
  FlagContext,
  useFlagState,
  useProjectsMap,
} from './context';
import { Conditions } from './Conditions';
import { TYPES, KIND_TO_TYPE, KIND, TYPE_TO_KIND } from './constants';
import { useActions } from './actions';
import { copyToClipboard, formatTimestamp, replaceValueInArray } from './utils';
import { useQuery } from "@apollo/client";
import { FLAG_LAST_ACTION_TIMESTAMP_QUERY } from "./queries";


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
  const { name } = useFlagState()

  function confirm() {
    onClick();
    message.success(`Flag ${name} deleted`);
  }

  return (
    <Popconfirm
      title="Are you sure to delete this flag?"
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

const Buttons = ({ onReset, onCancel, onSave, onDelete, onToggle, onHistory }) => {
  const { dirty, overridden, enabled } = useFlagState();
  return (
    <Flex gap="middle" direction='horizontal' justify='space-between'>
      <Space>
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
      </Space>
      <Space size={2}>
        <Button onClick={onHistory}>
          <HistoryOutlined />
        </Button>
        <ResetButton onClick={onReset} disabled={!overridden}>
          reset
        </ResetButton>
        <Button onClick={onSave} type="primary" disabled={!dirty}>
          apply
        </Button>
        <CancelButton onClick={onCancel} disabled={!dirty} />
        <DeleteButton onClick={onDelete} />
      </Space>
    </Flex>
  );
}


const TimestampRow = ({ label, timestamp }) => (
  <span>
    {label}: <b style={{ color: 'green' }}>{formatTimestamp(timestamp)}</b>
  </span>
);

const HistoryModal = ({ flagId, open, onClose, createdTimestamp, reportedTimestamp }) => {
  const { data, loading } = useQuery(FLAG_LAST_ACTION_TIMESTAMP_QUERY, {
    fetchPolicy: "network-only",
    variables: { id: flagId },
    onError: () => {
      message.error("Error fetching last action");
    },
  });

  if (loading || !data) {
    return <p>Loading...</p>;
  };

  const { flagLastActionTimestamp: lastActionTimestamp } = data;

  const history = [];

  if (lastActionTimestamp) {
    history.push({
      children: `Last change at ${formatTimestamp(lastActionTimestamp)}`,
    });
  }

  return (
    <Modal
      title="Flag History"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
    >
      <Space size="large" direction="vertical">
        <Space size="small" direction="vertical">
          <TimestampRow label="Created" timestamp={createdTimestamp} />
          <TimestampRow label="Last Reported" timestamp={reportedTimestamp} />
        </Space>

        <Timeline
          items={history}
        />
      </Space>
    </Modal>
  );
}

const FlagTitle = ({ isSearch, projectName, name }) => {
  const copyFlag = () => {
    copyToClipboard(name, `Flag ${name} copied to clipboard`);
  }

  return (
    <div>
      {isSearch ? <Tag color="volcano" size="big">{projectName}</Tag> : null}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          className='flag-name'
          onClick={copyFlag}
        >
          <Space size={8}>
            <CopyOutlined />
            {name}
          </Space>
        </div>
      </div>
    </div>
  )
}

const getInitialFlagState = (flag) => ({
  flagId: flag.id,
  name: flag.name,
  dirty: false,
  overridden: flag.overridden,
  enabled: flag.enabled,
  // TODO sort conditions, because after save, the order is not guaranteed now
  conditions: flag.conditions.map((c) => c.id),
  createdTimestamp: flag.created_timestamp,
  reportedTimestamp: flag.reported_timestamp,
  projectName: flag.project.name,
});

const getInitialConditions = (flag) => {
  return flag.conditions.reduce((acc, c) => {
    acc[c.id] = {
      ...c,
      checks: c.checks.map((check) => check.id),
    };
    return acc;
  }, {});
};

const getInitialChecks = (flag, project) => {
  const getKind = (check) => {
    const variableId = check.variable.id
    const variable = project.variablesMap[variableId];
    const variableType = variable ? variable.type : undefined;
    return TYPE_TO_KIND[variableType]
  };

  return flag.conditions.reduce((acc, c) => {
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


export const Flag = ({ flag, isSearch }) => {
  const projectsMap = useProjectsMap();
  const project = projectsMap[flag.project.name];
  const [flagState, setFlagState] = useState(getInitialFlagState(flag));
  const [conditions, setConditions] = useState(getInitialConditions(flag));
  const [checks, setChecks] = useState(getInitialChecks(flag, project));
  const {
    saveFlag,
    saveFlagFailed,
    resetFlag,
    deleteFlag,
  } = useActions(flag);

  useEffect(() => {
    setFlagState(getInitialFlagState(flag));
    setConditions(getInitialConditions(flag));
    setChecks(getInitialChecks(flag, project));
  }, [flag]);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const updateFlag = (opts, cb = null) => {
    const data = typeof opts === 'function' ? opts(flagState) : opts;
    const _flag = {
      ...flagState,
      ...data,
      dirty: true
    };
    setFlagState(_flag);
    if (cb) cb(_flag);
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
      let flagConditions = flagState.conditions;
      replaceValueInArray(flagConditions, conditionId, condition.id);
      updateFlag({ conditions: flagConditions })
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
    updateFlag((state) => ({ enabled: !state.enabled }))
  }

  const rollbackState = () => {
    setFlagState(getInitialFlagState(flag));
  }

  const addCheck = (conditionId) => {
    const check = newTempCheck();
    _setCheck(check);
    let condition = touchCondition(conditionId);
    condition.checks.push(check.id);
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
    updateFlag((state) => ({
      conditions: state.conditions.concat(newCond.id)
    }));
  }

  const deleteCondition = (cond) => {
    updateFlag((state) => ({
      conditions: state.conditions.filter((id) => id !== cond.id)
    }));
  }

  const ctx = {
    state: flagState,
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
  }

  return (
    <Card
      size="small"
      className={saveFlagFailed ? 'invalid' : ''}
      title={<FlagTitle
        isSearch={isSearch}
        projectName={flag.project.name}
        name={flag.name}
      />}
      style={{ width: 800, borderRadius: '5px' }}
    >
      <FlagContext.Provider value={ctx}>
        <HistoryModal
          flagId={flag.id}
          open={historyModalOpen}
          createdTimestamp={flag.created_timestamp}
          reportedTimestamp={flag.reported_timestamp}
          onClose={() => setHistoryModalOpen(false)}
        />
        <Buttons
          onToggle={toggleEnabled}
          onReset={resetFlag}
          onCancel={rollbackState}
          onSave={() => saveFlag(
            flagState,
            conditions,
            checks,
            project
          )}
          onDelete={deleteFlag}
          onHistory={() => setHistoryModalOpen(true)}
        />
        <Divider style={{ margin: '10px 0' }} />
        <Conditions />
      </FlagContext.Provider>
    </Card>
  );
}
