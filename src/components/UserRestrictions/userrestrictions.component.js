import React, { useEffect, useState } from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;

  const [roleID, setRoleID] = useState(null);
  const [departmentID, setdepartmentID] = useState(null);
  const [isManager, setIsManager] = useState(null);

  useEffect(() => {
    const roleId = customFunctions.getLocalStorage('group');
    setRoleID(JSON.parse(roleId));
    const departmentId = customFunctions.getLocalStorage('department');
    setdepartmentID(JSON.parse(departmentId));
  }, []);

  useEffect(() => {
    const isProjectManager =
      customFunctions?.getLocalStorage('isProjectManager');
    setIsManager(JSON.parse(isProjectManager));
  }, [customFunctions?.getLocalStorage('isProjectManager')]);

  const childRoute =
    children &&
    children.props &&
    children.props.children &&
    children.props.children[0] &&
    children.props.children[0].props &&
    children.props.children[0].props.to;

  const subChildRoute =
    children &&
    children.props &&
    children.props.children &&
    children.props.children.props &&
    children.props.children.props.to;
  
    const childrenArr = [
    '/archived-project',
    '/interview-listing',
    '/recruitment',
    '/current-project',
    '/scheduler',
    '/team-scheduler',
  ];
  const childArr = ['/projects'];
  const childProjectArr = ['/scheduler', '/team-scheduler'];

  const hasPermissions =
    (Number(roleID) === 1 && isManager && permittedUsers && permittedUsers.length && permittedUsers.includes(Number(roleID))) 
    || 
    (Number(roleID) === 1 && !isManager) 
    || 
    (permittedUsers && permittedUsers.length && permittedUsers.includes(Number(roleID))); // Normal permission check

  if (
    Number(roleID) === 4 &&
    Number(departmentID) !== 7 &&
    Number(departmentID) !== 8 &&
    childRoute === '/emp-timesheet'
  ) {
    return <></>;
  }

  if (
    Number(roleID) === 4 &&
    Number(departmentID) === 7 &&
    childrenArr.includes(childRoute)
  ) {
    return <></>;
  }

  if (
    Number(roleID) === 4 &&
    Number(departmentID) === 7 &&
    (childrenArr.includes(subChildRoute) || !childRoute)
  ) {
    return <></>;
  }

  if (
    Number(roleID) === 4 &&
    Number(departmentID) === 8 &&
    childArr.includes(childRoute)
  ) {
    return <></>;
  }

  if (
    Number(roleID) === 4 &&
    (Number(departmentID) === 2 ||
      Number(departmentID) === 3 ||
      Number(departmentID) === 4 ||
      Number(departmentID) === 5 ||
      Number(departmentID) === 6 ||
      Number(departmentID) === 7) &&
    childProjectArr.includes(childRoute)
  ) {
    return <></>;
  }

  return <>{hasPermissions && <>{children}</>}</>;
}
