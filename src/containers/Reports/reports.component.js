import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, ProgressBar, Button } from 'react-bootstrap';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import constants from '../../helper/constants';
import EveningReport from './eveningReport.component';

const columns = [
  {
    id: 'task',
    label: 'Todays Task',
  },
  {
    id: 'project',
    label: 'Project',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'eta',
    label: 'ETA',
  },
  {
    id: 'at',
    label: 'AT',
  }
];

function Reports() {
  const [rows, setRows] = useState([]);
  const [showButton, setShowButton] = useState(1);
  const [showEvngReport, setShowEvngReport] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    itemsPerPage: 5,
    totalItems: 10,
  });

  // const onRtSupport = async (id) => {
  //   const endPoint = `${Api.getProjects}${id}/`;
  //   const { data } = await AuthApi.getDataFromServer(endPoint);

  // };

  const getTableData = async (pageNo = 0) => {
    const page = pageNo || pagination.current_page;
    const endPoint = `${Api.getProjects}?page=${page}&limit=${pagination.itemsPerPage}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data && data.data) {
      setPagination({
        activePage: data.paginator.current_page,
        itemsPerPage: data.paginator.limit,
        totalItems: data.paginator.total_count,
      });

      const row = [];

      data.data.map((proj) => {
        row.push({
          name: proj.name,
          spend: proj.spend,
          allocated: proj.allocated,
          completed: proj.completed,
          remaining: proj.remaining,
          support:
            proj.rt_support !== false ? (
              <Image src="/images/success.svg" />
            ) : (
              <Image
                src="/images/fail.svg"
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   onRtSupport(proj.id);
                // }}
              />
            ),
          completion: <ProgressBar variant="success" now={proj.completion} />,
          link: (
            <a href={`${constants.link}${proj.tw_id}`}>
              <span>
                <Image src="/images/redirect.png" />
              </span>
              {/* {proj.tw_id} */}
            </a>
          ),
        });
        return proj;
      });
      setRows(row);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const onMorningReport = () => {
    setShowButton(1);
    setShowEvngReport(false);
  };

  const onEveningReport = () => {
    setShowButton(0);
    setShowEvngReport(true);
  };

  // onRegularExpense = () => {
	// 	// e.preventDefault();
	// 	const { expense_type } = this.state;
	// 	this.setState({
	// 		expense_type: "1"
	// 	})
	// 	var $this = this;
	// 	$this.props.history.push('/add-newexpense');
	// }

  return (
    <>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
            <div>Reports: 16/04/2021</div>
              <div className="light-bg buttons d-flex align-items-center mt-3">
              {/* <button onClick={this.onRegularExpense} style={{ backgroundColor: this.state.expense_type == 1 ? "black" : "" }} className="btn btn-outline-secondary">
														Regular Expenses
                          </button> */}
				        	<Button type="button" onClick={() => onMorningReport()} variant= { showButton === 1 ? 'primary ml-1' : ''} >Morning Report</Button>
				        	<Button type="button" onClick={() => onEveningReport() } variant= { showButton === 0 ? 'secondary ml-1' : ''} >Evening Report</Button>
				        </div>
        
              <Col className="mt-3">

              {showEvngReport=== true ? 
                <EveningReport />
                :
                <Table
                  tableClass="table table-striped"
                  columns={columns}
                  rows={rows}
                  showPagination
                  showCheckbox
                  paginationProps={{
                    ...pagination,
                    onPageChange: (pageNo) => {
                      getTableData(pageNo);
                    },
                  }}
                />
                }
               </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(Reports);
