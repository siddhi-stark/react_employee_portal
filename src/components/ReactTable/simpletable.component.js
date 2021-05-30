import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import Pagination from '../Pagination/pagination.component';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';

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
  role: '',
  emptyMessage: 'No record found.',
  bulkActionsLabel: 'Apply',
};

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
    role,
    emptyMessage,
    bulkActionsLabel,
  } = {
    ...defaults,
    ...props,
  };
  const [allSelected, setAllSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  
  const [selectedRows, setSelectedRows] = useState(
    
    rows.filter((row) => {
      
      return selectedRowItems.includes(Number(row.id));
    })
  );
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([
    ...selectedRowItems,
  ]);
  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = (isChecked) => {
    const selectedIndexes = [];
    const selectedItems = rows.filter((row) => {
      // eslint-disable-line
      if (isChecked) selectedIndexes.push(Number(row.id));
      return isChecked;
    });
    setSelectedRows([...selectedItems]);
    setSelectedRowIndexes([...selectedIndexes]);
    setAllSelected(isChecked);
    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  const onSelectRow = (isChecked, rowIndex) => {
    let selectedItems = [...selectedRows];
    const selectedIndexes = [];
    if (isChecked) {
      selectedItems.push(rows[rowIndex]);
    } else {
      selectedItems = selectedItems.filter(
        (j) => Number(j.id) !== Number(rows[rowIndex].id)
      );
    }
    const selectedCount = selectedItems.filter((item) => {
      selectedIndexes.push(Number(item.id));
      return item;
    }).length;
    setSelectedRows(selectedItems);
    setAllSelected(selectedCount === rows.length);
    setSelectedRowIndexes([...selectedIndexes]);
    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  const RenderColumnData = ({ rowData, columnData }) => {
    try {
      const columnDisplay =
        columnData && columnData.render
          ? columnData.render(rowData)
          : rowData[columnData.id];
      return <>{columnDisplay}</>;
    } catch (err) {
      return <>{rowData[columnData.id]}</>;
    }
  };

  const RenderColumn = ({ columnData }) => {
    try {
      const columnDisplay =
        columnData && columnData.columnRender
          ? columnData.columnRender(columnData)
          : columnData.label;
      return <>{columnDisplay}</>;
    } catch (err) {
      return <>{columnData.label}</>;
    }
  };

  const DisplayViewComponent = ({ display, children }) => {
    return <>{display && <>{children}</>}</>;
  };

  const EmptyRecordRender = () => {
    try {
      const { emptyRender } = props;
      if (rows.length > 0) return null;

      const displayEmptyRow =
        emptyRender && emptyRender ? emptyRender() : <h4>{emptyMessage}</h4>;
      return (
        <>
          <div className="text-center">{displayEmptyRow}</div>
        </>
      );
    } catch (err) {
      return (
        <div className="text-center">
          <h4>{emptyMessage}</h4>
        </div>
      );
    }
  };
 
  return (
    <>
      <div className={`table-projects table-responsive ${tableContainerClass}`}>
        {bulkActions && bulkActions.length > 0 && rows.length > 0 && (
          <>
            <div className={`mb-2 bulk-action-apply ${dropdownContainerClass}`}>
              <select
                style={{ width: '150px' }}
                value={selectedAction}
                onBlur={() => {}}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                }}
              >
                <option value="">Bulk Actions</option>
                {bulkActions.map((action, index) => (
                  <option value={index}>{action.actionTitle}</option>
                ))}
              </select>

              <Button
                className="apply-btn btn btn-primary"
                onClick={() => {
                  if (!selectedRowIndexes.length || !selectedAction) {
                    swal({
                      title:
                        selectedRowIndexes.length && !selectedAction
                          ? 'Please select atleast one action?'
                          : 'Please select atleast one record?',
                      icon: 'warning',
                      dangerMode: true,
                      buttons: true,
                      closeOnClickOutside: false,
                      allowOutsideClick: false,
                    });
                  }
                  if (!selectedRowIndexes.length || !selectedAction) return;
                  bulkActions[selectedAction].actionCallback(
                    selectedRowIndexes,
                    setAllSelected(false),
                    setSelectedRows([]),
                    setSelectedRowIndexes([]),
                    setSelectedAction('')
                  );
                }}
              >
                {bulkActionsLabel}
              </Button>
            </div>
          </>
        )}
        <table className={`table ${tableClass}`}>
          {columns && columns.length > 0 && rows.length > 0 && (
            <thead>
              <tr>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        id="chkAll"
                        name="chkAll"
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          onSelectHead(e.target.checked);
                        }}
                      />
                    </div>
                  </th>
                )}
                {rows.length > 0 &&
                  columns.map((column, columnIndex) => (
                    <UserRestrictions
                      permittedUsers={column.roleAccess || []}
                      roleId={role || ''}
                    >
                      <DisplayViewComponent
                        display={
                          column.isDisplay !== undefined
                            ? column.isDisplay
                            : true
                        }
                      >
                        <th scope="col" key={`column-${columnIndex}`}>
                          <RenderColumn columnData={column} key={columnIndex} />
                        </th>
                      </DisplayViewComponent>
                    </UserRestrictions>
                  ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className={`${row.rowClass || ''}`}>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        id={`chk${row.id}`}
                        name={`chk${row.id}`}
                        value={row.id}
                        type="checkbox"
                        // checked={selectedRowIndexes.includes(row.id)}
                        checked={selectedRowItems.includes(Number(row.id))|| selectedRowIndexes.includes(row.id)}
                        onChange={(e) => {
                          onSelectRow(e.target.checked, rowIndex);
                        }}
                      />
                    </div>
                  </th>
                )}
                {allColumnIds.map((rowDataId, columnIndex) => (
                  <UserRestrictions
                    permittedUsers={columns[columnIndex].roleAccess || []}
                    roleId={role || ''}
                  >
                    <DisplayViewComponent
                      display={
                        columns[columnIndex].isDisplay !== undefined
                          ? columns[columnIndex].isDisplay
                          : true
                      }
                    >
                      <td>
                        <RenderColumnData
                          key={rowDataId}
                          columnData={columns[columnIndex]}
                          rowData={row}
                          colIdx={columnIndex}
                          rowIdx={rowIndex}
                        />
                      </td>
                    </DisplayViewComponent>
                  </UserRestrictions>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <EmptyRecordRender />
      </div>
      {showPagination &&
        paginationProps &&
        paginationProps.itemsPerPage < paginationProps.totalItems && (
          <Pagination {...paginationProps} />
        )}
    </>
  );
}
