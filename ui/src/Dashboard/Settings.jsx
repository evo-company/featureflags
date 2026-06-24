import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, message, Space, Typography, Modal, Card, Select, Divider } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_PROJECT_MUTATION,
  NOTIFICATION_CHANNELS_QUERY,
  PROJECTS_QUERY,
  SET_PROJECT_NOTIFICATION_CHANNELS_MUTATION,
} from "./queries";
import { HeaderTabs } from "./Tabs";


const View = ({ children }) => {
  return (
    <div
      style={{
        height: '90vh',
        overflow: 'auto',
        padding: '0 16px',
      }}
    >
      <HeaderTabs />
      {children}
    </div>
  );
};


const DeleteButton = ({ projectName, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOk = () => {
    onDelete();
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        style={{ width: "110px" }}
        onClick={() => setModalOpen(true)}
        danger
      >
        Delete project
      </Button>
      <Modal
        centered
        width={300}
        title="Delete project confirmation"
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleClose}
        okText="Yes"
        cancelText="No"
      >
        Are you sure you want to delete project
        <Typography.Text strong>{projectName}</Typography.Text>?
      </Modal>
    </>
  );
};

const NotificationChannelsSelect = ({ project }) => {
  const { data, loading } = useQuery(NOTIFICATION_CHANNELS_QUERY);
  const [selected, setSelected] = useState(
    (project.notificationChannels || []).map((channel) => channel.id)
  );

  const [setChannels] = useMutation(
    SET_PROJECT_NOTIFICATION_CHANNELS_MUTATION,
    {
      refetchQueries: [{ query: PROJECTS_QUERY }],
      onCompleted: (data) => {
        if (data.setProjectNotificationChannels.error) {
          message.error(data.setProjectNotificationChannels.error);
        } else {
          message.success('Notification channels updated');
        }
      },
      onError: (error) => {
        message.error(`Error updating channels: ${error.message}`);
      },
    },
  );

  const onChange = (channelIds) => {
    setSelected(channelIds);
    setChannels({
      variables: { project_id: project.id, channel_ids: channelIds },
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography.Text strong>Slack notification channels</Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Flag and value changes in this project are posted to the selected
        channels. Channels are managed on the settings page.
      </Typography.Text>
      <Select
        mode="multiple"
        style={{ width: '100%', marginTop: 8 }}
        placeholder="No notification channels"
        loading={loading}
        value={selected}
        onChange={onChange}
        options={(data?.notificationChannels || []).map((channel) => ({
          label: channel.name,
          value: channel.id,
        }))}
      />
    </div>
  );
};

export const SettingsContainer = ({ projectName, projectsMap }) => {
  const project = projectsMap[projectName];
  const navigate = useNavigate();

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    variables: { id: project?.id },
    refetchQueries: [{ query: PROJECTS_QUERY }],
    onCompleted: (data) => {
      if (data.deleteProject && data.deleteProject.error) {
        message.error(data.deleteProject.error);
      } else {
        message.success(`Project "${projectName}" removed successfully`);
        navigate(`/`);
      }
    },
    onError: (error) => {
      message.error(`Error removing project "${projectName}": ${error.message}`);
    }
  });

  const handleRemove = () => {
    deleteProject();
  };

  if (!project) {
    return null;
  }

  return (
    <View>
      <Card
        size="small"
        style={{ width: 800 }}
        title={<Typography.Text>Project settings</Typography.Text>}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <NotificationChannelsSelect project={project} />
          <Divider style={{ margin: '12px 0' }} />
          <DeleteButton
            projectName={projectName}
            onDelete={handleRemove}
          />
        </Space>
      </Card>
    </View>
  );
}
