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


const items = [{ to: '/', label: 'Home' }, { label: 'Configure Settings' }];

const ConfigureSettings = () => {
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, itemsPerPage: 10, totalItems: 10 });
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [settingId, setSettingId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedType, setType] = useState({ label: 'All Type', value: 'all_type' });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all_employess');
  const [apiCalled, setApiCalled] = useState(false);
  const [joiningDate, setJoiningDate] = useState(null);
  const [refereshPage, setRefereshPage] = useState(false);
  const [setTable, setTableToggle] = useState(false);
  const [title, setTitle] = useState('');

  const [allEmployes, setAllEmployes] = useState([{ label: 'All type', value: 'all_type' }]);

  const allType = [
    { label: "Incomplete Estimations Cron", value: 1 },
    // { label: "Test One", value: 2 },
    // { label: "Test Three", value: 3 },
    // { label: "Test Four", value: 4 },
  ]

  useEffect(() => {
    setTitle("Configure Settings");
    if (!apiCalled) {
      setRefereshPage(false)
      getSettingsDetails(currentPage);
    }
  }, [currentPage, refereshPage]);

  const getSettingsDetails = async (pageNo = 1) => {
    if (apiCalled) return;

    setApiCalled(true);
    setShowLoader(true);

    const params = {
      page: pageNo,
      limit,
      sort_direction: 'descending',

    };

    if (selectedType?.value != 'all_type') {
      params.event_type = selectedType?.value
    }

    const url = customFunctions.generateUrl(Api.configureSetting, params);
    try {
      const { data } = await AuthApi.getDataFromServer(url);
      setShowLoader(false);

      if (data && data.success) {
        const finalData = data.data.map((item, index) => ({
          no: (pageNo - 1) * pagination.itemsPerPage + (index + 1),
          id: item.id,
          created_at: item?.created_at,
          title: item?.title,
          description: item?.description,
          event_time: item?.event_time,
          event_type: item?.event_type,
          event_type_name: item?.event_type_name,
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
      } else {
        swal(data.message || 'Error fetching data', '', 'error');
      }
    } catch (error) {
      swal('Error fetching data', '', 'error');
    } finally {
      setShowLoader(false);
      setApiCalled(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    getSettingsDetails(1);
  };


  const formatDate = (dateString) => {
    // Convert the backend date string to a Date object
    const date = new Date(dateString);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format time as hh:mm AM/PM
    return `${hours}:${formattedMinutes} ${ampm}`;
  }


  const columns = [
    { id: 'no', label: 'SR No' },
    {
      id: 'created_at',
      label: 'Created On Date',
      render: (row) => row.created_at ? customFunctions.getDate(row.created_at) : 'N/A',
    },

    {
      id: 'title',
      label: 'Title',
      render: (row) => row.title || '-',
    },

    {
      id: 'description',
      label: 'Description',
      render: (row) => row.description || '-',
    },

    {
      id: 'event_time',
      label: 'Event Time',
      render: (row) => row.event_time ? formatDate(row.event_time) : '-',
    },

    {
      id: 'event_type',
      label: 'Event Type',
      render: (row) => row.event_type_name || '-',
    },

    {
      id: 'action',
      label: 'Action',
      render: ({ id, created_at, to_user_id, to_user }) => (
        <>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push("/configure-settings", { state: { settingId: id } });
            }}
          >
            <Image src="/images/edit.svg" alt="view icon" style={{ filter: "invert(64%) sepia(24%) saturate(639%) hue-rotate(164deg) brightness(97%) contrast(95%)" }} />

          </a>
          <a
            href="/"
            className="ml-1"
            onClick={(e) => {
              e.preventDefault();
              setShowDelete(true);
              setSettingId(id);
            }}
          >
            <Image src="/images/delete.png" alt="Delete" />
          </a>
        </>
      ),
    },
  ];

  const deleteTask = async () => {
    const url = customFunctions.generateUrl(`${Api.configureSetting}${settingId}`);
    const { data } = await AuthApi.deleteDataFromServer(url);
    if (data.success) {
      swal('Deleted successfully', '', 'success').then(() => {
        setShowDelete(false);
        setType()
        setJoiningDate(null)
        setRefereshPage(true)

      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">Configure Settings</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <Card>
        <Card.Body>
          <Row>
            <Col sm={2}>
              <DropdownInput
                options={allType}
                defaultValue={selectedType}
                onSelectHandler={(select) => {
                  setType(select);
                  setSelectedEmployeeId(select?.value);
                }}
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={applyFilters}>Apply</Button>
              <Button variant="secondary" onClick={() => {
                setType({ label: 'All Type', value: 'all_type' })
                // setSelectedEmployeeId('all_employess')
                // setJoiningDate(null)
                // setSetSelectedMonth(null)
                // setApiCalled(false)
                // setRowData([])
              }

              } className='ml-3'>
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-end">

            {!setTable && (
              <a
                href="#"
                onClick={() => {
                  setTableToggle(false);
                  history.push('/configure-settings');
                }}
                className="btn-link"
              >
                Configure Setting
              </a>
            )}
          </div>
          <CustomTable
            columns={columns}
            rows={rowData}
            showPagination={true}
            paginationProps={{
              totalItems: totalCount,
              itemsPerPage: limit,
              activePage: pagination.current_page,
              onPageChange: (page) => {
                console.log("Page", page);

                setCurrentPage(page), setApiCalled(false)
              },
            }}
          />
        </Card.Body>
      </Card>

      {showDelete && (
        <SweetAlert
          warning
          showCancel
          title="Are you sure you want to delete?"
          confirmBtnText="Yes, Delete"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="light"
          onConfirm={() => {
            deleteTask();
            setShowDelete(false);
          }}
          onCancel={() => {
            setShowDelete(false);
          }}
        />
      )}
    </>
  );
};

export default ConfigureSettings;
