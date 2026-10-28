/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import CustomTable from 'stark-custom-datatable';
import { withRouter, useHistory } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import StarkFormBuilder from 'stark-form-builder';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';
import FormSections from './applicationformschema.json';
import SearchFormSections from './searchFormschema.json';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import {
  getSurakshaEmbedConfig,
  resolveSurakshaBasesFromHandoff,
} from '../../helper/surakshaEmbedConfig';

// My Interviews → AI Screening consent only (not wellness).
const SURAKSHA_AI_SCREENING_PURPOSE = 'stark_recruitment.ai_screening';
const STAGING_API = 'http://115.160.211.220:8080/api/v1';
const STAGING_PUBLIC = 'http://115.160.211.220:8080';
const STAGING_SDK = 'http://115.160.211.220:8080/sdk/v1/consent.js';
// In-flight only (not session-permanent). Already-granted is handled by SDK skipPrompt.
let aiConsentInFlight = false;

function MyInterviews() {
  const group = customFunctions.getLocalStorage('group');
  const items = [{ to: '/', label: 'Home' }, { label: 'My Interviews' }];
  const history = useHistory();
  let defaultFilterOptions = {};
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(10);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [isShowLoader, setShowLoader] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [options, updateOptions] = useState({});
  const consentOpenedRef = useRef(false);

  // Suraksha: AI Screening notice only on this page (SSO required).
  useEffect(() => {
    if (consentOpenedRef.current || aiConsentInFlight) return undefined;
    // Lock before any await — prevents stacked notices (receipt over 2nd notice).
    consentOpenedRef.current = true;
    aiConsentInFlight = true;
    let cancelled = false;

    async function ensureSdk(sdkUrl, apiBase) {
      if (window.SurakshaConsentSDK && typeof window.SurakshaConsentSDK.init === 'function') {
        return window.SurakshaConsentSDK;
      }
      await new Promise(function (resolve, reject) {
        const existing = document.getElementById('suraksha-consent-sdk');
        if (existing) {
          existing.addEventListener('load', resolve);
          existing.addEventListener('error', reject);
          setTimeout(resolve, 2000);
          return;
        }
        const s = document.createElement('script');
        s.id = 'suraksha-consent-sdk';
        s.src = sdkUrl;
        s.async = true;
        s.setAttribute('data-tenant', 'stark');
        s.setAttribute('data-purpose', SURAKSHA_AI_SCREENING_PURPOSE);
        s.setAttribute('data-api-base', apiBase);
        s.setAttribute('data-locale', 'mr');
        s.setAttribute('data-auto-open', 'false');
        s.setAttribute('data-fail-mode', 'block');
        s.setAttribute('data-callback', 'onSurakshaConsent');
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      let tries = 0;
      while (
        !(window.SurakshaConsentSDK && typeof window.SurakshaConsentSDK.init === 'function') &&
        tries < 50
      ) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(function (r) { setTimeout(r, 100); });
        tries += 1;
      }
      return window.SurakshaConsentSDK;
    }

    async function getPrincipalToken(apiBase, publicBase) {
      const access = customFunctions.getLocalStorage('access_token');
      if (!access) return null;
      try {
        const portalApi2 = String(Api.baseUrl || 'http://127.0.0.1:8000/api/v1/').replace(
          /\/api\/v1\/?$/,
          '/api2/'
        );
        const hRes = await fetch(portalApi2 + 'consent/sso-handoff', {
          headers: { Authorization: 'Bearer ' + access },
        });
        if (!hRes.ok) {
          console.warn('[Suraksha] handoff', hRes.status);
          return null;
        }
        const h = await hRes.json();
        const bases = resolveSurakshaBasesFromHandoff(h, {
          isLocal: false,
          apiBase: apiBase,
          publicBase: publicBase,
        });
        const exRes = await fetch(bases.apiBase + '/citizen/auth/sso/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handoff: h.handoff }),
        });
        if (!exRes.ok) {
          console.warn('[Suraksha] exchange', exRes.status);
          return null;
        }
        const ex = await exRes.json();
        return ex.token || null;
      } catch (e) {
        console.warn('[Suraksha] SSO skipped (notice still opens)', e);
        return null;
      }
    }

    (async function openAiScreeningNotice() {
      try {
        const embed = getSurakshaEmbedConfig();
        const apiBase = embed.isLocal ? STAGING_API : embed.apiBase;
        const receiptVerifyBase = embed.isLocal ? STAGING_PUBLIC : embed.publicBase;
        const sdkUrl = embed.isLocal ? STAGING_SDK : embed.sdkUrl;
        const SDK = await ensureSdk(sdkUrl, apiBase);
        if (cancelled) return;
        if (!SDK || typeof SDK.init !== 'function') {
          console.error('[Suraksha] SDK missing — is Suraksha staging :8080 up?');
          return;
        }

        const principalToken = await getPrincipalToken(apiBase, receiptVerifyBase);
        if (cancelled) return;
        if (!principalToken) {
          throw new Error(
            'SSO exchange failed — no principal token (would fall back to email OTP)'
          );
        }

        const r = await fetch(
          apiBase +
            '/consent/sdk/resolve?tenant=stark&purpose=' +
            encodeURIComponent(SURAKSHA_AI_SCREENING_PURPOSE)
        );
        if (!r.ok) throw new Error('resolve ' + r.status);
        const resolved = await r.json();
        const purposeVersionId =
          resolved.purposeVersionId ||
          (resolved.data && resolved.data.purposeVersionId);
        if (!purposeVersionId) {
          throw new Error('missing purposeVersionId for ' + SURAKSHA_AI_SCREENING_PURPOSE);
        }
        if (cancelled) return;

        // Drop any leftover widgets (e.g. medical dialog still on body).
        const leftover = document.querySelectorAll('suraksha-consent');
        for (let i = 0; i < leftover.length; i += 1) {
          leftover[i].parentNode && leftover[i].parentNode.removeChild(leftover[i]);
        }
        console.log('[Suraksha] opening AI Screening notice (logged-in)', purposeVersionId);
        SDK.init({
          purposeVersionId: purposeVersionId,
          // Required for reuse panel + localStorage fallback (same purpose_module).
          purposeCode: resolved.purposeCode || SURAKSHA_AI_SCREENING_PURPOSE,
          allowedOrigins: [
            window.location.origin,
            'http://localhost:3002',
            'http://115.160.211.220:8090',
          ],
          apiBase: apiBase,
          receiptVerifyBase: receiptVerifyBase,
          locale: 'mr-IN',
          principalToken: principalToken,
          fiduciaryNameEn: resolved.fiduciaryNameEn || undefined,
          fiduciaryNameMr: resolved.fiduciaryNameMr || undefined,
          fiduciaryCrest: resolved.fiduciaryCrest || undefined,
          logoUrl: resolved.logoUrl || undefined,
        });
        // Release module lock after mount; this component instance stays locked via ref.
        // Remount can re-init; SDK skipPrompt hides dialog if already granted.
        aiConsentInFlight = false;
      } catch (e) {
        console.error('[Suraksha] My Interviews AI Screening consent failed', e);
        consentOpenedRef.current = false;
        aiConsentInFlight = false;
      }
    })();

    return function cleanup() {
      cancelled = true;
    };
  }, []);

  const formSchema = [...FormSections];
  formSchema[0].fields.map((section) => {
    const sectionData = section;
    if (sectionData.name === 'start_date' || sectionData.name === 'end_date') {
      const date = new Date();
      sectionData.maxDate = date;
    }
    if (Number(group) !== 6 && Number(group) !== 1) {
      if (sectionData.name === 'role_id') {
        sectionData.disabled = true;
      }
    }
    return sectionData;
  });

  const handleActionCallback = ({ id, status_name }) => {
    return (
      <>
        {status_name !== 'declined' ? ( //eslint-disable-line
          <a
            href="/"
            className="pl-2"
            title="Edit Applicant"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              customFunctions.setLocalStorage('applicantId', id);
              history.push(`/applications/${id}`, {
                statusObj: status_name,
                isInterview: true,
                pageType: 'My_Interview',
              });
            }}
          >
            <Image src="/images/edit-button.svg" />
          </a>
        ) : (
          <a
            href="/"
            className="pl-2"
            title="Show Note"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              customFunctions.setLocalStorage('isClicked', 'true');
            }}
          >
            <Image src="/images/notes.svg" />
          </a>
        )}
      </>
    );
  };

  const handleResumeCallback = ({ resume, name }) => {
    return (
      <>
        <span> {name} </span>
        {resume ? (
          <a
            href={resume}
            className="ms-2 pl-2"
            title="View Resume"
            target="_blank"
          >
            <Image src="/images/download-file.svg" />
          </a>
        ) : (
          ' '
        )}
      </>
    );
  };

  const columns = [
    {
      id: 'offered_ctc',
      label: 'offered ctc',
      isDisplay: false,
    },
    {
      id: 'joining_date',
      label: 'joining date',
      isDisplay: false,
    },
    {
      id: 'pf_included',
      label: 'pf included',
      isDisplay: false,
    },
    {
      id: 'id',
      label: 'Sr. No',
      isDisplay: false,
    },
    {
      id: 'interview_date', // eslint-disable-line
      label: 'Interview Date',
    },
    {
      id: 'name',
      label: 'Name',
      render: handleResumeCallback,
    },
    {
      id: 'applied_for_name',
      label: 'Position',
    },
    {
      id: 'notes',
      label: 'Note',
      isDisplay: false,
    },
    {
      id: 'status_name',
      label: 'Status',
      render: (status_name) => {
        const status = status_name;
        
        return (
          <>
            <span>
              {`${customFunctions.capitalizeFirstLetter(status.status_name)}`}
            </span>
          </>
        );
      },
    },
    {
      id: 'round_one',
      label: 'Round 1',
      render: (round_one) => {
        const categoryData = round_one.round_one; //eslint-disable-line
        return (
          <>
            <span>
              {
                `${categoryData.status_name}` //eslint-disable-line
              }
            </span>
          </>
        );
      },
    },
    {
      id: 'round_two',
      label: 'Round 2',
      render: (round_two) => {
        const categoryData = round_two.round_two; //eslint-disable-line
        return (
          <>
            <span>{categoryData.status_name}</span>
          </>
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      render: handleActionCallback,
    },
  ];

  const getRowData = async (pageNo = 1) => {
    setShowLoader(true);
    const page = pageNo || currentPage;

    const endPoint = `${Api.applicantsUrl}`;
    const filterList =
      filterData && !customFunctions.checkIfEmpty(filterData, 'O')
        ? customFunctions.jsonParse(filterData)
        : {};

    const params = {
      my_interview: true,
      page,
      limit,
      sort_direction: 'descending',
      sort_by: 'round_date',
      my_interview_round: 'true',
      ...filterList,
    };
    if(Number(group) === 1){
      params.is_admin_personal=1;
    }
    
    const url = customFunctions.generateUrl(endPoint, params);
    const { data, message } = await AuthApi.getDataFromServer(url);
    

    if (!customFunctions.checkIfEmpty(data, 'O') && data && data.success) {
      setShowLoader(false);
      setTotalCount(data.paginator.total_count);
      setLimit(data.paginator.limit);
      setCurrentPage(Number(data.paginator.current_page));

      const newInterwArr = await data.data.map((dt) => {
        if (dt.applicant_round_list && dt.applicant_round_list.length > 0) {
          dt.round_one = dt.applicant_round_list[0]; //eslint-disable-line
          dt.round_two = dt.applicant_round_list[1]; //eslint-disable-line
        }
        return dt;
      });

      const newData = [newInterwArr];
      newData.map((item, i) => {
        const newItem = item;
        newItem.no = (page - 1) * limit + (i + 1);
        return newItem;
      });

      setRowData(newInterwArr || []);
      
    } else {
      setShowLoader(false);
      swal(message, '', 'error');
    }
  };

  const getRoundsStatus = async () => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.InterviewRoundsUrl}?constant_type=applicant_status`
    );
    if (!data) {
      return;
    }

    const dpOptions = [];
    (await data.data) &&
      data.data.applicant_status.map((op) => {
        dpOptions.push({
          label: op?.name, // Capitalize first letter
          value: op.id,
        });
        return op;
      });
    const allOptions = {
      ...options,
      ...defaultFilterOptions,
      status_name: dpOptions,
    };
    
    defaultFilterOptions = { ...allOptions };
    updateOptions(allOptions);
  };

  useEffect(() => {
    getRowData(1);
    setTitle('Recruitment');
  }, [filterData]);

  useEffect(() => {
    getRoundsStatus();
  }, []);

  const submitForm = async (formValues) => {
    const capitalizeFirstLetter = (string) => {
      
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const payload = {
      keyword: formValues && formValues.keyword ? formValues.keyword : '',
      // status:
      //   formValues && formValues.status_name && formValues.status_name.value
      //     ? formValues.status_name.value
      //     : '',
      status:formValues?.status_name?.value 
      // formValues && formValues.status_name && formValues.status_name.value
      // ? capitalizeFirstLetter(formValues.status_name)
      // : '',
    };
    
    setFilterData(payload);
  };

  return (
    <>
      <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">My Interviews</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader} needFullPage={false} />
      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 ">Filters</h5>
            </div>
            <hr />
            <div className="filter-box-main">
              <StarkFormBuilder
                containerClass=""
                formHeaderClass=""
                formSections={SearchFormSections}
                formHeading=""
                options={options}
                onFormSubmit={(formValues) => {
                  // if (!formValues.keyword || !formValues.status_name) return;
                  submitForm(formValues);
                }}
                callbacks={{}}
                submitBtnText="Apply"
                showResetBtn={true}
                resetBtnText="Clear"
                showBtnClass={false}
                btnContainerClass="col-md-4 filter-apply-btns"
                formClass="row"
                isStepForm={false}
                onFormReset={() => {
                  if (filterData && !Object.keys(filterData).length) return;
                  setFilterData({});
                }}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0 mt-2 "> My Interviews</h5>
            </div>
            <hr />
            <CustomTable
              tableContainerClass="mt-2"
              columns={columns}
              rows={rowData}
              tableClass="table-striped"
              showPagination={true}
              paginationProps={{
                totalItems: totalCount,
                itemsPerPage: limit,
                activePage: currentPage,
                onPageChange: (pageNo) => {
                  getRowData(pageNo);
                },
              }}
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
export default withRouter(MyInterviews);
