import { Button, message, List, Divider } from 'antd';
import { useMutation } from '@apollo/client';
import { DELETE_PROJECT_MUTATION } from "./queries";
import { HeaderTabs } from "./Tabs";
import { useNavigate } from "react-router-dom";

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
      if (window.confirm(`Are you sure you want to delete the "${project.name}" project?`)) {
        deleteProject();
      }
    };

    const data = [
        <div>Delete project <Button onClick={handleRemove}>DELETE PROJECT</Button></div>
    ];

    return (
        <div
          style={{
            height: '90vh',
            overflow: 'auto',
            padding: '0 16px',
          }}
        >
            <HeaderTabs />
            <div>
                <Divider orientation="left">Project `{projectName}` settings</Divider>
                <List
                  bordered
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      {item}
                    </List.Item>
                  )}
                />
            </div>
        </div>
    );
}
