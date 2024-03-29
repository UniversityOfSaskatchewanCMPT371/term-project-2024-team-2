import React, { useEffect, useState } from 'react';
import assert from '../utils/Assert';
import DataAbstractor from '../data/DataAbstractor';
import { useAxesSelectionContext } from '../contexts/AxesSelectionContext';
import { rollbar } from '../utils/LoggingUtils';

interface SelectAxesColumnsProps {
  database: DataAbstractor;
}
interface DropDownProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  chosenValue: (value: string) => void;
}

/*
  this function creates the dropdowns that will be used to choose the axes for XYZ
  @params:
      - label: the label of the dropdown (the text beside it)
      - id: the id of the dropdown (to classify x, y, or z)
      - options: this will be the choices that can fill the dropdowns
      - chosenValue: will be the value chosen for from each dropdown
  @pre-condition: the options should be loaded up with column names
  @post-condition: chosenValue is updated with the selection
  @return: the dropdown menu
 */
function DropDown({
  label, id, options, chosenValue,
}: DropDownProps) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // gets value from dropdown
    setSelectedValue(event.target.value);
    // assigns value to chosenValue arg
    chosenValue(event.target.value);
  };

  return (
    <div style={{ display: 'inline-block', marginRight: '20px' }}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={selectedValue} onChange={handleChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/*
  this function will allow the user to choose their axis values
  @params:
      - dbName: the name of the database to get the data from
  @pre-condition: dB name cannot be empty, relies on database
  @post-condition: setting the proper x,y,z coordinates for the data point
  @return: the dropdown menus
  (think also needs to return the columns chosen and assign the values to x,y,z of data points)
 */
export default function SelectAxesColumns({ database }: SelectAxesColumnsProps) {
  assert(database != null, 'Database name cannot be null');
  const [AxisOptions, setAxisOptions] = useState<{ value: string; label: string }[]>([]);
  const { setSelectedXAxis, setSelectedYAxis, setSelectedZAxis } = useAxesSelectionContext();
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');

  useEffect(() => {
    async function fetchColumnTitles() {
      try {
        const Axes = await database.getAvailableFields();
        setAxisOptions(Axes.map((title: string) => ({ value: title, label: title })));
      } catch (error) {
        // eslint-disable-next-line no-console
        rollbar.error(`Error fetching column titles:${error}`);
      }
    }
    fetchColumnTitles();
  }, [database]);

  /*
  this function will plot the graph with the selected x,y,z axes
  @pre-condition:
  @post-condition:
 */
  const handleCompleteSelection = async (
    _setSelectedXAxis: React.Dispatch<React.SetStateAction<string | null>>,
    _setSelectedYAxis: React.Dispatch<React.SetStateAction<string | null>>,
    _setSelectedZAxis: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    try {
      // await setRepresentingColumns(database, xAxis, yAxis, zAxis);
      // TODO: plot the graph with the selected axes
      _setSelectedXAxis(xAxis);
      _setSelectedYAxis(yAxis);
      _setSelectedZAxis(zAxis);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting representing columns:', error);
    }
  };

  return (
    <div>
      <DropDown label="Select X Axis: " id="xAxis" options={AxisOptions} chosenValue={setXAxis} />
      <DropDown label="Select Y Axis: " id="yAxis" options={AxisOptions} chosenValue={setYAxis} />
      <DropDown label="Select Z Axis: " id="zAxis" options={AxisOptions} chosenValue={setZAxis} />
      <button type="submit" onClick={() => { handleCompleteSelection(setSelectedXAxis, setSelectedYAxis, setSelectedZAxis); }}>Complete Selection</button>
    </div>
  );
}
