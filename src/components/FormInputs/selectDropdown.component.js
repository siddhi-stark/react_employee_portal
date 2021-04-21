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
  } = props;

  return (
    <>
      <Form.Group className={containerClass}>
        {label && (
          <Form.Label>
            {' '}
            {label} <span style={{ color: 'red' }}>{asterisk}</span>
          </Form.Label>
        )}
        <Select
          value={defaultValue}
          onChange={(e) => {
            console.log('e', e);
            if (onSelectHandler) onSelectHandler(e);
          }}
          name={name}
          className={inputClass}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
        />
        <p style={{ color: 'red' }}> {errorMessage} </p>
      </Form.Group>
    </>
  );
}
