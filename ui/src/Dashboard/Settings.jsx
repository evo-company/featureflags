import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, message, Space, Typography, Modal, Card } from 'antd';
import { useMutation } from '@apollo/client';
import { DELETE_PROJECT_MUTATION } from "./queries";
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

export const SettingsContainer = ({ projectName, projectsMap }) => {
  const project = projectsMap[projectName];
  const navigate = useNavigate();

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    variables: { id: project.id },
    onCompleted: (data) => {
      if (data.deleteProject && data.deleteProject.error) {
        message.error(data.deleteProject.error);
      } else {
        message.success(`Project "${project.name}" removed successfully`);
        setTimeout(() => {
          navigate(`/`);
          window.location.reload();
        }, 2000);
      }
    },
    onError: (error) => {
      message.error(`Error removing project "${project.name}": ${error.message}`);
    }
  });

  const handleRemove = () => {
    deleteProject();
  };

  return (
    <View>
      <Card
        size="small"
        style={{ width: 800 }}
        title={<Typography.Text>Project settings</Typography.Text>}
      >
        <Space direction='vertical'>
          <DeleteButton
            projectName={projectName}
            onDelete={handleRemove}
          />
        </Space>
      </Card>
    </View>
  );
}
