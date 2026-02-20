/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Button, Card, Form, Col, Row } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import Api from '../../helper/api';
import { DropdownInput, Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import { TextInput, Datepicker } from '../../components/FormInputs';
import customFunctions from '../../helper/customFunctions';

function GenerateOfferLetter() {
  //state declared here
  const history = useHistory();
  const [currentUser, updateCurrentUser] = useState(0);
  const [fullName, setFullName] = useState('');
  const [joiningDate, setJoiningDate] = useState(null);
  const [designation, setDesignation] = useState([]);
  const [pfInclude, setPfInclude] = useState(false);
  const [miscellaneous_included, setMiscellaneousInclude] = useState(false);
  const [selectedDesignationOption, setSelectedDesignationOption] =
  useState(null);
  const [bonus, setBonus] = useState('');
  const [count, forceUpdate] = useState(0);
  const [emailBody, setEmailBody] = useState('');
  const [document, setDocument] = useState('');
  const [checked, setChecked] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [title, setTitle] = useState('');
  const items = [{ to: '/', label: 'Home' }, { label: 'Offer Letter' }];
  const isFresher = customFunctions.getLocalStorage('isFresher');
  const [OfferedCtc, setOfferedCtc] = useState('');

  const options = [
    {
      label: 'Yes',
      value: 'true',
    },
    {
      label: 'No',
      value: 'false',
    },
  ];
  const validator = useRef(
    new SimpleReactValidator({
      validators: {
        emailValidate: {
          message:
            'The :attribute domain name should be starkdigital.net.' ||
            'The :attribute domain name should be starkdigital.in.',
          rule: (val, params, valid) => {
            return (
              (valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.net$/i) ||
                valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.in$/i) ||
                valid.helpers.testRegex(val, /^[\w.+-]+@starkdigital.com$/i)) &&
              params.indexOf(val) === -1
            );
          },
        },
      },
    })
  );
    

  const onSelectRadioButton = (e) => {
    setPfInclude(e.target.value);
  };

  const onSelectRadio = (e) => {
    setMiscellaneousInclude(e.target.value);
  };

  const [candidateId, setCandidateId] = useState(null);

  useEffect(() => {
    const CandidateId = customFunctions.getLocalStorage('applicantId');
    setCandidateId(CandidateId);
    if (!CandidateId) {
      history.goBack();
      return;
    }
    setTitle('Offer Letter');
    const fName = customFunctions.getLocalStorage('applicantName');
    const designationName = customFunctions.getLocalStorage('designation');
    const OfferCtc = customFunctions.getLocalStorage('offerctc');
    const joining_Date = customFunctions.getLocalStorage('joiningdate');
    const PfInclude = customFunctions.getLocalStorage('pfInclude');
    const misInclude = customFunctions.getLocalStorage('misInclude');
    const bonus = customFunctions.getLocalStorage('bonus');

    setFullName(fName);
    // setDesignation(designationName);
    setOfferedCtc(OfferCtc && OfferCtc !== 'null' ? OfferCtc : null);
    setJoiningDate(
      joining_Date && joining_Date !== 'null' ? new Date(joining_Date) : null
    );
    setPfInclude(PfInclude);
    setMiscellaneousInclude(misInclude);
    setBonus(bonus && bonus !== 'null' ? bonus : null);
   
    // Fetch designation data and set default designation
   
        // const defaultDesignation = designation?.find((item) => item?.name === designationName);
        // console.log("🚀 ~ getDesignation ~ defaultDesignation:", defaultDesignation)
        // if (defaultDesignation) {
        //   setSelectedDesignationOption({
        //     label: defaultDesignation?.name,
        //     id: defaultDesignation?.id,
        //   });
        // }
     
  }, []);

  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
    getDesignation();
    getEmailTemplateData();
  }, []);
  
  // useEffect(() => {
  //   getEmailTemplateData();

  // },[selectedDesignationOption])

  const getDesignationList = () => {
    if (!designation) return [];
    const options = [];
    designation.map((desgn) => {  
      return options.push({
        label: desgn.name,
        id: desgn.id,
      });
    });
    return options;
  }
  
  const getDesignation = async () => {
    try {

      const designationName = customFunctions.getLocalStorage('designation');
      const { data } = await AuthApi.getDataFromServer(
        `${Api.designationUrl}?type=all`
      );
      
      if (!customFunctions.checkIfEmpty(data && data.data, 'A')) {
        const designationList = data.data;
        setDesignation(designationList);
        
        // Find the default designation after setting the state
        const defaultDesignation = designationList?.find(
          (item) => item?.name == designationName
        );
        
        if (defaultDesignation) {
          setSelectedDesignationOption({
            label: defaultDesignation?.name,
            id: defaultDesignation?.id,
          });
          customFunctions?.setLocalStorage('designation', selectedDesignationOption?.label)
        }
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };
  
  const getEmailTemplateData = async () => {
    const endPoint =
      isFresher === 'true'
        ? `${Api.emailTemplates}?name=Trainee Selection Letter`
        : `${Api.emailTemplates}?name=Offer Letter`;
    const { data, message } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setEmailBody(data.data.body);
    } else {
      swal(message, '', 'error');
    }
  };

  const checkValidation = (body, doc) => {
    if (validator.current.allValid()) {
      confirmAnnexure(body, doc);
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
    }
  };
  const confirmAnnexure = (body, doc) => {
    const reasonLabel = checked ? 'with' : 'without';
    swal({
      title: 'Are you sure?',
      text:
        isFresher === 'true'
          ? 'Do you want to send mail ?'
          : `Do you want to send mail ${reasonLabel} annexture ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: true,
      closeOnClickOutside: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result) {
        sendMail(body, doc);
      }
    });
  };

  const sendMail = async (body, doc, ctc) => {
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');
    const letterStatus =
      isFresher === 'true' ? 'Trainee Selection Letter' : 'Offer Letter';

    let EmailBody = '';
    const reasonLabel = checked ? 'with' : 'without';
    if (!checked) {
      const postData = {
        name: letterStatus,
        subject: letterStatus,
        applicant_id: Number(id),
        body: emailBody,
        joining_date: joiningDate ? customFunctions.getDate(joiningDate) : null,
        offered_ctc: Number(OfferedCtc),
        pf_included: pfInclude === 'true' ? true : false, // eslint-disable-line
        miscellaneous_included:
          miscellaneous_included === 'true' ? true : false,
      };

      const { data, message } = await AuthApi.postDataToServer(
        Api.generateContentUrl,
        postData
      );

      if (!customFunctions.checkIfEmpty(data, 'O') && data.data) {
        setShowLoader(false);
        EmailBody = data.data.body;
      } else {
        setShowLoader(false);
        swal(message, '', 'error', {
          closeOnClickOutside: false,
          allowOutsideClick: false,
        });
      }
    }
    setShowLoader(false);
    // swal({
    //   title: 'Are you sure?',
    //   text:
    //     isFresher === 'true'
    //       ? 'Do you want to send mail ?'
    //       : `Do you want to send mail ${reasonLabel} annexture ?`,
    //   icon: 'warning',
    //   dangerMode: true,
    //   buttons: true,
    //   closeOnClickOutside: false,
    //   allowOutsideClick: false,
    // })
    // .then(async (result) => {

    // if (result) {
    const postData = {
      name: letterStatus,
      applicant_id: Number(id),
      email_type: 'offer_letter',
      subject: letterStatus,
      body,
      joining_date: joiningDate ? customFunctions.getDate(joiningDate) : null,
      offered_ctc: Number(OfferedCtc),
      designation: selectedDesignationOption ? selectedDesignationOption?.id : '',
    };

    if (isFresher !== 'true') postData.attachment = checked ? doc : '';
    if (EmailBody) postData.body = EmailBody;

    const { data, message } = await AuthApi.postDataToServer(
      Api.sendMailUrl,
      postData
    );

    if (data) {
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        customFunctions.removeLocalStorage('applicantName');
        customFunctions.removeLocalStorage('designation');
        customFunctions.removeLocalStorage('offerctc');
        customFunctions.removeLocalStorage('joiningdate');
        customFunctions.removeLocalStorage('pfInclude');
        customFunctions.removeLocalStorage('misInclude');
        customFunctions.removeLocalStorage('isFresher');
        history.push('/recruitment');
        swal.close();
      });
    } else {
      swal(message, '', 'error', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
      });
    }
    // }
    // });
  };

  const submitForm = async () => {
    setShowLoader(true);
    const id = customFunctions.getLocalStorage('applicantId');

    const postData = {
      name: 'Offer Letter',
      subject: 'Offer Letter',
      applicant_id: Number(id),
      body: emailBody,
      generate_offer: Boolean(true),
      designation: selectedDesignationOption ? selectedDesignationOption?.id : '',
      offered_ctc: Number(OfferedCtc),
      pf_included: pfInclude === 'true' ? true : false, // eslint-disable-line
      miscellaneous_included: miscellaneous_included === 'true' ? true : false, // eslint-disable-line
      joining_date: joiningDate ? customFunctions.getDate(joiningDate) : null,
      bonus_amount: Number(bonus),
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.generateContentUrl,
      postData
    );
    // sendMailUrl
    if (data) {
      setShowLoader(false);
      swal(data && data.message[0], '', 'success', {
        closeOnClickOutside: false,
        allowOutsideClick: false,
        buttons: false,
        timer: 2000,
      }).then(() => {
        setDocument(data.data.attachement);
        setEmailBody(data.data.body);
        customFunctions.removeLocalStorage('applicantName');
        customFunctions.removeLocalStorage('designation');
        customFunctions.removeLocalStorage('offerctc');
        customFunctions.removeLocalStorage('joiningdate');
        customFunctions.removeLocalStorage('pfInclude');
        swal.close();
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
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Offer Letter</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />

      <div className=" justify-content-between mb-4">
        <Card>
          <Form
            className="mt-5 ms-3"
            onSubmit={(e) => {
              submitForm();
              setDocument('');
            }}
          >
            <Row>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z ]*$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setFullName(e.target.value);
                    }
                  }}
                  label="Full Name"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="firstNameTitle"
                  value={fullName}
                  disabled={candidateId}
                  placeholder="Enter Full  Name"
                  errorMessage={validator.current.message(
                    'Full Name',
                    fullName,
                    'required'
                  )}
                />
              </Col>
              <Col sm={6}>
              <DropdownInput
                  label="Designation"
                  asterisk="*"
                  options={getDesignationList()}
                  placeholder="Select Designation"
                  defaultValue={selectedDesignationOption} 
                  onSelectHandler={(select) => {
                    setSelectedDesignationOption(select);
                   customFunctions?.setLocalStorage('designation', select?.label);

                  }}
                  errorMessage={validator.current.message(
                    'Designation',
                    selectedDesignationOption,
                    'required'
                  )}
                />

                {/* <TextInput
                  onInputChange={(e) => {
                    const re = /^[a-zA-Z ]*$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setDesignation(e.target.value);
                    }
                  }}
                  label="Designation"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="designationTitle"
                  value={designation}
                  disabled={candidateId}
                  placeholder="Enter Designation"
                  errorMessage={validator.current.message(
                    'Designation',
                    designation,
                    'required'
                  )}
                /> */}
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Datepicker
                  label="Joining Date"
                  asterisk="*"
                  className="form-control"
                  selected={joiningDate}
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  maxDate={
                    new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000)
                  } // 120 days ahead
                  onChange={(e) => {
                    setJoiningDate(e);
                  }}
                  errorMessage={
                    // joiningDate &&
                    validator.current.message(
                      'Joining Date',
                      joiningDate,
                      'required'
                    )
                  }
                />
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="text-dark fs-6">
                    PF Included<span className="text-danger ms-2">*</span>
                  </Form.Label>
                  <div>
                    {options.map((option) => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        id={`pf_include-${option.value}`}
                        name="pfInclude"
                        value={option.value}
                        label={option.label}
                        checked={pfInclude == option.value}
                        onChange={onSelectRadioButton}
                        errorMessage={validator.current.message(
                          'pfInclude',
                          pfInclude,
                          'required'
                        )}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setOfferedCtc(e.target.value);
                    }
                  }}
                  autocomplete="off"
                  label="Offered CTC (In LPA)"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="offeredctcTitle"
                  maxlength="7"
                  value={OfferedCtc}
                  placeholder="eg.350000"
                  errorMessage={validator.current.message(
                    'OfferedCtc',
                    OfferedCtc,
                    'required|numeric|max:7|min:6'
                  )}
                />
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="text-dark fs-6">
                    Miscellaneous Included
                    <span className="text-danger ms-2">*</span>
                  </Form.Label>
                  <div>
                    {options.map((option) => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        id={`miscellaneous_included-${option.value}`}
                        name="miscellaneous_included"
                        value={option.value}
                        label={option.label}
                        checked={miscellaneous_included == option.value}
                        onChange={onSelectRadio}
                        errorMessage={validator.current.message(
                          'miscellaneous_included',
                          miscellaneous_included,
                          'required'
                        )}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <TextInput
                  onInputChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (!e.target.value || re.test(e.target.value)) {
                      setBonus(e.target.value);
                    }
                  }}
                  autocomplete="off"
                  label="Bonus"
                  asterisk="*"
                  containerClass="form-group"
                  type="text"
                  name="bonusTitle"
                  maxlength="10"
                  value={bonus}
                  placeholder="eg.5000"
                  errorMessage={validator.current.message(
                    'bonus',
                    bonus,
                    'required|numeric'
                  )}
                />
              </Col>
            </Row>
            {/* </Form> */}

            {isFresher !== 'true' && (
              <>
                <div className="d-flex align-items-center">
                  <input
                    onChange={(e) => {
                      setChecked(e.target.checked);
                    }}
                    name="checked"
                    type="checkbox"
                    id="checked"
                    className="form-submit-buttons ms-4"
                    value={checked}
                  />
                  <span className="ms-3 mb-0">
                    Do you want to send Annexure ?
                  </span>
                </div>
              </>
            )}
            {checked && (
              <Button className="ml-3 mt-3 mb-4 ms-3" onClick={submitForm}>
                Preview
              </Button>
            )}
          </Form>

          <div className="container">
            {document && checked && (
              <>
                <iframe
                  src={`${document}`}
                  title="Offer"
                  style={{ height: '500px', width: '500px' }}
                />
                <br />
              </>
            )}
            <Button
              className="mt-3 mb-4"
              disabled={checked && !document ? 'disabled' : ''}
              onClick={() => {
                /*  if (!joiningDate) {
                  swal('Please select joining date', '', 'error', {
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                  });
                } else { */
                checkValidation(emailBody, document);
                // }
              }}
            >
              Send Mail
            </Button>
            <Button
              variant="secondary"
              className="mt-3 mb-4 ms-2"
              onClick={() => history.push('/recruitment')}
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default withRouter(GenerateOfferLetter);
