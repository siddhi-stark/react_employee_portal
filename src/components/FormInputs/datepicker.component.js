/* eslint no-unneeded-ternary: "error" */
import React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateTimePicker(props) {
  const {
    selected,
    startDate,
    endDate,
    onChange,
    minDate,
    maxDate,
    isClearable,
    dateFormat,
    showMonthYearPicker,
    showYearPicker,
    disabled,
    showTimeSelect,
    showTimeSelectOnly,
    timeIntervals,
    timeCaption,
    className,
    showYearDropdown,
    yearDropdownItemNumber,
    showMonthDropdown,
    showMonthYearDropdown,
    scrollableYearDropdown,
    label,
    errorMessage,
    containerClass,
    asterisk,
    placeholder,
  } = props;

  return (
    <>
      {label && (
        <Form.Label>
          {' '}
          {label} <span style={{ color: 'red' }}>{asterisk}</span>{' '}
        </Form.Label>
      )}
      <Form.Group className={containerClass}>
        <DatePicker
          selected={selected}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          isClearable={isClearable}
          disabled={disabled}
          dateFormat={dateFormat}
          showMonthYearPicker={showMonthYearPicker}
          showYearPicker={showYearPicker}
          onChange={onChange}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          timeIntervals={timeIntervals}
          timeCaption={timeCaption}
          className={className}
          showYearDropdown={showYearDropdown}
          yearDropdownItemNumber={yearDropdownItemNumber}
          showMonthDropdown={showMonthDropdown}
          showMonthYearDropdown={showMonthYearDropdown}
          scrollableYearDropdown={scrollableYearDropdown}
          placeholderText={placeholder}
        />
        <p style={{ color: 'red' }}> {errorMessage} </p>
      </Form.Group>
    </>
  );
}
