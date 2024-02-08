import React, { createContext, useContext, useMemo, useState } from "react";

interface PointSelectionContext {
  selectedDataPoint: number | null;
  setSelectedDataPoint: React.Dispatch<
    React.SetStateAction<PointSelectionContext["selectedDataPoint"]>
  >;
}

export const PointSelectionContext =
  createContext<PointSelectionContext | null>(null);

export const PointSelectionProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<PointSelectionContext["selectedDataPoint"]>(null);
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

export const usePointSelectionContext = () => {
  const context = useContext(PointSelectionContext);
  if (!context) {
    throw new Error(
      "You must use this context within a PointSelectionProvider!",
    );
  }
  return context;
};
