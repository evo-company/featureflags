import {
  Button,
  Col,
  Row,
  Space,
  Input,
} from 'antd';
import {
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import './ValueConditions.less';
import {
  useValueChecks,
  useValueConditions,
  useValueCtx,
  useValueState,
} from './context';
import { ValueCheck } from './ValueCheck';


const ValueCondition = ({ onRemove, condition, onValueConditionOverrideChange, projectName }) => {
  const { addCheck, deleteCheck } = useValueCtx();
  const { checks } = useValueChecks();

  return (
    <div className='condition-block'>
      <Row className='value-condition-override'>
      <Input
          value={condition.value_override}
          size="middle"
          onChange={onValueConditionOverrideChange}
          placeholder="value override"
      />
      </Row>
      {condition.checks.map((checkId, idx) => {
        return (
          <ValueCheck
            key={idx}
            // using idx as key because checkId is not unique and changes when condition/check is touched
            conditionId={condition.id}
            check={checks[checkId]}
            onDeleteCheck={() => deleteCheck(condition.id, checkId)}
            projectName={projectName}
          />
        )
      })}
      <Row>
        <Col span={2}>
          <Space>
            <Button onClick={() => addCheck(condition.id)} type='dashed'>
              <PlusOutlined />
              and
            </Button>
            <Button onClick={onRemove} type='dashed'>
              <CloseOutlined />
              del
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export const ValueConditions = () => {
  const value = useValueState();
  const conditions = useValueConditions();
  const { addCondition, deleteCondition, updateValueConditionOverride } = useValueCtx();

  const noConditions = value.conditions.length === 0;

  return (
    <Row>
      <Col style={{ width: '100%' }}>
        {value.conditions.map((conditionId, idx) => {
          return (
            <ValueCondition
              key={idx}
              // using idx as key because conditionId is not unique and changes when condition/check is touched
              condition={conditions[conditionId]}
              onRemove={() => deleteCondition(conditions[conditionId])}
              onValueConditionOverrideChange={(e) => updateValueConditionOverride(conditionId, e.target.value)}
              projectName={value.projectName}
            />
          )
        })}
        <Button onClick={addCondition} type="dashed" style={{ width: '100%' }}>
          {noConditions
            ? 'add condition'
            : <span><PlusOutlined /> or</span>}
        </Button>
      </Col>
    </Row>
  );
}
