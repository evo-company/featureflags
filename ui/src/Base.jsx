import {Navigate, useLocation, useNavigate} from 'react-router-dom';
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

  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const setTabToUrl = (name) => {
    queryParams.set('tab', name);
    navigate(`/?${queryParams.toString()}`);
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
            <Col span={6} offset={14}>
              <Button
                  type="link"
                  onClick={() => setTabToUrl("flags")}
              >Flags</Button>
              <Button
                  type="link"
                  onClick={() => setTabToUrl("values")}
              >Values</Button>
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
