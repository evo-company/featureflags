import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import './Tabs.less';

const { TabPane } = Tabs;

const HeaderTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get('tab') || 'flags';
  const project = searchParams.get('project');
  const searchTerm = searchParams.get('term');

  const onTabChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', key);
    setSearchParams(newParams);
  };

  return (
    <Tabs
      activeKey={tab}
      tabPosition="top"
      onChange={onTabChange}
      className="custom-tabs"
      tabBarStyle={{ borderBottom: 'none'}}
    >
      <TabPane tab={<span>Flags</span>} key="flags" />
      <TabPane tab={<span>Values</span>} key="values" />
      {project && !searchTerm && (
        <TabPane tab={<span><SettingOutlined />Settings</span>} key="settings"/>
      )}
    </Tabs>
  );
}

export { HeaderTabs };
