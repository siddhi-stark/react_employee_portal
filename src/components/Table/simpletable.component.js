import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Pagination from '../Pagination/pagination.component';

const defaults = {
  columns: [],
  rows: [],
  showCheckbox: false,
  tableClass: '',
  tableContainerClass: '',
  paginationProps: {},
  showPagination: false,
  dropdownContainerClass: '',
  bulkActions: [],
};

// Columns structure
// [{id: 'id', label: 'Id'},{id: 'name', label: 'Name'}{id: 'email', label: 'Email'}]

// Rows structure
// [{id: 1, name: 'Sample name', email: 'john.doe@example.com'}]

// Bulk action structure
// [
//   {
//     actionTitle: 'Delete',
//     actionCallback: () => { }
//   }
// ]

export default function SimpleTable(props) {
  const {
    columns,
    rows,
    showCheckbox,
    onSelectRowsIndexes,
    tableClass,
    tableContainerClass,
    paginationProps,
    showPagination,
    dropdownContainerClass,
    bulkActions,
  } = {
    ...defaults,
    ...props,
  };

  const [allSelected, setAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState(rows.map(() => false));
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([]);

  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = (isChecked) => {
    const selectedIndexes = [];
    const selectedItems = rows.map((row, rowIndex) => {
      // eslint-disable-line
      if (isChecked) selectedIndexes.push(rowIndex);
      return isChecked;
    });
    setSelectedRows([...selectedItems]);
    setAllSelected(isChecked);
    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  const onSelectRow = (isChecked, rowIndex) => {
    const selectedItems = [...selectedRows];
    selectedItems[rowIndex] = isChecked;
    const selectedIndexes = [];
    const selectedCount = selectedItems.filter((item, itemIndex) => {
      if (item) selectedIndexes.push(itemIndex);
      return item;
    }).length;
    setSelectedRows(selectedItems);
    setAllSelected(selectedCount === rows.length);
    setSelectedRowIndexes([...selectedIndexes]);
    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  return (
    <>
      <div className={`table-projects table-responsive ${tableContainerClass}`}>
        {bulkActions && bulkActions.length > 0 && (
          <Dropdown className={`mb-2 ${dropdownContainerClass}`}>
            <Dropdown.Toggle variant="primary">Bulk Actions</Dropdown.Toggle>
            <Dropdown.Menu>
              {bulkActions.map((action) => (
                <Dropdown.Item
                  onClick={() => {
                    if (!selectedRowIndexes.length) return;
                    if (action.actionCallback)
                      action.actionCallback(selectedRowIndexes);
                  }}
                >
                  {action.actionTitle}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <table className={`table ${tableClass}`}>
          {columns && columns.length > 0 && (
            <thead>
              <tr>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          onSelectHead(e.target.checked);
                        }}
                      />
                    </div>
                  </th>
                )}
                {columns.map((column, columnIndex) => (
                  <th scope="col" key={`column-${columnIndex}`}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedRows[rowIndex]}
                        onChange={(e) => {
                          onSelectRow(e.target.checked, rowIndex);
                        }}
                      />
                    </div>
                  </th>
                )}
                {allColumnIds.map((rowDataId) => (
                  <th>{row[rowDataId]}</th>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && <Pagination {...paginationProps} />}
    </>
  );
}
