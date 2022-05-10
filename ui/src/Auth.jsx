import { Layout, Typography, Input, Button, Form } from 'antd';
const { Content } = Layout;
const { Title } = Typography;

import { Base } from './Base';
import { useSignIn } from './hooks';


const AuthForm = () => {
  const [signIn, error] = useSignIn();
  const onFinish = ({ username, password }) => {
    signIn(username, password);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 4,
      }}
      initialValues={{
        username: '',
        password: '',
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 10,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        {error && <div style={{color: 'red'}}>{error}</div>}
      </Form.Item>
    </Form>
  )
}

function Auth() {
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
                <Title>
                    Sign in to FeatureFlags
                </Title>
              </div>
            <AuthForm />
            </div>
          </Content>
        </Layout>
    </Base>
  )
}

export { Auth };
