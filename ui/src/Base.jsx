import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Typography, Space, Button, Flex, Input } from 'antd';
const { Header } = Layout;
const { Link } = Typography;

import { Logo } from './components/Logo';
import { Version } from './components/Version';
import './Base.less';
import { useAuth, useSignOut } from './hooks';
import { CenteredSpinner } from './components/Spinner';
import { SearchOutlined } from "@ant-design/icons";


function Base({ children }) {
  const location = useLocation();
  const { auth, loading } = useAuth();
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
        position: 'relative',
      }}
    >
      <Header className='header'>
        <Flex gap="middle" direction='horizontal' justify='space-between'>
          <Typography.Title
            style={{
              color: "#fff",
              fontSize: "20px",
            }}
          >
            <Space align='center'>
              <Logo />
              <Link
                style={{ 'color': '#fff' }}
                className="title"
                href="/"
              >
                FeatureFlags
              </Link>
            </Space>
          </Typography.Title>
          <Space>
            {auth.authenticated && tab && (
              <Input
                ref={inputRef}
                prefix={<SearchOutlined />}
                value={inputValue || queryParams.get('term')}
                size="middle"
                allowClear
                placeholder={`${tab} global search`}
                onChange={handleSearchTermChange}
                onPressEnter={setSearchTermToUrl}
                style={{ width: '400px' }}
              />
            )}
            {auth.authenticated && <Button
              type="link"
              onClick={signOut}
            >Sign out</Button>}
          </Space>
        </Flex>
      </Header>
      {loading ? <CenteredSpinner /> : (
        <>
          {children}
          <Version />
        </>
      )}
    </Layout >
  )
}

export { Base };
