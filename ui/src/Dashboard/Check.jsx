import {
  Button,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Row,
  Space,
  Select,
} from 'antd';
import {
  MinusOutlined,
} from '@ant-design/icons';

import './Check.less';
import { Operators, TYPES, Type } from './constants';
import {
  useChecks,
  useProjectsMap,
} from './context';

const { Option } = Select;

const defaultInputProps = {
  style: { width: 335 },
  size: "middle"
}

const CheckInput = ({ conditionId, check, projectName }) => {
  const projectsMap = useProjectsMap();
  const project = projectsMap[projectName];
  const {
    setValueString,
    setValueNumber,
    setValueTimestamp,
    setValueSet
  } = useChecks();
  const variable = project.variablesMap[check.variable];
  const variableType = variable ? variable.type : undefined;

  switch (variableType) {
    case Type.STRING:
      return <Input
        className={check.kind === undefined ? 'empty' : ''}
        {...defaultInputProps}
        allowClear
        value={check.value_string}
        onChange={(e) => setValueString(conditionId, check.id, e.target.value)}
      />;
    case Type.NUMBER:
      return <InputNumber
        className={check.kind === undefined ? 'empty' : ''}
        {...defaultInputProps}
        value={check.value_number}
        onChange={(value) => {
          setValueNumber(conditionId, check.id, value)
        }}
      />;
    case Type.TIMESTAMP:
      return <DatePicker
        {...defaultInputProps}
        defaultValue={check.value_timestamp}
        onChange={(date) => {
          setValueTimestamp(conditionId, check.id, date)
        }}
      />;
    case Type.SET:
      return <Input
        placeholder="coma separated values"
        className={check.kind === undefined ? 'empty' : ''}
        {...defaultInputProps}
        allowClear
        value={check.value_set}
        onChange={(e) => setValueSet(conditionId, check.id, e.target.value)}
      />;
  }
  return <Input
    style={{ width: 335 }}
    size="middle"
    disabled
  />;
}

export const Check = ({ conditionId, check, onDeleteCheck, projectName }) => {
  const projectsMap = useProjectsMap();
  const project = projectsMap[projectName];
  const { setVariable, setOperator } = useChecks();

  const onVariableOptionChange = (value) => {
    setVariable(conditionId, check.id, value);
  }
  const onOperatorOptionChange = (value) => {
    setOperator(conditionId, check.id, value);
  }

  const variable = project.variablesMap[check.variable];
  const variableType = variable ? variable.type : undefined;
  const operators = variableType ? TYPES[variableType].operators.map((op) => {
    return { id: op, title: Operators[op].title };
  }) : [];

  return (
    <Row style={{ marginBottom: 8 }}>
      <Col span={2}>
        <Button onClick={onDeleteCheck} type='dashed'>
          <MinusOutlined/>
        </Button>
      </Col>
      <Col span={12}>
        <Space>
          <Select
            className={check.variable === undefined ? 'empty' : ''}
            style={{ width: 170 }}
            placeholder="variable"
            value={check.variable}
            onChange={onVariableOptionChange}
          >
            {project.variables.map((variable) => (
              <Option key={variable.id}
                      value={variable.id}>{variable.name}</Option>
            ))}
          </Select>
          <Select
            className={check.operator === undefined ? 'empty' : ''}
            style={{ width: 170 }}
            placeholder="operator"
            value={check.operator}
            onChange={onOperatorOptionChange}
          >
            {operators.map(({ id, title }) => (
              <Option key={id} value={id}>{title}</Option>
            ))}
          </Select>
          <CheckInput conditionId={conditionId} check={check} projectName={projectName} />
        </Space>
      </Col>
    </Row>
  );
}
