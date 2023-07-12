import React, { useEffect, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

const SelectStaticDropdown = ({
  isClearable,
  value,
  clearSelected,
  onSelectChange,
  selectPlaceholder,
  key,
  className,
  disabled,
  isSearch,
  dropdownType,
  clearCacheOnID,
  clearSelectedByParent,
}) => {
  const [selectedValue, setSelectedValue] = useState({});
  const [timeRange, setTimeRange] = useState([
    { name: '30min', value: 30 },
    { name: '1hr', value: 60 },
    { name: '1hr 30min', value: 90 },
    { name: '2hr', value: 120 },
    { name: '2hr 30min', value: 150 },
    { name: '3hr', value: 180 },
    { name: '3hr 30min', value: 210 },
    { name: '4hr', value: 240 },
    { name: '4hr 30min', value: 270 },
    { name: '5hr', value: 300 },
    { name: '5hr 30min', value: 330 },
    { name: '6hr', value: 360 },
    { name: '6hr 30min', value: 390 },
    { name: '7hr', value: 420 },
    { name: '7hr 30min', value: 450 },
    { name: '8hr', value: 480 },
    { name: '8hr 30min', value: 510 },
    { name: '9hr', value: 540 },
    { name: '9hr 30min', value: 570 },
  ]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([
    {
      id: 1,
      name: 'January',
    },
    {
      id: 2,
      name: 'February',
    },
    {
      id: 3,
      name: 'March',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'May',
    },
    {
      id: 6,
      name: 'June',
    },
    {
      id: 7,
      name: 'July',
    },
    {
      id: 8,
      name: 'August',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'October',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'December',
    },
  ]);

  useEffect(() => {
    if (value && value.name !== (selectedValue && selectedValue.name)) {
      setSelectedValue(value);
    }
    getLatestFiveYear();
  }, [value]);

  const getLatestFiveYear = () => {
    let maxOffset = 9;
    let thisYear = new Date().getFullYear();
    let allYears = [];
    for (let x = 0; x <= maxOffset; x++) {
      allYears.push({ name: thisYear - x });
    }
    setYears(allYears);
  };

  useEffect(() => {
    if (clearSelectedByParent) setSelectedValue({});
  }, [clearSelectedByParent]);

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    if (dropdownType === 'months') {
      return {
        options: months,
        hasMore: false,
      };
    }
    if (dropdownType === 'years') {
      return {
        options: years,
        hasMore: false,
      };
    }
    if (dropdownType === 'timeRange') {
      return {
        options: timeRange,
        hasMore: false,
      };
    }
    if (dropdownType === 'workComplete') {
      return {
        options: [
          { id: '1', name: 'Yes' },
          { id: '0', name: 'No' },
        ],
        hasMore: false,
      };
    }
    if (dropdownType === 'paymentTerm') {
      return {
        options: [
          { name: 'COD', value: 'COD' },
          { name: 'Net 30', value: 'Net 30' },
          { name: 'Upon Completion', value: 'Upon Completion' },
          { name: 'Pre-Pay To Begin Work', value: 'Pre-Pay To Begin Work' },
        ],
        hasMore: false,
      };
    }
  };

  const onSelectChangeData = (option) => {
    if (clearSelectedByParent) setSelectedValue(option);
    if (clearSelected) {
      setSelectedValue({});
    } else {
      setSelectedValue(option);
    }
    if (onSelectChange) {
      onSelectChange(option);
    }
  };

  return (
    <AsyncPaginate
      key={key}
      value={selectedValue && selectedValue.name ? selectedValue : null}
      className={className}
      loadOptions={loadOptions}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
      onChange={onSelectChangeData}
      isDisabled={disabled}
      isSearchable={isSearch}
      placeholder={selectPlaceholder}
      isClearable={isClearable ? isClearable : false}
      cacheUniqs={[clearCacheOnID]}
      additional={{
        page: 0,
      }}
    />
  );
};

export default SelectStaticDropdown;
