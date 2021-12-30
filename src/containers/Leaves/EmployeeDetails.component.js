import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Button } from 'react-bootstrap';
import CustomTable from 'stark-custom-datatable';
import customFunctions from '../../helper/customFunctions';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Loader from '../../components/Loader/index';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

function EmployeeDetails(props) {
  const { match } = props;
  const year = customFunctions.getLocalStorage('year');
  // Declare columns
  const columns = [
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: 'total_leaves',
      label: 'Allocated',
    },
    {
      id: 'total_leave_taken',
      label: 'Taken',
    },
    {
      id: 'pending_leave',
      label: 'Pending',
    },
    {
      id: 'unpaid_leave',
      label: 'Unpaid',
    },
  ];

  // Declare variable
  const [rowData, setRowData] = useState([]);
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const items = [
    { to: '/', label: 'Home' },
    { label: 'Employee Leaves Report' },
  ];

  // Declare methods
  const getRowData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leavesCountUrl}`;
    const params = {
      user: match.params.viewId,
      year,
      type:'all'
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      if(data && data.data){
        setName(data.data[0].name);
      }
      setRowData((data && data.data) || []);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    setTitle('Employee Leaves Report');
    if(match && match.params){
      getRowData();
    }
  }, [match]);

  const getExportCSV = async () => {
    setShowLoader(true);
    const endPoint = `${Api.leaveExportCSVUrl}`;
    const params = {
      employee: match.params.viewId,
      year,
    };
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      window.open(`https://developmentapi.starkdigital.in/${data.data.csv_path}`, '_blank');
    } else {
      setShowLoader(false);
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">
          Leaves Report
        </h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card className="schedular">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">{name} Leaves Report</h5>
              <div className="float-right">
                <Button
                  title="Download Report"
                  onClick={() => {
                    getExportCSV();
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Download Report
                </Button>
                <Link
                  to={{ pathname: '/employee-leaves' , reportTable:true}}
                  type="button"
                  onClick={()=> customFunctions.removeLocalStorage('year')}
                  className="btn btn-primary ms-3"
                >
                  Back
                </Link>
              </div>
            </div>
            <hr />
            <CustomTable
              columns={columns}
              rows={rowData}
              tableClass="table-striped"
              showPagination={false}
              // paginationProps={{
              //   totalItems: totalCount,
              //   itemsPerPage: limit,
              //   activePage: currentPage,
              //   onPageChange: (pageNo) => {
              //     getRowData(pageNo);
              //   },
              // }}
              emptyRender={() => {
                return 'No record found.';
              }}
            />
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default withRouter(EmployeeDetails);
