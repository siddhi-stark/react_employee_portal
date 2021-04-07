import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Image, ProgressBar } from 'react-bootstrap';
import Table from '../../components/Table/simpletable.component';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';

const columns = [
  {
    id: 'name',
    label: 'Project Name',
  },
  {
    id: 'spend',
    label: 'Spend',
  },
  {
    id: 'allocated',
    label: 'Allocated',
  },
  {
    id: 'remaining',
    label: 'Remaining',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
  {
    id: 'completion',
    label: 'Completion',
  },
  {
    id: 'support',
    label: 'RT Support',
  },
  {
    id: 'link',
    label: 'TW Link',
  },
];

function Projects() {
  const [rows, setRows] = useState([]);
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
            <a href={`constants.link${proj.tw_id}`}>
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

  return (
    <>
      <div className="mt-3">
        <Card>
          <Card.Body>
            <Row>
              <div>Projects</div>
              <Col className="mt-3">
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
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default withRouter(Projects);
