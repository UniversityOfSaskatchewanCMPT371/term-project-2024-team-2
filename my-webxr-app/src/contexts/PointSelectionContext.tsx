import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { useRollbar } from '@rollbar/react';
import { DataPointProps } from '../types/DataPointTypes';
import assert from '../utils/Assert';

/**
 * Create an interface for the return state values of the Context.
 *
 * selectedDataPoint: either the id number of the selected DataPoint,
 *                    or null if one isn't selected.
 * setSelectedDataPoint: React State setter function
 */
interface PointSelectionContextType {
  selectedDataPoint: DataPointProps | null;
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
  const rollbar = useRollbar();

  const setSelectedDataPoint = (
    newValue: React.SetStateAction<DataPointProps | null>,
  ) => {
    rollbar.debug(`PointSelectionContext: updating selectedDataPoint state to ${newValue}`);
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
export const usePointSelectionContext = (): PointSelectionContextType => {
  // This context will only be null if called from outside a PointSelectionProvider.
  const context = useContext(PointSelectionContext);
  assert(!!context, `Assertion failed: You must use this context within a
  PointSelectionProvider! context = ${context}`);

  // context cannot be null because of the assertion, but TypeScript does not realise that, so
  // we must force cast it to PointSelectionContextType.
  return context as unknown as PointSelectionContextType;
};
