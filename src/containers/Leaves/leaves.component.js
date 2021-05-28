import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Button, Form, Col } from 'react-bootstrap';
import { Helmet, ModalInput, DropdownInput, TextInput } from '../../components/FormInputs';
// import Table from '../../components/ReactTable/simpletable.component';
// import AuthApi from '../../helper/authApi';
// import Api from '../../helper/api';
// import customFunctions from '../../helper/customFunctions';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

const items = [
    { to: '/', label: 'Home' },
    { to: '/leaves', label: 'Leaves' },
  ];

function Leaves() {
//   const [rows, setRows] = useState([]);
  const [showButton, setShowButton] = useState(1);
  const [title, setTitle] = useState('');
  const [cntClearFilter, setCntClearFilter] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState('');

  const LeaveList = [
    {
      id: 1,
      value: 'Management',
      label: 'Casual Leave(CL)',
    },
    {
      id: 2,
      value: 'Development',
      label: 'Sick Leave(SL)',
    },
    {
      id: 3,
      value: 'Design',
      label: 'Loss of Pay(LOP)',
    }
  ];
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     itemsPerPage: 10,
//     totalItems: 10,
//   });

//   const columns = [
//     {
//       id: 'no',
//       label: 'Sr. No',
//       roleAccess: [1, 2, 3, 4],
//     },
//     {
//       id: 'task',
//       label: 'Todays Task',
//       roleAccess: [1, 2, 3, 4],
//     },
//     {
//       id: 'project',
//       label: 'Project',
//       roleAccess: [1, 2, 3, 4],
//     },
//     {
//       id: 'status',
//       label: 'Status',
//       roleAccess: [1, 2, 3, 4],
//     },
//     {
//       id: 'eta',
//       label: 'ETA',
//       roleAccess: [1, 2, 3, 4],
//     },
//     {
//       id: 'at',
//       label: 'AT',
//       roleAccess: [1, 2, 3, 4],
//     },
//   ];

//   const getTableData = async (pageNo = 0) => {
//     const page = pageNo || pagination.current_page;
//     const dt = customFunctions.getDate(
//       new Date(Number(props.match.params.date))
//     );
//     const userId = props.match.params.id;
//     const endPoint = `${Api.dailyReportUrl}`;
//     const params = {
//       page,
//       limit: pagination.itemsPerPage,
//       date: dt,
//       user_id: userId,
//     };
//     const url = customFunctions.generateUrl(endPoint, params);

//     const { data } = await AuthApi.getDataFromServer(url);
//     if (!customFunctions.checkIfEmpty(data, 'O')) {
//       setPagination({
//         activePage: data.paginator.current_page,
//         itemsPerPage: pagination.itemsPerPage,
//         totalItems: data.paginator.total_count,
//       });

//       const row = [];
//       const reportData = showButton
//         ? data.data.morning_data
//         : data.data.evening_data;
//       reportData.map((proj, i) => {
//         const setRowData = {
//           no: (page - 1) * pagination.itemsPerPage + (i + 1),
//           task: proj.activity,
//           project: proj.project_name,
//           status: proj.status,
//           eta: proj.duration,
//           at: proj.end_date,
//         };
//         row.push(setRowData);
//         return proj;
//       });
//       setRows(row);
//     }
//   };

const getLeaves = () => {
  if (!LeaveList) return [];
  const leaves = [];
  LeaveList.map((leave) => {
    return leaves.push({
      label: leave.label,
      id: leave.id,
      value: leave.value,
    });
  });
  return leaves;
};


  useEffect(() => {
    // getTableData();
    getLeaves();
    setTitle('Projects');
  }, []);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Projects</h2>
        <Breadcrumb items={items} />
      </div>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
            <div>
              <Button
                  type="button"
                  onClick={() => {
                    setShowButton(1);
                    setCntClearFilter(cntClearFilter + 1);
                  }}
                  variant={showButton ? 'primary ml-1' : ''}
                >
                  Leaves
                </Button>
             
                <Button
                  type="button"
                  onClick={() => {
                    setShowButton(0);
                    setCntClearFilter(cntClearFilter + 1);
                  }}
                  variant={!showButton ? 'primary ml-1' : ''}
                >
                
                  Holidays
                </Button>
               <div>
               <h5>09/18 Leaves</h5>

               </div>
               <Button
                  type="button"
                  className="pull-right align-items-center justify-content-end"
                  onClick={() => {setModalShow(true)}}
                 
                >
                  Apply Leaves
                </Button>
               
                  </div>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <ModalInput
        size="lg"
        centered
        show={modalShow}
        label='Add Employee'
        id="contained-modal-title-vcenter"
        modalBody={
          <Form>
            <Row>
              <Col sm={4}>
                <DropdownInput
                  label="Leave Type"
                  asterisk="*"
                  options={getLeaves()}
                  placeholder="Select Leave"
                  defaultValue={selectedLeave}
                  onSelectHandler={(select) => {
                    setSelectedLeave(select);
                  }}
                />
              </Col>
              <Col sm={4}>
              <DropdownInput
                  label="Reason"
                  // asterisk="*"
                //   options={getEmployeeList()}
                  placeholder="Select Reason"
                //   defaultValue={selectedEmployee}
                //   onSelectHandler={(select) => {
                //     setSelectedEmployee(select);
                //     updateData(select);
                //   }}
                />
              </Col>
              <Col sm={4}>
              <DropdownInput
                  label="Type"
                  // asterisk="*"
                //   options={getEmployeeList()}
                  placeholder="Select Type"
                //   defaultValue={selectedEmployee}
                //   onSelectHandler={(select) => {
                //     setSelectedEmployee(select);
                //     updateData(select);
                //   }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
              <TextInput
                //   onInputChange={(e) => {
                //     const re = /^[0-9\b]+$/;
                //     if (e.target.value === '' || re.test(e.target.value)) {
                //       setMobile(e.target.value);
                //     }
                //   }}
                  name="mobile"
                  label="Contact Number"
                  asterisk="*"
                  containerClass="form-group contact-number"
                  id="inlineFormInputGroup"
                  inputVarible="+91"
                  inputClass="form-control"
                //   value={mobile}
                  maxlength="10"
                  preValueClass="contact-number"
                  placeholder="9876576894"
                //   errorMessage={validator.message(
                //     'mobile',
                //     mobile,
                //     'required|phone|max:10'
                //   )}
                />
                
              </Col>
            </Row>
          </Form>
        }
        modalFooter={
          <div className="float-end">
            <Button variant="secondary">
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              className="ms-4"
            //   onClick={(e) => onSubmit(e)}
            >
             Add Leave
            </Button>
          </div>
        }
      />
    </>
  );
}

export default withRouter(Leaves);
