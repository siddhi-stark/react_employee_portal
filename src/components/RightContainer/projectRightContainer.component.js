/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import constants from '../../helper/constants';
import customFunctions from '../../helper/customFunctions';

function ProjectRightContainer(props) {
  const {
    name,
    projectStatus,
    startDate,
    endDate,
    totalHrsSpend,
    totalHrsEstimate,
    // totalHrsAllocated,
    projectCompletion,
    url,
    managerName,
  } = props;
    console.log("🚀 ~ ProjectRightContainer ~ endDate:", endDate)
  // const currentDate = new Date()
  // const projectEndDate = customFunctions.getDMYDate(endDate,"mdy")
  // const isLate = projectEndDate > currentDate;
  // console.log('isLate: ', isLate);
  const [buttonTitle, setButtonTitle] = useState('');
 
  var buttonText = null;
  if (projectStatus === false) {
    buttonText = 'Project in Delay';
  } else {
    buttonText = 'Project Ontrack';
  }

  useEffect(() => {
    setButtonTitle(projectStatus ? 'Project Ontrack' : 'Project in Delay');
  }, [projectStatus]);

  const buttonClass =
    buttonText === 'Project in Delay'
      ? 'mt-4 btn text-danger disabled-link'
      : 'mt-4 btn btn-primary disabled-link';
  return (
    <>
      <div className="project-info-box">
        <Card className="project-info-details">
          <Card.Body>
            <h4>Project Summary</h4>
            {!startDate && !endDate && (
              <h4 className="text-danger disabled-link">
                <a href="#" disabled className="mt-4 btn text-danger">
                  Please add project date.
                </a>{' '}
              </h4>
            )}
            {/* <div className="project-logo">
              <img
                src="/images/project.png"
                // src={imageProfile}
                alt="img"
              />{' '}
            </div> */}
            <h2>{name}</h2>
            <h2>{managerName}</h2>
            <ul className="list-unstyled p-0 project-information-total-hr">
              <li>
                Start Date:{' '}
                <strong>
                  {!startDate
                    ? '-'
                    : customFunctions.getDMYDateFormate(startDate, 'dmy')}
                </strong>
              </li>
              <li>
                End Date:{' '}
                <strong>
                  {!endDate
                    ? '-'
                    : customFunctions.getDMYDateFormate(endDate, 'dmy')}
                </strong>
              </li>
            </ul>
            <a href="#" disabled className={buttonClass}>
              {buttonTitle}
            </a>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <ul className="list-unstyled p-0 project-information-total-hr">
              {/* <li>
                Start Date: <strong>{!startDate ? '-' : startDate}</strong>
              </li>
              <li>
                End Date: <strong>{!endDate ? '-' : endDate}</strong>
              </li> */}
              <li>
                Total Hours Spent:{' '}
                <strong>
                  {totalHrsSpend ? totalHrsSpend.toFixed(2) : '0.0'}
                </strong>
              </li>
              <li>
                Total Hours Estimated:{' '}
                <strong>
                  {totalHrsEstimate ? totalHrsEstimate.toFixed(2) : '0.0'}
                </strong>
              </li>
              {/* <li>
                Total Hours Allocated:{' '}
                <strong>
                  {totalHrsAllocated ? totalHrsAllocated.toFixed(2) : '0.0'}
                </strong>
              </li> */}
              <li>
                Project Completion:{' '}
                <strong>
                  {projectCompletion ? `${projectCompletion}` : '0%'}
                </strong>
              </li>
              {/* <li>
                Team work URL:{' '}
                {url ? (
                  <a href={`${constants.project}${url}`} target="_blank">
                    <span>
                      <Image src="/images/redirect.png" />
                    </span>
                  </a>
                ) : (
                  <strong className="float-end">-</strong>
                )}
              </li> */}
            </ul>
            <hr />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
export default withRouter(ProjectRightContainer);
