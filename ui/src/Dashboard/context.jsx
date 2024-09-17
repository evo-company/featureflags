import { createContext, useContext } from 'react';

export const ProjectsMapContext = createContext([[]]);

export const useProjectsMap = () => {
  const [project] = useContext(ProjectsMapContext);
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

export const ValueContext = createContext({});
export const useValueState = () => {
  const { state } = useContext(ValueContext);
  return state;
}
export const useValueCtx = () => useContext(ValueContext);
export const useValueConditions = () => {
  const { conditions } = useContext(ValueContext);
  return conditions;
}
export const useValueChecks = () => {
  const {
    checks, setVariable, setOperator, setValueString, setValueNumber,
    setValueTimestamp, setValueSet
  } = useContext(ValueContext);
  return {
    checks, setVariable, setOperator, setValueString, setValueNumber,
    setValueTimestamp, setValueSet
  };
}