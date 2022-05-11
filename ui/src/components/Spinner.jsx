import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Centered = ({ children }) => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      {children}
    </div>
  )
}

export const CenteredSpinner = () => <Centered><Spin indicator={antIcon} /></Centered>;
