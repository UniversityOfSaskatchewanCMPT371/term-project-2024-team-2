import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Create an interface for the return state values of the Context.
 *
 * selectedDataPoint: either the id number of the selected DataPoint,
 *                    or null if one isn't selected.
 * setSelectedDataPoint: React State setter function
 */
interface PointSelectionContext {
  selectedDataPoint: number | null;
  setSelectedDataPoint: React.Dispatch<
    React.SetStateAction<PointSelectionContext["selectedDataPoint"]>
  >;
}

/**
 * Create the Context.
 */
export const PointSelectionContext =
  createContext<PointSelectionContext | null>(null);

/**
 * Create the Context Provider element for the React tree.
 *
 * @param children: pass-through for the child elements.
 */
export const PointSelectionProvider = ({
  children,
}: React.PropsWithChildren) => {
  /* Create the internal selected DataPoint State */
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<PointSelectionContext["selectedDataPoint"]>(null);

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
};

/**
 * Provide a type-guaranteed context (not null) for use within components.
 * Call this function instead of useContext(PointSelectionContext).
 */
export const usePointSelectionContext = () => {
  const context = useContext(PointSelectionContext);
  if (!context) {
    throw new Error(
      "You must use this context within a PointSelectionProvider!",
    );
  }
  return context;
};
