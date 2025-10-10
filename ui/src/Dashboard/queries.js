import { gql } from '@apollo/client';

export const VERSION_QUERY = gql`
  query Version {
    version {
      serverVersion
      buildVersion
    }
  }
`;

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      variables {
        id
        name
        type
      }
    }
  }
`;

const FLAG_FRAGMENT = gql`
  fragment FlagFragment on Flag {
    id
    name
    enabled
    overridden
    created_timestamp
    reported_timestamp
    project {
      name
    }
    conditions {
      id
      position
      checks {
        id
        variable {
          id
          name
          type
        }
        operator
        value_string
        value_number
        value_timestamp
        value_set
      }
    }
  }
`;


export const SAVE_FLAG_MUTATION = gql`
  mutation SaveFlag($operations: [SaveFlagOperation!]!) {
    saveFlag(operations: $operations) {
      errors
    }
  }
`;

export const RESET_FLAG_MUTATION = gql`
  mutation ResetFlag($id: String!) {
    resetFlag(id: $id) {
      error

    }
  }
`;

export const DELETE_FLAG_MUTATION = gql`
  mutation DeleteFlag($id: String!) {
    deleteFlag(id: $id) {
      error
    }
  }
`;

export const FLAG_QUERY = gql`
  ${FLAG_FRAGMENT}
  query Flag($id: String!) {
    flag(id: $id) {
      ...FlagFragment
    }
  }
`;

export const FLAGS_QUERY = gql`
  ${FLAG_FRAGMENT}
  query Flags($project: String, $flag_name: String) {
    flags(project_name: $project, flag_name: $flag_name) {
      ...FlagFragment
    }
  }
`;

export const FLAG_HISTORY_QUERY = gql`
  query FlagHistory($id: String!) {
    flag(id: $id) {
      changes {
        timestamp
        actions
        user {
          id
          username
        }
      }
    }
  }
`;

const VALUE_FRAGMENT = gql`
  fragment ValueFragment on Value {
    id
    name
    enabled
    overridden
    value_default
    value_override
    created_timestamp
    reported_timestamp
    project {
      name
    }
    conditions {
      id
      position
      value_override
      checks {
        id
        variable {
          id
          name
          type
        }
        operator
        value_string
        value_number
        value_timestamp
        value_set
      }
    }
  }
`;


export const SAVE_VALUE_MUTATION = gql`
  mutation SaveValue($operations: [SaveValueOperation!]!) {
    saveValue(operations: $operations) {
      errors
    }
  }
`;

export const RESET_VALUE_MUTATION = gql`
  mutation ResetValue($id: String!) {
    resetValue(id: $id) {
      error
    }
  }
`;

export const DELETE_VALUE_MUTATION = gql`
  mutation DeleteValue($id: String!) {
    deleteValue(id: $id) {
      error
    }
  }
`;

export const DELETE_VARIABLE_MUTATION = gql`
  mutation DeleteVariable($id: String!) {
    deleteVariable(id: $id) {
      error
    }
  }
`;

export const VALUE_QUERY = gql`
  ${VALUE_FRAGMENT}
  query Value($id: String!) {
    value(id: $id) {
      ...ValueFragment
    }
  }
`;

export const VALUES_QUERY = gql`
  ${VALUE_FRAGMENT}
  query Values($project: String, $value_name: String) {
    values(project_name: $project, value_name: $value_name) {
      ...ValueFragment
    }
  }
`;

export const VALUE_HISTORY_QUERY = gql`
  query ValueHistory($id: String!) {
    value(id: $id) {
      changes {
        timestamp
        actions
        user {
          id
          username
        }
      }
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      error
    }
  }
`;
