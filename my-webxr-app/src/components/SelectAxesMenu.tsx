import React, { useState } from 'react';

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

export default function SelectAxesColumns() {
  const options = [{ value: 'test', label: 'Test' }];

  return (
    <div>
      <DropDown label="Select X Axis: " id="xAxis" options={options} />
      <DropDown label="Select Y Axis: " id="yAxis" options={options} />
      <DropDown label="Select Z Axis: " id="zAxis" options={options} />
      <button type="submit">Complete Selection</button>
    </div>
  );
}
