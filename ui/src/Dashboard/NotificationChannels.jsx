import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';

import { Base } from '../Base';
import { CenteredSpinner } from '../components/Spinner';
import {
  DELETE_NOTIFICATION_CHANNEL_MUTATION,
  NOTIFICATION_CHANNELS_QUERY,
  SAVE_NOTIFICATION_CHANNEL_MUTATION,
} from './queries';


const ChannelFormModal = ({ open, channel, onClose, onSaved }) => {
  const [form] = Form.useForm();

  const [saveChannel, { loading }] = useMutation(
    SAVE_NOTIFICATION_CHANNEL_MUTATION,
    {
      refetchQueries: [{ query: NOTIFICATION_CHANNELS_QUERY }],
      onCompleted: (data) => {
        if (data.saveNotificationChannel.error) {
          message.error(data.saveNotificationChannel.error);
        } else {
          message.success('Channel saved');
          onSaved();
        }
      },
      onError: (error) => message.error(`Error saving channel: ${error.message}`),
    },
  );

  const handleOk = () => {
    form.validateFields().then((values) => {
      saveChannel({
        variables: {
          id: channel ? channel.id : null,
          name: values.name,
          webhook_url: values.webhook_url,
        },
      });
    });
  };

  return (
    <Modal
      title={channel ? 'Edit notification channel' : 'Add notification channel'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          name: channel?.name,
          webhook_url: channel?.webhook_url,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="e.g. team-alerts" />
        </Form.Item>
        <Form.Item
          name="webhook_url"
          label="Slack webhook URL"
          rules={[
            { required: true, message: 'Webhook URL is required' },
            {
              pattern: /^https?:\/\/.+/,
              message: 'Must be an http(s) URL',
            },
          ]}
        >
          <Input placeholder="https://hooks.slack.com/services/..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};


const NotificationChannels = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(NOTIFICATION_CHANNELS_QUERY, {
    fetchPolicy: 'network-only',
  });
  const [modalChannel, setModalChannel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [deleteChannel] = useMutation(DELETE_NOTIFICATION_CHANNEL_MUTATION, {
    refetchQueries: [{ query: NOTIFICATION_CHANNELS_QUERY }],
    onCompleted: (data) => {
      if (data.deleteNotificationChannel.error) {
        message.error(data.deleteNotificationChannel.error);
      } else {
        message.success('Channel removed');
      }
    },
    onError: (error) => message.error(`Error removing channel: ${error.message}`),
  });

  if (loading) {
    return <CenteredSpinner />;
  }

  if (error || !data) {
    return (
      <Base>
        <div style={{ padding: '16px 24px' }}>
          <Typography.Text type="danger">
            Failed to load notification channels.
          </Typography.Text>
        </div>
      </Base>
    );
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Webhook URL',
      dataIndex: 'webhook_url',
      key: 'webhook_url',
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, channel) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setModalChannel(channel);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title={`Delete channel "${channel.name}"?`}
            onConfirm={() => deleteChannel({ variables: { id: channel.id } })}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Base>
      <div style={{ padding: '16px 24px' }}>
        <Space direction="vertical" size="middle" style={{ width: 800 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ paddingLeft: 0 }}
          >
            Back to projects
          </Button>
          <Card
            size="small"
            title={<Typography.Text>Notification channels</Typography.Text>}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalChannel(null);
                  setModalOpen(true);
                }}
              >
                Add channel
              </Button>
            }
          >
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={data.notificationChannels}
              pagination={false}
            />
          </Card>
        </Space>
        <ChannelFormModal
          open={modalOpen}
          channel={modalChannel}
          onClose={() => setModalOpen(false)}
          onSaved={() => setModalOpen(false)}
        />
      </div>
    </Base>
  );
};

export { NotificationChannels };
