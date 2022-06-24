import React from 'react';

const Select = ({
  onChange,
  className,
  options,
  value,
}: {
  className: string;
  onChange: (event: { target: { value: string } }) => void;
  options: [string, string][];
  value: string;
}): JSX.Element => {
  return (
    <select className={className} onChange={onChange} value={value}>
      {options.map(([option, text]) => (
        <option key={option} value={option}>
          {text}
        </option>
      ))}
    </select>
  );
};

export default Select;
