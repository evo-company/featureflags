import { useState, useEffect } from 'react'
import fuzzysearch from 'fuzzysearch';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Layout,
  Menu,
  AutoComplete,
  Input,
} from 'antd';
import {
  SearchOutlined,
  GitlabOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;

import { useQuery } from "@apollo/client";

import './Dashboard.less';

import { Base } from '../Base';
import { CenteredSpinner } from '../components/Spinner';
import { FlagsContainer } from './Flags';

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


const scrollToProject = (project) => {
  const element = document.getElementById(project);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function Dashboard({ projects }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectFromQuery = queryParams.get('project');

  const [menuItems, setMenuItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);
  const [projectMap, setProjectMap] = useState({});

  const setProjectToUrl = (project) => {
    queryParams.set('project', project);
    navigate(`/?${queryParams.toString()}`);
  }

  useEffect(() => {
    if (projectFromQuery) {
      setSelected(projectFromQuery);
      scrollToProject(projectFromQuery);
    }
  }, [projectFromQuery]);

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
      .filter(({ name }) => fuzzysearch(
        searchText.toLowerCase(), name.toLowerCase()
      ))
      .map(({ name }) => ({ label: name, value: name }));
    setSearchOptions(res);
  };

  const onSelect = (data) => {
    setSelected(data);
    setProjectToUrl(data);
    if (data) {
      scrollToProject(data);
    }
  };

  return (
    <Base>
      <Layout className="site-layout">
        <Sider
          className='sidebar'
          width={300}
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
          <br/>
          <br/>
          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            onSelect={({ key }) => {
              setSelected(key);
              setProjectToUrl(key);
            }}
            selectedKeys={[selected]}
          />
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

  const projects = data.projects.sort((a, b) => a.name.localeCompare(b.name));
  return <Dashboard projects={projects} />;
}

export { DashboardContainer as Dashboard };
