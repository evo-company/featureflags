import {
  Button,
  Col,
  Row,
  Space,
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


const ValueCondition = ({ onRemove, condition, onValueConditionOverrideChange }) => {
  const { addCheck, deleteCheck } = useValueCtx();
  const { checks } = useValueChecks();

  return (
    <div className='condition-block'>
      {condition.checks.map((checkId) => {
        return (
          <ValueCheck
            key={checkId}
            conditionId={condition.id}
            check={checks[checkId]}
            onDeleteCheck={() => deleteCheck(condition.id, checkId)}
            conditionValueOverride={condition.value_override}
            onValueConditionOverrideChange={onValueConditionOverrideChange}
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
      <Col>
        {value.conditions.map((conditionId) => {
          return (
            <ValueCondition
              key={conditionId}
              condition={conditions[conditionId]}
              onRemove={() => deleteCondition(conditions[conditionId])}
              onValueConditionOverrideChange={(e) => updateValueConditionOverride(conditionId, e.target.value)}
            />
          )
        })}
        <Button onClick={addCondition} type="dashed" style={{ width: 780 }}>
            {noConditions
              ? 'add condition'
              : <span><PlusOutlined /> or</span>}
        </Button>
      </Col>
    </Row>
  );
}
