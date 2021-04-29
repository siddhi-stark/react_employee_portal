import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
  selectedRowItems: [],
};

// Columns structure
// [{id: 'id', label: 'Id'},{id: 'name', label: 'Name'}{id: 'email', label: 'Email'}]

// Rows structure
// [{id: 1, name: 'Sample name', email: 'john.doe@example.com'}]

// Bulk action structure
// [
//   {
//     id: 'delete',
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
    selectedRowItems,
    label,
  } = {
    ...defaults,
    ...props,
  };

  const [allSelected, setAllSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedRows, setSelectedRows] = useState(
    rows.map((row, rowIndex) => {
      return selectedRowItems.includes(rowIndex);
    })
  );
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([
    ...selectedRowItems,
  ]);

  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = (isChecked) => {
    const selectedIndexes = [];
    const selectedItems = rows.map((row, rowIndex) => {
      if (isChecked) selectedIndexes.push(rowIndex);
      return isChecked;
    });
    setSelectedRows([...selectedItems]);
    setAllSelected(isChecked);
    setSelectedRowIndexes([...selectedIndexes]);
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
      <div className={`table-projects  ${tableContainerClass}`}>
        {bulkActions && bulkActions.length > 0 && (
          <>
            <div className="mb-2 bulk-action-apply">
              <select // eslint-disable-line
                value={selectedAction}
                className={`${dropdownContainerClass}`}
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                <option value="">Bulk Actions</option>
                {bulkActions.map((action, index) => (
                  <option value={index}>{action.actionTitle}</option>
                ))}
              </select>

              <Button
                className="apply-btn"
                onClick={() => {
                  if (!selectedRowIndexes.length || !selectedAction) return;
                  bulkActions[selectedAction].actionCallback(
                    selectedRowIndexes,
                    setAllSelected(false),
                    setSelectedRows(rows.map(() => false)),
                    setSelectedRowIndexes([]),
                    setSelectedAction('')
                  );
                }}
              >
                {label}
              </Button>
            </div>
          </>
        )}
        <div className="table-responsive">
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
                    <th
                      scope="col"
                      key={`column-${columnIndex}`} //eslint-disable-line
                    >
                      {' '}
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`} //eslint-disable-line
                  className={row.rowClass}
                >
                  {showCheckbox && (
                    <td>
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
                    </td>
                  )}
                  {allColumnIds.map((rowDataId) => (
                    <td>{row[rowDataId]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPagination && paginationProps && paginationProps.totalItems > 0 ? (
        <Pagination {...paginationProps} />
      ) : (
        <p className="text-center"> No records found</p>
      )}
    </>
  );
}
