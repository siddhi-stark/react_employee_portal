import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const defaults = {
  columns: [],
  rows: [],
  showCheckbox: false,
};

export default function SimpleTable(props) {
  const { columns, rows, showCheckbox, onSelectRowsIndexes } = {
    ...defaults,
    ...props,
  };

  const [allSelected, setAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState(rows.map(() => false));

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
    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  return (
    <>
      <div className="table-projects">
        <Card>
          <div className="table-responsive">
            <table className="table table-striped">
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
        </Card>
      </div>
    </>
  );
}
