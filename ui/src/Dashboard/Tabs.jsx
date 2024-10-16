import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

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
    { key: 'flags', label: 'Flags' },
    { key: 'values', label: 'Values' },
  ];

  if (project && !searchTerm) {
    tabs.push({ key: 'settings', label: 'Settings', icon: <SettingOutlined /> });
  }

  return (
    <Tabs
      activeKey={tab}
      tabPosition="top"
      onChange={onTabChange}
      items={tabs}
    />
  );
}

export { HeaderTabs };
