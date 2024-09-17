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

import './Values.less';

import { CenteredSpinner } from '../components/Spinner';
import { ProjectsMapContext } from './context';
import { VALUES_QUERY } from './queries';
import { Value } from './Value';

const getShowAllMatches = (count, searchText) => ({
  label: `Show all matches(${count})`,
  value: searchText
});

const Values = ({ values, isSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const valueFromQuery = queryParams.get('value');

  const [searchOptions, setSearchOptions] = useState([]);
  const [searchSet, setSearchSet] = useState(null);
  const [selected, setSelected] = useState('');

  const setValueToUrl = (value) => {
    if (!value) {
        queryParams.delete('value');
    } else {
        queryParams.set('value', value);
    }
    navigate(`/?${queryParams.toString()}`);
  }

  useEffect(() => {
    if (valueFromQuery) {
      setSearchSet(new Set([valueFromQuery]));
      setSelected(valueFromQuery);
    }
  }, [valueFromQuery]);

  const valuesMap = useMemo(() => values.reduce((acc, value) => {
    acc[value.name] = value;
    return acc;
  }, {}), [values]);

  if (!values.length) {
    return <div>No values</div>;
  }

  const listData = values
    .filter((value) => {
      return selected ? searchSet.has(value.name) : true;
    })
    .map((value) => {
      return {
        title: value.name,
        key: value.name,
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

    const res = values
      .filter(({ name }) => fuzzysearch(
        searchText.toLowerCase(), name.toLowerCase()
      ))
      .map(({ name }) => ({ label: name, value: name }));

    setSearchOptions([getShowAllMatches(res.length, searchText)].concat(res));
    setSearchSet(new Set(res.map(({ value }) => value)));
  };

  const onSelect = (data) => {
    setSelected(data);
    setValueToUrl(data);
  };

  const onChange = (data) => {
    if (!data) {
      setSelected('');
      setSearchSet(null);
      setValueToUrl(null);
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
      {!isSearch && (
        <AutoComplete
          className='search-values'
          options={searchOptions}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          defaultValue={valueFromQuery ? valueFromQuery : null}
        >
          <Input
            prefix={<SearchOutlined/>}
            size="middle"
            allowClear
            placeholder="Filter values"
          />
        </AutoComplete>
      )}
      <List
        className="values-list"
        itemLayout="horizontal"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item>
            <Value value={valuesMap[item.key]} isSearch={isSearch} />
          </List.Item>
        )}
      />
    </div>
  );
};


export const ValuesContainer = ({ projectName, searchTerm, projectsMap }) => {
  const { data, loading, error, networkStatus } = useQuery(VALUES_QUERY, {
    variables: {
      project: searchTerm ? null : projectName,
      value_name: searchTerm,
    },
  });
  if (loading) {
    return <CenteredSpinner/>;
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
      <Values values={data.values} isSearch={searchTerm} />
    </ProjectsMapContext.Provider>
  );
}
