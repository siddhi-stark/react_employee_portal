import React from 'react';
import { Form } from 'react-bootstrap';

export default function CheckboxComponent(props) {
  const { id, value, onSelectCheckbox, type, disabled, options, className } =
    props;

  return (
    <>
      <Form.Group>
        {options &&
          options.map((op) => (
            <Form.Check
              id={id}
              type={type}
              value={value}
              onChange={(e) => {
                if (onSelectCheckbox) onSelectCheckbox(e);
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
