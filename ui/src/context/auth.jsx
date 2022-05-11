import { createContext, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// {auth, loading, actions}
export const AuthContext = createContext({});

const AUTH_QUERY = gql`
  query Auth {
    authenticated
  }
`;

const SIGN_IN_MUTATION = gql`
  mutation SignIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
        error
    }
  }
`;

const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut {
        error
    }
  }
`;


export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState(null);
  const { data, loading, refetch } = useQuery(AUTH_QUERY);
  const [signInMutation, signInInfo] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: (data) => {
      if (!!data.signIn.error) {
        setSignInError(data.signIn.error);
        return;
      }
      refetch().then(() => {
        navigate('/');
      });
    }
  });
  const [signOutMutation, signOutInfo] = useMutation(SIGN_OUT_MUTATION, {
    onCompleted: () => {
      navigate('/sign-in');
    }
  });
  const authenticated = loading ? false : data.authenticated;

  const auth = {
    authenticated,
  };

  const actions = {
    signIn: [
      (username, password) => {
        setSignInError(null);
        signInMutation({ variables: { username, password } });
      },
      signInError || signInInfo.error,
    ],
    signOut: [
      () => {
        signOutMutation();
      },
      signOutInfo.error
    ]
  }
  return (
      <AuthContext.Provider value={{auth, loading, actions}}>
        {children}
      </AuthContext.Provider>
  );
}
