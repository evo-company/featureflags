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
      {condition.checks.map((checkId) => {
        return (
          <Check
            key={checkId}
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
  const flag = useFlagState();
  const conditions = useConditions();
  const { addCondition, deleteCondition } = useFlagCtx();

  const noConditions = flag.conditions.length === 0;

  return (
    <Row>
      <Col>
        {flag.conditions.map((conditionId) => {
          return (
            <Condition
              key={conditionId}
              condition={conditions[conditionId]}
              onRemove={() => deleteCondition(conditions[conditionId])}
              projectName={flag.projectName}
            />
          )
        })}
        <Button onClick={addCondition} type="dashed" style={{ width: 775 }}>
          {noConditions
            ? 'add condition'
            : <span><PlusOutlined /> or</span>}
        </Button>
      </Col>
    </Row>
  );
}
