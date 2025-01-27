/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';
import SweetAlert from 'react-bootstrap-sweetalert';



const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const PredictionsDetails = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [rowData, setRowData] = useState([])
  const [showAddPopUp, setAddPopUp] = useState(false)
  const [showDeletePopUp, setDeletePopUp] = useState(false)
  const [reportId, setReportId] = useState()
  
  const [options, updateOptions] = useState({});
  const [selectedProject, setProject] = useState({label: 'All Projects', value: "all_projects"});


  useEffect(() => {
    setTitle('Milestone Predictions');
    if (userRole) {
      getPredictionsDetails();
      getProjectList()
    }
  }, [userRole]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
  }, []);

  const columns = [
    {
      id: 'no',
      label: 'Sr. No',
      roleAccess: [1],
    },
    {
      id: 'created_at',
      label: 'Report Generated At',
      roleAccess: [1],
      render: ({ created_at }) => {
        return (
          <>{created_at}</>)
      }
    }, {
      id: 'milestone_details',
      label: 'Milestone Details',
      roleAccess: [1],
      render: ({ milestone_details }) => {
        return (
          <>
            {milestone_details.length > 0 ? (
              <ul>
                {milestone_details.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No milestones available</p>
            )}
          </>
        );
      }
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1],
      render: ({ id, reports }) => {
        return (
          <>
            {
              reports.length > 0 ? (
                <>
                  <a
                    href="/"
                    className="pl-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      history.push("/predictions", { state: { id: id } })

                    }}
                  >
                    <Image src="/images/view-eye.svg" />
                  </a>
                </>
              ) : (
                <>
                  Processing.
                </>
              )
            }

            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setReportId(id)
                setDeletePopUp(true)
              }}
            >
              <Image src="/images/delete.png" />
            </a>
          </>
        );
      },
    },
  ];

  const deleteReport = async (id) => {
    setShowLoader(true);
    const url = `${Api.deletePredictionReports}${id}/`;
    const { data, error } = await AuthApi.deleteDataFromServer(url);

    if (data?.data) {
      swal(data && data.message[0], '', 'success');
      getPredictionsDetails(1)
      setShowLoader(false);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
  }

  const getPredictionsDetails = async (pageNo = 1) => {
    setShowLoader(true);
    const params = {
      page: pageNo,
      limit,
      sort_direction: 'descending',

    };

    // if(selectedProject && selectedProject.value !== "all_porjects"){
    //   params.project_id = +selectedProject?.value
    // }

    const url = customFunctions.generateUrl(Api.predictionDetails, params);    
    const { data } = await AuthApi.getDataFromServer(url, params);

    if (data?.data) {
      const finalData = data.data.map((item, index) => ({
        no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
        id: item.id,
        created_at: customFunctions.getDate(item?.generated_by),
        milestone_details: item.milestone_details,
        reports: item.reports

      }));

      const { current_page, total_count, limit } = data.paginator;
      setRowData(finalData);
      setPagination({
        current_page: parseInt(current_page, 10),
        totalItems: parseInt(total_count, 10),
        itemsPerPage: parseInt(limit, 10),
      });
      setTotalCount(total_count);
      setLimit(Number(limit));

      setShowLoader(false);
    } else {
      swal('Data not present.', '', 'error');
      setShowLoader(false);
    }
  };

  const getPredictions = async () => {
    setShowLoader(true);
    
    let params = {"use_ai":true,}

    if(selectedProject && selectedProject.value !== "all_porjects"){
      params.project_id = +selectedProject?.value
    }

    const url = customFunctions.generateUrl(Api.prediction, params);  
    const { data, message } = await AuthApi.getDataFromServer(url, params);
    if (data?.data) {
      swal(data?.data && data?.message[0], '', 'success');
      getPredictionsDetails(1)
      setShowLoader(false);
    } else {
      swal(message || 'Data not present for predictions.', '', 'error');
      setShowLoader(false);

    }
  };

  const getProjectList = async () => {
    const { data, message } = await AuthApi.getDataFromServer(
      `${Api.projectListUrl}?sort_by=name&status=active&type=all`
    );

    if (!data) {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    const dpOptions =
      (await data) &&
      data.data.length > 0 &&
      data.data.map((op) => {
        return { label: op.name, value: op.id };
      });

    options.project_id = dpOptions;
    await updateOptions(dpOptions);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="predictions-container">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title">Milestone Predictions</h2>
          <Breadcrumb items={items} />
        </div>
        <Loader showLoader={isShowLoader} needFullPage={false} />
        <Card className="prediction-card">
          <Row>
            <Col sm={2}>
              <DropdownInput
                // label="Team"
                placeholder ="Select Project"
                asterisk="*"
                options={options}
                defaultValue={selectedProject}
                onSelectHandler={(select) => {
                  setProject(select);
                }}
              />
            </Col>
            <Col>
              <Button onClick={(e) => {
                setAddPopUp(true)
              }}>Predict</Button>
            </Col>
          </Row>
          <hr />

          <Row>

            <CustomTable
              columns={columns}
              rows={rowData}
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: pagination.current_page,
                onPageChange: () => { },
              }}
            />
          </Row>
        </Card>
        {showAddPopUp && (
          <SweetAlert
            warning
            showCancel
            title="Are you sure you want to predict?"
            confirmBtnText="Submit"
            cancelBtnBsStyle="light"
            onConfirm={() => {
              getPredictions()
              setAddPopUp(false)

            }}
            onCancel={() => {
              setAddPopUp(false)
            }}
          />
        )
        }
         {showDeletePopUp && (
          <SweetAlert
            warning
            showCancel
            title="Are you sure you want to delete?"
            confirmBtnText="Delete"
            cancelBtnBsStyle="light"
            onConfirm={() => {
              deleteReport(reportId)
              setDeletePopUp(false)

            }}
            onCancel={() => {
              setDeletePopUp(false)
            }}
          />
        )
        }
      </div>
    </>
  );
};

export default PredictionsDetails;
