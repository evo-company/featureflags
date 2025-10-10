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

import './Conditions.less';
import {
  useChecks,
  useConditions,
  useFlagCtx,
  useFlagState,
} from './context';
import { Check } from './Check';


const Condition = ({ onRemove, condition, projectName }) => {
  const { addCheck, deleteCheck } = useFlagCtx();
  const { checks } = useChecks();

  return (
    <div className='condition-block'>
      {condition.checks.map((checkId, idx) => {
        return (
          <Check
            // using idx as key because checkId is not unique and changes when condition/check is touched
            key={idx}
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

export const Conditions = () => {
  const flagState = useFlagState();
  const conditions = useConditions();
  const { addCondition, deleteCondition } = useFlagCtx();

  const noConditions = flagState.conditions.length === 0;

  return (
    <Row>
      <Col style={{ width: '100%' }}>
        {flagState.conditions.map((conditionId, idx) => {
          return (
            <Condition
              // using idx as key because conditionId is not unique and changes when condition/check is touched
              key={idx}
              condition={conditions[conditionId]}
              onRemove={() => deleteCondition(conditions[conditionId])}
              projectName={flagState.projectName}
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
