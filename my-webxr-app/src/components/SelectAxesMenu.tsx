import React, { useEffect, useState } from 'react';
import { getColumnTitles } from '../utils/GetColumnNames';
import assert from '../utils/Assert';

interface SelectAxesColumnsProps {
  dbName: string; // Add dbName as a prop
}
interface DropDownProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
}

function DropDown({ label, id, options }: DropDownProps) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
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

export default function SelectAxesColumns({ dbName }: SelectAxesColumnsProps) {
  assert(dbName != null, 'Database name cannot be null');
  const [AxisOptions, setAxisOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchColumnTitles() {
      try {
        const Axes = await getColumnTitles(dbName);

        setAxisOptions(Axes.map((title: string) => ({ value: title, label: title })));
      } catch (error) {
        console.error('Error fetching column titles:', error);
      }
    }
    fetchColumnTitles();
  }, [dbName]);
  return (
    <div>
      <DropDown label="Select X Axis: " id="xAxis" options={AxisOptions} />
      <DropDown label="Select Y Axis: " id="yAxis" options={AxisOptions} />
      <DropDown label="Select Z Axis: " id="zAxis" options={AxisOptions} />
      <button type="submit">Complete Selection</button>
    </div>
  );
}
