/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import swal from 'sweetalert';
import customFunctions from '../../helper/customFunctions';

const items = [{ to: '/', label: 'Home' }, { label: 'App Settings' }];

// Role options with their IDs and names
const roleOptions = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Team Lead' },
  { id: 4, name: 'Employee' },
  { id: 5, name: 'HR' },
  { id: 6, name: 'HR Team Lead' },
  { id: 7, name: 'System Admin' },
  { id: 8, name: 'Accountant' },
  { id: 10, name: 'Other' },
];

function AppSettings() {
  const [isShowLoader, setShowLoader] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [settingId, setSettingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data } = await AuthApi.getDataFromServer(Api.settingsUrl);
      
      if (data && data.data) {
        // API returns array, get the first setting or find by id if needed
        // Based on backend response structure: { id, is_add_task_enabled, roles_can_add_task }
        const setting = Array.isArray(data.data) ? data.data[0] : data.data;
        
        if (setting && setting.id) {
          setSettingId(setting.id);
          // Handle roles_can_add_task array
          if (setting.roles_can_add_task && Array.isArray(setting.roles_can_add_task)) {
            setSelectedRoles(setting.roles_can_add_task);
          } else {
            // Default to empty array if not provided
            setSelectedRoles([]);
          }
        } else {
          // Setting doesn't exist, default to empty array
          setSelectedRoles([]);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      swal('Error', 'Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === roleOptions.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roleOptions.map((role) => role.id));
    }
  };

  const handleSave = async () => {
    setShowLoader(true);

    try {
      const payload = {
        is_add_task_enabled: selectedRoles.length > 0,
        roles_can_add_task: selectedRoles,
      };

      let response;
      if (settingId) {
        // Update existing setting
        response = await AuthApi.putDataToServer(
          `${Api.settingsUrl}${settingId}/`,
          payload
        );
      } else {
        // Create new setting
        response = await AuthApi.postDataToServer(Api.settingsUrl, payload);
        if (response.data && response.data.data && response.data.data.id) {
          setSettingId(response.data.data.id);
        }
      }

      if (response && response.data) {
        swal('Success', 'Settings updated successfully', 'success');
        // Dispatch event to notify other components
        document.dispatchEvent(new Event('SettingsUpdate'));
      } else {
        throw new Error('Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      swal('Error', 'Failed to update settings', 'error');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      <Helmet title="App Settings" />
      <div className="title-breadcrumb-section">
        <h2 className="main-content-title tx-24 mg-b-5">App Settings</h2>
        <Breadcrumb items={items} />
      </div>
      <Loader showLoader={isShowLoader || isLoading} needFullPage={false} />

      <section className="content-area">
        <Card>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="card-title mb-0 mt-2">Application Settings</h5>
            </div>
            <hr />

            <Row>
              <Col md={12}>
                <div className="p-3 border rounded">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="mb-1">Add Task Button - Role Permissions</h6>
                      <p className="text-muted mb-0 small">
                        Select which roles can see and use the "Add Task" button in the ToDo List
                      </p>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSelectAll}
                      disabled={isLoading}
                    >
                      {selectedRoles.length === roleOptions.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <Row>
                      {roleOptions.map((role) => (
                        <Col md={4} sm={6} key={role.id} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`role-${role.id}`}
                            label={role.name}
                            checked={selectedRoles.includes(role.id)}
                            onChange={() => handleRoleToggle(role.id)}
                            disabled={isLoading}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={isLoading || isShowLoader}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}

export default AppSettings;

