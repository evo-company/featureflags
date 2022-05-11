import { Layout, Typography, Input, Button, Form } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

import { Base } from './Base';
import { useSignIn } from './hooks';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';


const AuthForm = () => {
  const [signIn, error] = useSignIn();
  const onFinish = ({ username, password }) => {
    signIn(username, password);
  };

  return (
    <Form
      name="auth"
      layout="vertical"
      initialValues={{
        username: '',
        password: '',
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input
          placeholder="Username"
          style={{ borderRadius: '5px' }}
          prefix={<UserOutlined />}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password
          placeholder='Password'
          style={{ borderRadius: '5px' }}
          prefix={<LockOutlined />}
        />
      </Form.Item>

      <Form.Item>
        <Button
          style={{
            width: '150px',
            borderRadius: '5px',
          }}
          type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </Form>
  )
}

function Auth() {
  const [_, error] = useSignIn();
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (error) {
      setInvalid(true);
      setTimeout(() => {
        setInvalid(false);
      }, 500);
    }
  }, [error]);

  return (
    <Base>
        <Layout className="site-layout">
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <div style={{ padding: '0 20px 0 20px', textAlign: 'center' }}>
                <Title level={2}>
                    Sign in to FeatureFlags
                </Title>
              </div>
              <div
                className={invalid ? 'invalid' : ''}
                style={{
                  padding: '40px 20px 20px 20px',
                  background: '#eaeaea',
                  borderRadius: '10px',
                  margin: '0 auto',
                  width: '400px'
                }}
              >
                  <AuthForm />
              </div>
            </div>
          </Content>
        </Layout>
    </Base>
  )
}

export { Auth };
