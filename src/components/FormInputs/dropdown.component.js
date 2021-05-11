import React from 'react';
import { Form } from 'react-bootstrap';

export default function DropdownComponent(props) {
  const {
    label,
    options,
    onSelectOptions,
    name,
    value,
    placeholder,
    multiple,
    className,
    disabled,
  } = props;

  return (
    <>
      <Form.Group controlId="formSelect">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="select"
          className={className}
          value={value}
          name={name}
          multiple={multiple}
          placeholder={placeholder}
          isDisabled={disabled}
          onChange={(e) => {
            if (onSelectOptions) onSelectOptions(e);
          }}
        >
          {options &&
            options.map((op) => {
              return <option value={op.value}>{op.name}</option>;
            })}
        </Form.Control>
      </Form.Group>
    </>
  );
}
