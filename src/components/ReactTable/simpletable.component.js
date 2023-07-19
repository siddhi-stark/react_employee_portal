import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import Pagination from '../Pagination/pagination.component';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';
import ReactSelect from '../ReactSelect/reactSelect';

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
  cancelLabel: 'Clear',
};


const SimpleTable = (props) => {
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
    cancelLabel
  } = {
    ...defaults,
    ...props,
  };

  bulkActions &&  bulkActions.map((action) => {// eslint-disable-line
    action.label = action.actionTitle;// eslint-disable-line
    action.value = action.actionTitle;// eslint-disable-line
  });

  const [selectedAction, setSelectedAction] = useState('');
  const [selectedActionIndex, setSelectedActionIndex] = useState('');
  const [selectedRows, setSelectedRows] = useState(
    rows.filter((row) => {
      return selectedRowItems.includes(String(row.id));
    })
  );
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([
    ...selectedRowItems,
  ]);
  const [allSelectedPages, setAllSelectedPages] = useState([]);
  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = async (isChecked) => {
    const selectedIndexes = [...selectedRowIndexes];
    setSelectedRowIndexes([]);
    const selectedItems = [...selectedRows];
    for (let i = 0, n = rows.length; i < n; i++) {  // eslint-disable-line
      const findRowIndex = await selectedItems.findIndex( // eslint-disable-line
        (e) => e.id === rows[i].id
      );
      if (isChecked && findRowIndex === -1) {
        selectedItems.push(rows[i]);
        selectedIndexes.push(String(rows[i].id));
      } else if (findRowIndex > -1 && !isChecked) {
        selectedItems.splice(findRowIndex, 1);
        selectedIndexes.splice(findRowIndex, 1);
      }
      if (i + 1 === n) {
        setSelectedRows([...selectedItems]);
        setSelectedRowIndexes([...selectedIndexes]);
        // setAllSelected(isChecked);
        const selectedPages = [...allSelectedPages];
        setAllSelectedPages([]);
        const currentPage = paginationProps.currentPage;
        const isCurrentPageAddedAlready = await allSelectedPages.findIndex(  // eslint-disable-line
          (e) => e === currentPage
        );
        if (isChecked && isCurrentPageAddedAlready === -1) {
          selectedPages.push(currentPage);
        } else if (!isChecked && isCurrentPageAddedAlready !== -1) {
          selectedPages.splice(isCurrentPageAddedAlready, 1);
        }
        setAllSelectedPages([...selectedPages]);
        if (onSelectRowsIndexes) {
          onSelectRowsIndexes(selectedIndexes); 
        }
      }
    }
  };

  const onSelectRow = async (isChecked, rowIndex) => {
    const selectedItems = [...selectedRows];
    const selectedIndexes = [...selectedRowIndexes];
    const rowId = rows[rowIndex].id;
    for (let i = 0, n = rows.length; i < n; i++) {    // eslint-disable-line
      if (rowId === rows[i].id) {
        const findRowIndex = await selectedItems.findIndex(   // eslint-disable-line
          (e) => e.id === rows[i].id
        );
        if (isChecked && findRowIndex === -1) {
          selectedItems.push(rows[i]);
          selectedIndexes.push(String(rows[i].id));
        } else if (findRowIndex > -1 && !isChecked) {
          selectedItems.splice(findRowIndex, 1);
          selectedIndexes.splice(findRowIndex, 1);
        }
      }
      if (i + 1 === n) {
        let selectedCount = 0;
        await rows.forEach((row) => {    // eslint-disable-line
          if (selectedIndexes.includes(String(row.id))) {
            selectedCount += 1;
          }
        });
        setSelectedRows([...selectedItems]);
        // setAllSelected(selectedCount === rows.length);
        setSelectedRowIndexes([...selectedIndexes]);
        const selectedPages = [...allSelectedPages];
        const currentPage = paginationProps.currentPage;
        const isCurrentPageAddedAlready = await allSelectedPages.findIndex(    // eslint-disable-line
          (e) => e === currentPage
        );
        if (selectedCount === rows.length && isCurrentPageAddedAlready === -1) {
          selectedPages.push(currentPage);
        } else if (
          selectedCount !== rows.length &&
          isCurrentPageAddedAlready !== -1
        ) {
          selectedPages.splice(isCurrentPageAddedAlready, 1);
        }
        setAllSelectedPages([...selectedPages]);
        if (onSelectRowsIndexes) {
          onSelectRowsIndexes(selectedIndexes);
        }
      }
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
      return <div className="float-left mb-3">{displayEmptyRow}</div>;
    } catch (err) {
      return (
        <div className="text-center">
          <h4>{emptyMessage}</h4>
        </div>
      );
    }
  };

  const isAllSelected = () => {
    return (
      allSelectedPages &&
      allSelectedPages.length > 0 &&
      allSelectedPages.includes(paginationProps.currentPage)
    );
  };

  return (
    <>
      {/* <NotificationContainer /> */}

      {bulkActions && bulkActions.length > 0 && rows.length > 0 && (
        <div
          className={`bulk-option mb-2 mt-2 bulk-action-apply d-flex ${dropdownContainerClass}`}
        >
          <ReactSelect
            style={{ width: '150px' }}
            className="table-bulk"
            placeholder="Bulk Action"
            onChange={(e) => {
              if (e) {
                const type = {};
                type.label = e.label;
                type.value = e.value;
                setSelectedAction(type);
                const idx =
                  bulkActions &&
                  bulkActions.findIndex((i) => i.value === e.value);
                if (idx !== '') {
                  setSelectedActionIndex(idx);
                }
              }
            }}
            value={selectedAction}
            options={bulkActions}
          />

          <Button
            className="ml-2"
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
              if (!selectedRowIndexes.length || selectedActionIndex === '')
                return;
              bulkActions[selectedActionIndex].actionCallback(
                selectedRowIndexes,
                // setAllSelected(false),
                setSelectedRows([]),
                setSelectedRowIndexes([]),
                setSelectedAction(''),
                setAllSelectedPages([])
              );
            }}
          >
            {bulkActionsLabel}
          </Button>
          <Button
            style={{ marginLeft: '5px' }}
            variant='secondary'
            onClick={() => {
              // if (!selectedAction) return;
              setSelectedAction('');
              setSelectedActionIndex('')
              setSelectedRows([]);
              setSelectedRowIndexes([]);
              setAllSelectedPages([]);
            }}
          >{cancelLabel}</Button>
        </div>
      )}
      <div
        className={`table-projects custom-table table-responsive ${tableContainerClass}`}
      >
        <table className={`table ${tableClass} table-striped`}>
          {columns && columns.length > 0 && (
            <thead className="table-header-box">
              <tr>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        id="chkAll"
                        name="chkAll"
                        type="checkbox"
                        // className="form-check-input"
                        checked={isAllSelected()}
                        onChange={(e) => {
                          onSelectHead(e.target.checked);
                        }}
                      />
                    </div>
                  </th>
                )}
                {columns.length > 0 &&
                  columns.map((column, columnIndex) => (
                    <UserRestrictions
                      permittedUsers={column.roleAccess || []}
                      roleId={role || ''}
                      key={columnIndex}
                    >
                      <DisplayViewComponent
                        display={
                          column.isDisplay !== undefined
                            ? column.isDisplay
                            : true
                        }
                      >
                        <th
                          scope="col"
                          key={`column-${columnIndex}`}
                          className="table-header-row-box text-nowrap"
                        >
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
              <tr key={`row-${rowIndex}`} className={row.rowClass}>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        // className="form-check-input"
                        id={`chk${row.id}`}
                        name={`chk${row.id}`}
                        value={row.id}
                        type="checkbox"
                        checked={selectedRowIndexes.includes(String(row.id))}
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
                      <td
                        style={{
                          backgroundColor: `${(!row.actions && row.color) ||
                            (row.actions &&
                              row.color &&
                              columnIndex < allColumnIds.length - 1)
                            ? row.color
                            : ''
                            }`,
                        }}
                      >
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
        rows.length > 0 &&
        paginationProps &&
        paginationProps.itemsPerPage < paginationProps.totalItems && (
          <Pagination {...paginationProps} />
        )}
    </>
  );
};

export default SimpleTable;
