import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

export default function SelectDropdown(props) {
  const {
    label,
    defaultValue,
    name,
    inputClass,
    isMulti,
    onSelectHandler,
    options,
    containerClass,
    errorMessage,
    asterisk,
    placeholder,
    disabled,
    isOptionDisabled,
  } = props;

  const CustomStyle = {
    option: (provided, state) => ({
      ...provided,
      color: '#212529',
      backgroundColor: state.isSelected ? 'white' : 'white',
    }),
    control: (provided, {isDisabled}) => ({
      // ...provided,
      // color: '#212529',
      // backgroundColor: state.isSelected ? 'white' : 'white',
      // return {
        ...provided,
        color: isDisabled ? '#999EA3' : 'white',
        backgroundColor: isDisabled ? '#e9ecef' : 'white',
        // fontStyle: isDisabled ? "italic" : "normal"
      // }
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: '#212529',
      backgroundColor: state.isSelected ? 'white' : 'white',
    }),
  };

  return (
    <>
      {label && (
        <Form.Label>
          {' '}
          {label} <span style={{ color: 'red' }}>{asterisk}</span>
        </Form.Label>
      )}
      <Form.Group className={containerClass}>
        <Select
          value={defaultValue}
          onChange={(e) => {
            if (onSelectHandler) onSelectHandler(e);
          }}
          name={name}
          className={inputClass}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          styles={CustomStyle}
          isDisabled={disabled}
          isOptionDisabled={isOptionDisabled}
        />
        <p style={{ color: 'red' }}> {errorMessage} </p>
      </Form.Group>
    </>
  );
}
