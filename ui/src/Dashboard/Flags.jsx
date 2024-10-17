import fuzzysearch from 'fuzzysearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import {
  AutoComplete,
  List,
  Input,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';

import './Flags.less';

import { CenteredSpinner } from '../components/Spinner';
import { ProjectsMapContext } from './context';
import { FLAGS_QUERY } from './queries';
import { Flag } from './Flag';
import { HeaderTabs } from "./Tabs";

const getShowAllMatches = (count, searchText) => ({
  label: `Show all matches(${count})`,
  value: searchText
});

function getFlagKey(flag) {
  return `${flag.name}_${flag.project.name}`
}

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


const Flags = ({ flags, isSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const flagFromQuery = queryParams.get('flag');

  const [searchOptions, setSearchOptions] = useState([]);
  const [searchSet, setSearchSet] = useState(null);
  const [selected, setSelected] = useState('');

  const setFlagToUrl = (flag) => {
    if (!flag) {
      queryParams.delete('flag');
    } else {
      queryParams.set('flag', flag);
    }
    navigate(`/?${queryParams.toString()}`);
  }

  useEffect(() => {
    if (flagFromQuery) {
      setSearchSet(new Set([flagFromQuery]));
      setSelected(flagFromQuery);
    }
  }, [flagFromQuery]);

  const flagsMap = useMemo(() => flags.reduce((acc, flag) => {
    acc[getFlagKey(flag)] = flag;
    return acc;
  }, {}), [flags]);

  if (!flags.length) {
    return <View>
      <Typography.Text style={{ color: "#7D7D91" }}>
        No flags
      </Typography.Text>
    </View>;
  }

  const listData = flags
    .filter((flag) => {
      return selected ? searchSet.has(flag.name) : true;
    })
    .map((flag) => {
      return {
        title: flag.name,
        key: getFlagKey(flag),
      };
    });

  /**
   * filter autocomplete options
   */
  const onSearch = (searchText) => {
    if (!searchText) {
      setSearchOptions([]);
      return
    };

    const res = flags
      .filter(({ name }) => fuzzysearch(
        searchText.toLowerCase(), name.toLowerCase()
      ))
      .map(({ name }) => ({ label: name, value: name }));

    setSearchOptions([getShowAllMatches(res.length, searchText)].concat(res));
    setSearchSet(new Set(res.map(({ value }) => value)));
  };

  const onSelect = (data) => {
    setSelected(data);
    setFlagToUrl(data);
  };

  const onChange = (data) => {
    if (!data) {
      setSelected('');
      setSearchSet(null);
      setFlagToUrl(null);
    }
  }

  return (
    <View>
      {!isSearch && (
        <AutoComplete
          className='search-flags'
          options={searchOptions}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          defaultValue={flagFromQuery ? flagFromQuery : null}
        >
          <Input
            prefix={<SearchOutlined />}
            size="middle"
            allowClear
            placeholder="Filter flags"
          />
        </AutoComplete>
      )}
      <List
        style={{
          paddingTop: isSearch ? '0' : '35px'
        }}
        itemLayout="horizontal"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item>
            <Flag flag={flagsMap[item.key]} isSearch={isSearch} />
          </List.Item>
        )}
      />
    </View>
  );
};


export const FlagsContainer = ({ projectName, searchTerm, projectsMap }) => {
  const { data, loading, error, networkStatus } = useQuery(FLAGS_QUERY, {
    variables: {
      project: searchTerm ? null : projectName,
      flag_name: searchTerm,
    },
  });
  if (loading) {
    return <CenteredSpinner />;
  }

  const _projectsMap = Object.keys(projectsMap).reduce((acc, key) => {
    const _project = projectsMap[key];
    acc[key] = {
      ..._project,
      variablesMap: _project.variables.reduce((variableAcc, variable) => {
        variableAcc[variable.id] = variable;
        return variableAcc;
      }, {}),
    };
    return acc;
  }, {});

  return (
    <ProjectsMapContext.Provider value={[_projectsMap]}>
      <Flags flags={data.flags} isSearch={searchTerm} />
    </ProjectsMapContext.Provider>
  );
}
