/* eslint-disable */
import React, { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Form } from "react-bootstrap";
import AuthApi from "../../helper/authApi";
import customFunctions from "../../helper/customFunctions";

const SelectAsyncPaginate = ({
  isClearable,
  value,
  clearSelected,
  onSelectChange,
  selectPlaceholder,
  key,
  className,
  disabled,
  isSearch,
  endpoint,
  apiname,
  isMulti,
  clearCacheOnID,
  clearSelectedByParent,
  label,
  asterisk,
  errorMessage,
  id,
  adminType,
  roleId,
  currentUserId,
  fromComponent,
  language
}) => {
  const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null);
  const [totalLoadLength, setTotalLoadLength] = useState(0);
  const [apiTotalCount, setApiTotalCount] = useState(0);
  
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (clearSelectedByParent) setSelectedValue({});
  }, [clearSelectedByParent]);

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const params = {
      page: page,
      limit: 10,
      search: `${searchQuery ? searchQuery.toLowerCase() : ""}`,
      roleId:
        ['clinicUrl', 'clinicUserUrl', 'referralComponentclinicUrl'].includes(apiname) ? Number(5) : apiname == "clientUrl" ? Number(3) : "",
      status: ['patientUrl', 'clinicUserUrl', 'referralComponentclinicUrl', 'doctorUrl'].includes(apiname) ? Number(1) : "",
      admin_type: apiname === "staffRoleAPIUrl" ? adminType : "",
      clinicId: apiname === 'patientUrl' && [5, 6].includes(roleId) ? currentUserId : "",
    };

    if(apiname == 'accountExecutiveUrl'){
      params.roleId = 8
    }

    if(apiname == "clientUrl2"){
      params.roleId = 3
    }

    if(apiname == "adminUrl"){
      params.roleId = 2
    }
    
    if(apiname == "employeeUrl"){
      params.old_employee = 'True'
    }
    const url = customFunctions.generateUrl(endpoint, params);

    if (!searchQuery && apiTotalCount !== 0 && apiTotalCount == totalLoadLength)
      return {
        options: [],
        hasMore: false,
      };

    const { data } = await AuthApi.getDataFromServer(url);
    let newdata = [];
    if (apiname === "regionUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        data.data.response.map((dt) => {
          dt.name = dt.name;
        });
        newdata = data.data.response;
        return {
          options: newdata,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }


    if (apiname === "lineItemUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        // data.data.response.map((dt) => {

        // });
        newdata = data.data.response;
        return {
          options: newdata,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "doctorUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        data.data.response.map((dt) => {
          dt.name = `${dt.first_name} ${dt.last_name}`;
        });
        newdata = data.data.response;
        return {
          options: newdata,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "clinicUrl" || apiname === 'referralComponentclinicUrl') {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let clinicData = [];
        data.data.response.map((dt) => {
          clinicData.push({
            name: `${dt.clinic_name}`,
            id: dt.id,
          });
        });
        return {
          options: clinicData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "clientUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let clinicData = [];
        data.data.response.map((dt) => {
          clinicData.push({
            name: `${dt?.organization_name}`,
            id: dt?.id,
          });
        });
        return {
          options: clinicData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "clinicUserUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let clinicData = [];
        data.data.response.map((dt) => {
          clinicData.push({
            name: `${dt.clinic_name}`,
            id: dt.id,
          });
        });
        return {
          options: clinicData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "clinictypeUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        data.data.response.map((dt) => {
          dt.name = dt.name;
        });
        newdata = data.data.response;
        return {
          options: newdata,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "staffRoleAPIUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        data.data.response.map((dt) => {
          dt.name = dt.name;
        });
        newdata = data.data.response.filter((item) => item.admin_type == adminType);
        return {
          options: newdata,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "patientUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let patientData = [];
        data.data.response.map((dt) => {
          patientData.push({
            name: `${dt.patient.first_name} ${dt.patient.last_name}`,
            id: dt.patientId,
            clientId: dt?.patient?.referral[0]?.clientId,
            uberService: dt?.patient?.uber_service,
            clinicalService:dt?.patient?.clinical_service
          });
        });
        return {
          options: patientData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "accountExecutiveUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let executiveData = [];
        data.data.response.map((dt) => {
          if(fromComponent == 'clientTable'){
            executiveData.push({
              name: `${dt?.first_name} ${dt?.last_name}`,
              id: dt?.id,
              clientId: dt?.clientId,
              uberService: dt?.uber_service
            });
            return
          }
          if(dt?.status == "1"){
            executiveData.push({
              name: `${dt?.first_name} ${dt?.last_name}`,
              id: dt?.id,
              clientId: dt?.clientId,
              uberService: dt?.uber_service
            });
          }
        });
        return {
          options: executiveData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "clientUrl2") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let executiveData = [];
        data.data.response.map((dt) => {
          executiveData.push({
            name: `${dt?.first_name} ${dt?.last_name}`,
            id: dt?.id,
            clientId: dt?.clientId,
            uberService: dt?.uber_service
          });
        });
        return {
          options: executiveData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }
    if (apiname === "employeeUrl") {
      if (
        data &&
        data.data &&
        data.data.length > 0
      ) {
        setApiTotalCount(data.paginator.total_count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.length)
        );
        let adminData = [];
        data.data.map((dt) => {
          if([1,7].includes(dt.role_id)) return
          adminData.push({
            name:dt.full_name,
            id:dt.id
          })
          // dt.name = `${dt.full_name}`;
          // dt.id = `${dt.id}`;

        });
        newdata = data.data;
        return {
          options: adminData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }

    if (apiname === "adminUrl") {
      if (
        data &&
        data.data &&
        data.data.response &&
        data.data.response.length > 0
      ) {
        setApiTotalCount(data.data.count);
        setTotalLoadLength(
          Number(totalLoadLength) + Number(data.data.response.length)
        );
        let adminData = [];
        data.data.response.map((dt) => {
          if(fromComponent == "executiveTable"){
            adminData.push({
              name: `${dt?.first_name} ${dt?.last_name}`,
              id: dt?.id,
            });
            return
          }

          if(dt?.status == "1"){
            adminData.push({
              name: `${dt?.first_name} ${dt?.last_name}`,
              id: dt?.id,
            });
          }
          });
        return {
          options: adminData,
          hasMore:
            Number(totalLoadLength) === Number(data.data.count) ? false : true,
          additional: {
            page: page + 1,
          },
        };
      } else {
        return {
          options: [],
          hasMore: false,
        };
      }
    }
  };

  const onSelectChangeData = (option) => {
    if (clearSelectedByParent) setSelectedValue(option);
    if (clearSelectedByParent) {
      setSelectedValue({});
    } else {
      setSelectedValue(option);
    }
    if (onSelectChange) {
      onSelectChange(option);
    }
  };
  
  const customStyles = {
    option: (styles, state) => ({
      ...styles,
      cursor: 'pointer',
    }),
    control: (styles) => ({
      ...styles,
      cursor: 'pointer',
    }),
  }

  return (
    <>
      {label && (
        <Form.Label>
          {" "}
          {label} <span style={{ color: "red" }}>
            {asterisk}
          </span>
          <span className="serviceNote">{fromComponent == 'addRefferal' &&
           language}
          </span>
        </Form.Label>
      )}
      <AsyncPaginate
        key={key}
        isMulti={isMulti}
        value={selectedValue}
        className={className}
        styles={customStyles}
        loadOptions={loadOptions}
        getOptionValue={(option) => option.name}
        getOptionLabel={(option) => option.name}
        onChange={onSelectChangeData}
        isDisabled={disabled}
        isSearchable={isSearch}
        placeholder={selectPlaceholder}
        isClearable={isClearable ? isClearable : false}
        cacheUniqs={[clearCacheOnID]}
        additional={{
          page: 1,
        }}
        inputId={id}
      />
      {errorMessage && <p style={{ color: "red" }}> {errorMessage} </p>}
    </>

  );
};

export default SelectAsyncPaginate;
