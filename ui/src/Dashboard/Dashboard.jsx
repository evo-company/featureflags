import { useState, useEffect } from 'react'
import {
  Layout,
  Menu,
  Space,
  AutoComplete,
  Input,
} from 'antd';
import {
  SearchOutlined,
  GitlabOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;

import {
  useQuery,
  gql
} from "@apollo/client";

import { Base } from '../Base';
import { CenteredSpinner } from '../components/Spinner';
import { FlagsContainer } from './Flags';

import './Dashboard.less';
import { PROJECTS_QUERY } from './queries';


function menuItem(label, key, icon, children) {
  return {
    id: key,
    key,
    icon,
    children,
    label,
  };
}


function Dashboard({ projects }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);
  const [projectMap, setProjectMap] = useState({});

  useEffect(() => {
    const items = projects.map((project) => {
      return menuItem(project.name, project.name, <GitlabOutlined/>);
    });
    setMenuItems(items);

    const _projectsMap = projects.reduce((acc, project) => {
      acc[project.name] = project;
      return acc;
    }, {});

    setProjectMap(_projectsMap);
  }, [projects]);

  const onSearch = (searchText) => {
    if (!searchText) {
      setSearchOptions([]);
      return
    }
    ;

    const res = projects
      .filter(({ name }) => name.includes(searchText))
      .map(({ name }) => ({ label: name, value: name }));
    setSearchOptions(res);
  };

  const onSelect = (data) => {
    setSelected(data);
    // scroll to channel menu item
    window.location.href = `/#${data}`;
  };

  return (
    <Base>
      <Layout className="site-layout">
        <Sider
          className='sidebar'
          width={300}
        >
          <Space
            style={{ 'width': '100%' }}
            size={'middle'}
            direction="vertical"
          >
            <AutoComplete
              className='search'
              options={searchOptions}
              onSelect={onSelect}
              onSearch={onSearch}
            >
              <Input
                prefix={<SearchOutlined/>}
                size="middle"
                allowClear
                placeholder="Filter projects"
              />
            </AutoComplete>
            <Menu
              theme="dark"
              mode="inline"
              items={menuItems}
              onSelect={({ key }) => setSelected(key)}
              selectedKeys={[selected]}
            />
          </Space>
        </Sider>
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
            {!!selected ? <FlagsContainer project={projectMap[selected]}/> :
              <div>No flags</div>}
          </div>
        </Content>
      </Layout>
    </Base>
  )
}


const DashboardContainer = () => {
  const { data, loading } = useQuery(PROJECTS_QUERY, {
    fetchPolicy: 'network-only',
  });
  if (loading) {
    return <CenteredSpinner/>;
  }

  return <Dashboard projects={data.projects}/>;
}

export { DashboardContainer as Dashboard };
