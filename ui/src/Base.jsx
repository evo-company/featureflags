import { Navigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Space, Button, Row, Col } from 'antd';
const { Header } = Layout;
const { Link } = Typography;

import { Logo } from './components/Logo';
import './Base.less';
import { useAuth, useSignOut } from './hooks';
import { CenteredSpinner } from './components/Spinner';


function Base({ children }) {
  const location = useLocation();
  const {auth, loading} = useAuth();
  const [signOut] = useSignOut();

  if (!loading && !auth.authenticated && location.pathname !== '/sign-in') {
    return <Navigate to='sign-in' replace />
  }

  return (
    <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Header className='header'>
          <Row>
            <Col span={4}>
              <Space align='baseline'>
                <Logo/>
                <Link
                  style={{ 'color': '#fff' }}
                  className="title"
                  href="/"
                >
                  FeatureFlags
                </Link>

              </Space>
            </Col>
            <Col span={1} offset={19}>
              {auth.authenticated && <Button
                  type="link"
                  onClick={signOut}
                >Sign out</Button>}
            </Col>
          </Row>
        </Header>
      {loading ? <CenteredSpinner /> : children}
    </Layout>
  )
}

export { Base };
