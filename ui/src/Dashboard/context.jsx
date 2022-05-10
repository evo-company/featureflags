import { createContext, useContext } from 'react';

export const ProjectContext = createContext([[]]);

export const useProject = () => {
  const [project] = useContext(ProjectContext);
  return project;
}


export const FlagContext = createContext({});
export const useFlagState = () => {
  const { state } = useContext(FlagContext);
  return state;
}
export const useFlagCtx = () => useContext(FlagContext);
export const useConditions = () => {
  const { conditions } = useContext(FlagContext);
  return conditions;
}
export const useChecks = () => {
  const {
    checks, setVariable, setOperator,
    setValueString, setValueNumber, setValueTimestamp, setValueSet
  } = useContext(FlagContext);
  return {
    checks, setVariable, setOperator,
    setValueString, setValueNumber, setValueTimestamp, setValueSet
  };
}
