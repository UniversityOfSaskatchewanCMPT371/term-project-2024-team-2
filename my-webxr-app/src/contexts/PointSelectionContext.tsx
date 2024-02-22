import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

// import * as log4js from "log4js";

/**
 * Create an interface for the return state values of the Context.
 *
 * selectedDataPoint: either the id number of the selected DataPoint,
 *                    or null if one isn't selected.
 * setSelectedDataPoint: React State setter function
 */
interface PointSelectionContextType {
  selectedDataPoint: number | null;
  setSelectedDataPoint: React.Dispatch<
  React.SetStateAction<PointSelectionContextType['selectedDataPoint']>
  >;
}

/**
 * Create the PointSelectionContext.
 * There is a default value of null when it used outside a PointSelectionProvider.
 * Otherwise, it is the selectedDataPoint state.
 */
export const PointSelectionContext = createContext<PointSelectionContextType | null>(null);

/**
 * Create the Context Provider element for the React tree.
 *
 * @param children: pass-through for the child elements.
 */
export function PointSelectionProvider({
  children,
}: React.PropsWithChildren) {
  /* Create the internal selected DataPoint State */
  const [selectedDataPoint, setSelectedDataPointInternal] = useState<PointSelectionContextType['selectedDataPoint']>(null);

  const setSelectedDataPoint = (
    newValue: React.SetStateAction<number | null>,
  ) => {
    // log4js
    //   .getLogger()
    //   .debug(
    //     "PointSelectionContext: updating selectedDataPoint state to " +
    //       newValue,
    //   );
    setSelectedDataPointInternal(newValue);
  };

  /* Cache the value to prevent unnecessary re-renders. */
  const value = useMemo(
    () => ({ selectedDataPoint, setSelectedDataPoint }),
    [selectedDataPoint],
  );

  return (
    <PointSelectionContext.Provider value={value}>
      {children}
    </PointSelectionContext.Provider>
  );
}

/**
 * Provide a type-guaranteed context (not null) for use within components.
 * Call this function instead of useContext(PointSelectionContext).
 */
export const usePointSelectionContext = () => {
  // This context will only be null if called from outside a PointSelectionProvider.
  const context = useContext(PointSelectionContext);
  if (!context) {
    throw new Error(
      'Assertion failed: You must use this context within a PointSelectionProvider!',
    );
  }
  return context;
};
