import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Typography, Space, Button, Row, Col, Input } from 'antd';
const { Header } = Layout;
const { Link } = Typography;

import { Logo } from './components/Logo';
import './Base.less';
import { useAuth, useSignOut } from './hooks';
import { CenteredSpinner } from './components/Spinner';
import { SearchOutlined } from "@ant-design/icons";


function Base({ children }) {
  const location = useLocation();
  const {auth, loading} = useAuth();
  const [signOut] = useSignOut();
  const [inputValue, setInputValue] = useState('');

  if (!loading && !auth.authenticated && location.pathname !== '/sign-in') {
    return <Navigate to='sign-in' replace />
  }

  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab') === 'values' ? 'values' : 'flags';

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === '') {
      queryParams.delete('term');
      navigate(`/?${queryParams.toString()}`);
    }
  };

  const setSearchTermToUrl = (e) => {
    const value = e.target.value;
    queryParams.set('term', value);
    queryParams.set('tab', tab);
    navigate(`/?${queryParams.toString()}`);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/') {
        event.preventDefault();
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            <Col span={4} offset={9}>
              {tab && (
                <Input
                  ref={inputRef}
                  prefix={<SearchOutlined/>}
                  value={inputValue || queryParams.get('term')}
                  size="middle"
                  allowClear
                  placeholder={`${tab} global search`}
                  onChange={handleSearchTermChange}
                  onPressEnter={setSearchTermToUrl}
                />
              )}
            </Col>
            <Col span={4}>
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
