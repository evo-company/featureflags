import { useContext } from 'react';
import { AuthContext } from './context/auth';

export const useAuth = () => {
  return useContext(AuthContext)
}

export const useSignIn = () => {
  const {actions} = useContext(AuthContext)
  return actions.signIn;
}

export const useSignOut = () => {
  const {actions} = useContext(AuthContext)
  return actions.signOut;
}
