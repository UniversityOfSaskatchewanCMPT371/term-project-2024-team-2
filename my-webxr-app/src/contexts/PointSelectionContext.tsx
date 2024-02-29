import React, { createContext, useContext, useMemo, useState } from "react";
import { DataPointProps } from "../components/DataPoint.tsx";

// import * as log4js from "log4js";

/**
 * Create an interface for the return state values of the Context.
 *
 * selectedDataPoint: either the prop of the selected DataPoint,
 *                    or null if one isn't selected.
 * setSelectedDataPoint: React State setter function
 */
interface PointSelectionContext {
  selectedDataPoint:
      DataPointProps | null;
  setSelectedDataPoint: React.Dispatch<
    React.SetStateAction<PointSelectionContext["selectedDataPoint"]>
  >;
}

/**
 * Create the PointSelectionContext.
 * There is a default value of null when it used outside a PointSelectionProvider.
 * Otherwise, it is the selectedDataPoint state.
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
  const [selectedDataPoint, _setSelectedDataPoint] =
    useState<PointSelectionContext["selectedDataPoint"]>(null);

  const setSelectedDataPoint = (
    newValue: React.SetStateAction<
        DataPointProps | null>,
  ) => {
    _setSelectedDataPoint(newValue);
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
};

/**
 * Provide a type-guaranteed context (not null) for use within components.
 * Call this function instead of useContext(PointSelectionContext).
 */
export const usePointSelectionContext = () => {
  // This context will only be null if called from outside a PointSelectionProvider.
  const context = useContext(PointSelectionContext);
  if (!context) {
    throw new Error(
      "Assertion failed: You must use this context within a PointSelectionProvider!",
    );
  }
  return context;
};
