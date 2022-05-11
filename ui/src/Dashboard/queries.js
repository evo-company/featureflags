import { gql } from '@apollo/client';

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
    conditions {
      id
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
  query Flags($project: String!) {
    flags(project_name: $project) {
      ...FlagFragment
    }
  }
`;
