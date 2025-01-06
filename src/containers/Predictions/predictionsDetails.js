/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Helmet, DropdownInput, Datepicker } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import CustomTable from 'stark-custom-datatable';


const items = [{ to: '/', label: 'Home' }, { label: 'Milestone Predictions' }];

const PredictionsDetails = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState('');
  const [isProjectManager, setProjectManager] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setProjectManager(JSON.parse(isProjectManager));
  }, [localStorage.getItem('isProjectManager')]);

  useEffect(() => {
    setTitle('Milestone Predictions');
    if (userRole) {
      getPredictions();
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
      id: 'generated_by',
      label: 'Report Generated At',
      roleAccess: [1],
      render: ({ milestone_details }) => {
        return (
          <>
          {milestone_details?.map((item)=>{
            item
          })}
          </>)}
    },
    {
      id: 'action',
      label: 'Action',
      roleAccess: [1],
      render: ({ id }) => {
        return (
          <>
            <a
              href="/"
              className="pl-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

              }}
            >
              <Image src="/images/edit-button.svg" />
            </a>
            <a
              href="/"
              className="ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

              }}
            >
              <Image src="/images/delete.png" />
            </a>
          </>
        );
      },
    },
  ];

  const getPredictions = async (pageNo=1) => {
    setShowLoader(true);
    const params = {
      page: pageNo,
      limit,
      sort_direction: 'descending',

    };
    const url = `${Api.predictionDetails}`;
    const { data, error } = await AuthApi.getDataFromServer(url);

    // if (data?.data) {
    if (data?.data) {
      const finalData = data.data.map((item, index) => ({
        // no: (pagination.current_page - 1) * 10 + index + 1,
        no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
        id: item.id,
        generated_by: customFunctions.getDate(item?.generated_by),
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
      setCurrentPage(current_page);

      setShowLoader(false);
    } else {
      swal(error || 'Something went wrong', '', 'error');
      setShowLoader(false);

    }
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
            <Col>
              <Button onClick={(e) => {
                getPredictions()
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
                onPageChange: (page) => {

                  setCurrentPage(page)
                },
              }}
            />

          </Row>
        </Card>
      </div>
    </>
  );
};

export default PredictionsDetails;
