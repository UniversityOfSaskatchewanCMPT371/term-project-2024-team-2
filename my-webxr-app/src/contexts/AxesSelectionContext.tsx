import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { useRollbar } from '@rollbar/react';

/**
 * Create an interface for the return state values of the Context.
 *
 * selectedXAxis: either the column as a string for selected x-axis,
 *                    or null if one isn't selected.
 * setSelectedXAxis: React State setter function
 *
 * selectedYAxis: either the column as a string for selected y-axis,
 *                    or null if one isn't selected.
 * setSelectedYAxis: React State setter function
 *
 * selectedZAxis: either the column as a string for selected z-axis,
 *                    or null if one isn't selected.
 * setSelectedZAxis: React State setter function
 */
interface AxesSelectionContextType {
  selectedXAxis: string | null;
  setSelectedXAxis: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedXAxis']>
  >;
  selectedYAxis: string | null;
  setSelectedYAxis: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedYAxis']>
  >;
  selectedZAxis: string | null;
  setSelectedZAxis: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedZAxis']>
  >;

  selectedOptionalColumn1: string | null;
  setSelectedOptionalColumn1: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn1']>
  >;
  selectedOptionalColumn2: string | null;
  setSelectedOptionalColumn2: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn2']>
  >;
  selectedOptionalColumn3: string | null;
  setSelectedOptionalColumn3: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn3']>
  >;
  selectedOptionalColumn4: string | null;
  setSelectedOptionalColumn4: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn4']>
  >;
  selectedOptionalColumn5: string | null;
  setSelectedOptionalColumn5: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn5']>
  >;
  selectedOptionalColumn6: string | null;
  setSelectedOptionalColumn6: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn6']>
  >;
  selectedOptionalColumn7: string | null;
  setSelectedOptionalColumn7: React.Dispatch<
  React.SetStateAction<AxesSelectionContextType['selectedOptionalColumn7']>
  >;
}

/**
 * Create the AxisSelectionContext.
 * There is a default value of null when it used outside a AxisSelectionProvider.
 * Otherwise, it is the selectedAxis state.
 */
export const AxesSelectionContext = createContext<AxesSelectionContextType | null>(null);

/**
 * Create the Context Provider element for the React tree.
 *
 * @param children: pass-through for the child elements.
 * @pre-condition: none
 * @post-condition: x,y,z axes states initialized to null and updated to their
 *                  selected states using setter functions from component tree
 * @return: React component that wraps its children within AxesSelectionContext.Provider
 */
export function AxesSelectionProvider({
  children,
}: React.PropsWithChildren) {
  /* Create the internal selected axis State */
  const [selectedXAxis, setSelectedXAxisInternal] = useState<
  AxesSelectionContextType['selectedXAxis']>(null);
  const [selectedYAxis, setSelectedYAxisInternal] = useState<
  AxesSelectionContextType['selectedYAxis']>(null);
  const [selectedZAxis, setSelectedZAxisInternal] = useState<
  AxesSelectionContextType['selectedZAxis']>(null);
  const [selectedOptionalColumn1, setSelectedOptionalColumn1Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn1']>(null);
  const [selectedOptionalColumn2, setSelectedOptionalColumn2Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn2']>(null);
  const [selectedOptionalColumn3, setSelectedOptionalColumn3Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn3']>(null);
  const [selectedOptionalColumn4, setSelectedOptionalColumn4Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn4']>(null);
  const [selectedOptionalColumn5, setSelectedOptionalColumn5Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn5']>(null);
  const [selectedOptionalColumn6, setSelectedOptionalColumn6Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn6']>(null);
  const [selectedOptionalColumn7, setSelectedOptionalColumn7Internal] = useState<
  AxesSelectionContextType['selectedOptionalColumn7']>(null);

  const rollbar = useRollbar();

  const setSelectedXAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedXAxis state to ${newValue}`);
    setSelectedXAxisInternal(newValue);
  };

  const setSelectedYAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedYAxis state to ${newValue}`);
    setSelectedYAxisInternal(newValue);
  };

  const setSelectedZAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedZAxis state to ${newValue}`);
    setSelectedZAxisInternal(newValue);
  };

  const setSelectedOptionalColumn1 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn1 state to ${newValue}`);
    setSelectedOptionalColumn1Internal(newValue);
  };

  const setSelectedOptionalColumn2 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn2 state to ${newValue}`);
    setSelectedOptionalColumn2Internal(newValue);
  };

  const setSelectedOptionalColumn3 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn3 state to ${newValue}`);
    setSelectedOptionalColumn3Internal(newValue);
  };

  const setSelectedOptionalColumn4 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn4 state to ${newValue}`);
    setSelectedOptionalColumn4Internal(newValue);
  };

  const setSelectedOptionalColumn5 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn5 state to ${newValue}`);
    setSelectedOptionalColumn5Internal(newValue);
  };

  const setSelectedOptionalColumn6 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn6 state to ${newValue}`);
    setSelectedOptionalColumn6Internal(newValue);
  };

  const setSelectedOptionalColumn7 = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    rollbar.debug(`AxesSelectionContext: updating selectedOptionalColumn7 state to ${newValue}`);
    setSelectedOptionalColumn7Internal(newValue);
  };

  /* Cache the value to prevent unnecessary re-renders. */
  const value = useMemo(
    () => ({
      selectedXAxis,
      setSelectedXAxis,
      selectedYAxis,
      setSelectedYAxis,
      selectedZAxis,
      setSelectedZAxis,
      selectedOptionalColumn1,
      setSelectedOptionalColumn1,
      selectedOptionalColumn2,
      setSelectedOptionalColumn2,
      selectedOptionalColumn3,
      setSelectedOptionalColumn3,
      selectedOptionalColumn4,
      setSelectedOptionalColumn4,
      selectedOptionalColumn5,
      setSelectedOptionalColumn5,
      selectedOptionalColumn6,
      setSelectedOptionalColumn6,
      selectedOptionalColumn7,
      setSelectedOptionalColumn7,
    }),
    [
      selectedXAxis,
      selectedYAxis,
      selectedZAxis,
      selectedOptionalColumn1,
      selectedOptionalColumn2,
      selectedOptionalColumn3,
      selectedOptionalColumn4,
      selectedOptionalColumn5,
      selectedOptionalColumn6,
      selectedOptionalColumn7,
    ],
  );

  return (
    <AxesSelectionContext.Provider value={value}>
      {children}
    </AxesSelectionContext.Provider>
  );
}

/**
 * Provide a type-guaranteed context (not null) for use within components.
 * Call this function instead of useContext(AxesSelectionContext).
 * @pre-condition: component needs to be wrapped inside AxesSelectionProvider component
 * @post-condition: get value from AxesSelectionContext if it exists,
 *                  else error is thrown if not used within AxesSelectionProvider
 * @return: AxesSelectionContext value if it exists
 */
export const useAxesSelectionContext = () => {
  // This context will only be null if called from outside a AxesSelectionProvider.
  const context = useContext(AxesSelectionContext);
  if (!context) {
    throw new Error(
      'Assertion failed: You must use this context within a AxesSelectionProvider!',
    );
  }
  return context;
};
