import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Tabs, Tab, Image, ProgressBar, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { Helmet } from '../../components/FormInputs';
import Personal from './personal.component';
import EducationalDetails from './educational.component';
import PreviousEmployement from './previousEmployement.component';
import EmployementHistory from './employementHistory.component';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function TemporaryAccount(props) {
  const title = 'Applications';
   const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  const verifyToken = async (tkn) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.temporaryAccountUrl}?token=${tkn}`
    );
    if (data) {
      // setEmail(data.data.email);
      console.log('data',data);
    }
    if (!data) {
      console.log('data',data);
      swal('Token is invalid', '', 'error');
      // props.history.push('/login');
    }
  };

  useEffect(() => {
    console.log('token',token)
    dispatch({ type: 'LOGIN', value: false });
    const matchUrltoken = props.match.params.token;
    console.log('matchUrltoken',matchUrltoken);
    setToken(matchUrltoken);
    if (!matchUrltoken) {
      window.location = '/login';
      console.log('toeknnnnnnnnnn')
    }
    verifyToken(matchUrltoken);
  }, [dispatch]);

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <section className="content-area">
          <div className="col-xl-12" id="main-content">
            <div className="employee-new-profile">
            <Button className="pull-right mb-3">Back</Button>
              <div className="profile-bg">
                <Image src="/images/image.png" alt="image" />
                <div className="profile-img">
                  <Image src={`${Api.s3UrlnoProfile}`} alt="Card image cap" />
                </div>
              </div>
              <h3>full_name</h3>
              <h5>designation_name</h5>
              <div className="table-projects">
                <div className="mt-4 card">
                  <div className="row">
                    <div className="col-md-4">
                      <h6>Email - email</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Contact No - mobile</h6>
                    </div>
                    <div className="col-md-4">
                      <h6>Pf Included - mobile</h6>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Profile Completion -</h6>
                    </div>
                    <div className="col-md-4">
                      <ProgressBar
                        bsPrefix="progress pbar"
                        variant="info"
                        now={60}
                        label="completed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                defaultActiveKey="Personal"
                // onSelect={(e) => handleSelect(e)}
                // id="uncontrolled-tab-example"
              >
                <Tab eventKey="Personal" title="Personal Documents">
                  <div className="row ml-2">
                    <Personal
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
                <Tab
                  eventKey="educational"
                  title="Educational Documents"
                  // disabled={isBI}
                >
                  <div className="row ml-2">
                    <EducationalDetails
                    // isBasicInfoId={isBasicInfoId}
                    // onProfDetInfo={(value) => {
                    //   setProfessionalInfo(value);
                    //   {(id) ? setIsPD(false) : setIsPD(true)} //eslint-disable-line
                    // }}
                    />
                  </div>
                </Tab>
                <Tab eventKey="employmentHistory" title="Employment History">
                  <div className="row ml-2">
                    <EmployementHistory
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
                <Tab eventKey="previousEmployment" title="Previous Employment">
                  <div className="row ml-2">
                    <PreviousEmployement
                    // onBasicInfo={(value) => {
                    //     setProfessionalInfo(value);

                    //   setBasicInfo(value);
                    //   setIsBI(false);
                    // }}
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default withRouter(TemporaryAccount);
