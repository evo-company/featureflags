import fuzzysearch from 'fuzzysearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import {
  AutoComplete,
  Input,
  List,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';

import './Flags.less';

import { CenteredSpinner } from '../components/Spinner';
import { ProjectContext } from './context';
import { FLAGS_QUERY } from './queries';
import { Flag } from './Flag';

const getShowAllMatches = (count, searchText) => ({
  label: `Show all matches(${count})`,
  value: searchText
});

const Flags = ({ flags }) => {
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
    acc[flag.name] = flag;
    return acc;
  }, {}), [flags]);

  if (!flags.length) {
    return <div>No flags</div>;
  }

  const listData = flags
    .filter((flag) => {
      return selected ? searchSet.has(flag.name) : true;
    })
    .map((flag) => {
      return {
        title: flag.name,
        key: flag.name,
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
    <div
      style={{
        height: '90vh',
        overflow: 'auto',
        padding: '0 16px',
      }}
    >
      <AutoComplete
        className='search-flags'
        options={searchOptions}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        defaultValue={flagFromQuery ? flagFromQuery : null}
      >
        <Input
          prefix={<SearchOutlined/>}
          size="middle"
          allowClear
          placeholder="Filter flags"
        />
      </AutoComplete>
      <List
        className="flags-list"
        itemLayout="horizontal"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item>
            <Flag flag={flagsMap[item.key]}/>
          </List.Item>
        )}
      />
    </div>
  );
};


export const FlagsContainer = ({ project }) => {
  const { data, loading, error, networkStatus } = useQuery(FLAGS_QUERY, {
    variables: { project: project.name },
  });
  if (loading) {
    return <CenteredSpinner/>;
  }

  const _project = {
    ...project,
    variablesMap: project.variables.reduce((acc, variable) => {
      acc[variable.id] = variable;
      return acc;
    }, {}),
  }
  return (
    <ProjectContext.Provider value={[_project]}>
      <Flags project={project} flags={data.flags}/>
    </ProjectContext.Provider>
  );
}
