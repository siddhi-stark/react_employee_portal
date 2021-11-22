import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { Helmet } from '../../components/FormInputs';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';
import Loader from '../../components/Loader/index';

const items = [
  { to: '/', label: 'Home' },
  { to: '/project', label: 'Project Fetch' },
];

function ProjectFetch() {
  const title = 'Project Fetch';
  const history = useHistory();
  const [isShowLoader, setShowLoader] = useState(false);

  const getProjectData = async () => {
    setShowLoader(true);
    const endPoint = `${Api.fetchTeamworkDataUrl}`;
    const url = customFunctions.generateUrl(endPoint);
    const { data, message } = await AuthApi.getDataFromServer(url);
    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      }).then(() => {
        swal.close();
        history.push('/');
      });
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
        <h2 className="main-content-title tx-24 mg-b-5">Project Fetch</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <div className="mt-5">
          <Card className="text-center">
            <Card.Body>
              <h5 className=" mt-2 mb-3">
                Did you want to fetch Teamwork Projects ?
              </h5>
              <Button
                variant="primary"
                type="submit"
                onClick={() => getProjectData()}
              >
                Apply
              </Button>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}

export default withRouter(ProjectFetch);
