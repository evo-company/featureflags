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

  let tabs = [
    { key: 'flags', title: 'Flags' },
    { key: 'values', title: 'Values' },
  ];

  if (project && !searchTerm) {
    tabs.push({ key: 'settings', title: 'Settings' });
  }

  return (
    <Tabs
      activeKey={tab}
      tabPosition="top"
      onChange={onTabChange}
      className="custom-tabs"
      items={tabs}
    />
  );
}

export { HeaderTabs };
