import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

export default function SelectDropdown(props) {
  const {
    label,
    defaultValue,
    name,
    className,
    isMulti,
    onSelectHandler,
    options,
  } = props;

  return (
    <>
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Select
          value={defaultValue}
          onChange={(e) => {
            if (onSelectHandler) onSelectHandler(e);
          }}
          name={name}
          className={className}
          options={options}
          isMulti={isMulti}
        />
      </Form.Group>
    </>
  );
}
