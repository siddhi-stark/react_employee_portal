import React from 'react';
import { Form } from 'react-bootstrap';

export default function RadioComponent(props) {
  const {
    id,
    value,
    onSelectRadioButton,
    type,
    disabled,
    options,
    className,
    name,
  } = props;

  return (
    <>
      <Form.Group>
        {options &&
          options.map((op) => (
            <Form.Check
              id={id}
              type={type}
              name={name}
              value={value}
              onChange={(e) => {
                if (onSelectRadioButton) onSelectRadioButton(e);
              }}
              label={op.label}
              disabled={disabled}
              className={className}
            />
          ))}
      </Form.Group>
    </>
  );
}
