import React, { useEffect, useState } from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;

  const [roleID, setRoleID] = useState(null);
  const [departmentID, setdepartmentID] = useState(null);
  // const [isManager, setIsManager] = useState(null);

  const loadUserData = () => {
    const roleId = customFunctions.getLocalStorage('group');
    const departmentId = customFunctions.getLocalStorage('department');
    
    if (roleId) {
      try {
        const parsedRole = JSON.parse(roleId);
        setRoleID(parsedRole);
      } catch (e) {
        // If not JSON, use as number directly
        setRoleID(Number(roleId));
      }
    }
    
    if (departmentId) {
      try {
        const parsedDept = JSON.parse(departmentId);
        setdepartmentID(parsedDept);
      } catch (e) {
        setdepartmentID(Number(departmentId));
      }
    }
  };

  useEffect(() => {
    // Load on mount
    loadUserData();
    
    // Listen for profile updates (when OIDC profile is loaded)
    const handleProfileUpdate = () => {
      loadUserData();
    };
    
    document.addEventListener('ProfileUpdate', handleProfileUpdate);
    
    return () => {
      document.removeEventListener('ProfileUpdate', handleProfileUpdate);
    };
  }, []); // Run on mount

  // useEffect(() => {
  //   const isProjectManager =
  //     customFunctions?.getLocalStorage('isProjectManager');
  //   setIsManager(JSON.parse(isProjectManager));
  // }, [customFunctions?.getLocalStorage('isProjectManager')]);

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

  // Check localStorage directly in case roleID state hasn't updated yet
  const currentRoleIdFromStorage = customFunctions.getLocalStorage('group');
  let effectiveRoleId = roleID;
  
  if (!effectiveRoleId && currentRoleIdFromStorage) {
    try {
      effectiveRoleId = JSON.parse(currentRoleIdFromStorage);
    } catch (e) {
      effectiveRoleId = Number(currentRoleIdFromStorage);
    }
    // Update state for next render
    if (effectiveRoleId !== roleID) {
      setRoleID(effectiveRoleId);
    }
  }
  
  // Fallback: if roleID is still null, use localStorage directly
  if (effectiveRoleId === null && currentRoleIdFromStorage) {
    try {
      effectiveRoleId = JSON.parse(currentRoleIdFromStorage);
    } catch (e) {
      effectiveRoleId = Number(currentRoleIdFromStorage);
    }
  }

  // Ensure effectiveRoleId is a number for comparison
  const numericRoleId = effectiveRoleId !== null && effectiveRoleId !== undefined 
    ? Number(effectiveRoleId) 
    : null;
  
  const hasPermissions =
    // (Number(roleID) === 1 && isManager && permittedUsers && permittedUsers.length && permittedUsers.includes(Number(roleID))) 
    // || 
    // (Number(roleID) === 1 && !isManager) 
    // || 
    (numericRoleId !== null && 
     permittedUsers && 
     permittedUsers.length && 
     permittedUsers.includes(numericRoleId)); // Normal permission check

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
