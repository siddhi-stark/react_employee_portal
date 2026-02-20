import React from 'react';
import Select from 'react-select';

const ReactSelect = (props) => {
  const {
    isMulti,
    onChange,
    value,
    options,
    isDisabled,
    className,
    components,
    placeholder,
    isClearable,
  } = props;

  return (
    <div>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        isDisabled={isDisabled}
        className={className}
        components={components}
        placeholder={placeholder}
        isClearable={isClearable}
      />
    </div>
  );
};

export default ReactSelect;
