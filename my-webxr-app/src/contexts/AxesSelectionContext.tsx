import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

// import * as log4js from "log4js";

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
 */
export function AxesSelectionProvider({
  children,
}: React.PropsWithChildren) {
  /* Create the internal selected axis State */
  const [selectedXAxis, setSelectedXAxisInternal] = useState<AxesSelectionContextType['selectedXAxis']>(null);
  const [selectedYAxis, setSelectedYAxisInternal] = useState<AxesSelectionContextType['selectedYAxis']>(null);
  const [selectedZAxis, setSelectedZAxisInternal] = useState<AxesSelectionContextType['selectedZAxis']>(null);

  const setSelectedXAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    console.log(newValue);
    // log4js
    //   .getLogger()
    //   .debug(
    //     "AxesSelectionContext: updating selectedXAxis state to " +
    //       newValue,
    //   );
    setSelectedXAxisInternal(newValue);
  };

  const setSelectedYAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    console.log(newValue);
    // log4js
    //   .getLogger()
    //   .debug(
    //     "AxesSelectionContext: updating selectedYAxis state to " +
    //       newValue,
    //   );
    setSelectedYAxisInternal(newValue);
  };

  const setSelectedZAxis = (
    newValue: React.SetStateAction<string | null>,
  ) => {
    console.log(newValue);
    // log4js
    //   .getLogger()
    //   .debug(
    //     "AxesSelectionContext: updating selectedZAxis state to " +
    //       newValue,
    //   );
    setSelectedZAxisInternal(newValue);
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
    }),
    [selectedXAxis, selectedYAxis, selectedZAxis],
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
