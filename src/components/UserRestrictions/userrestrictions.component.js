import React from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = customFunctions.getLocalStorage('group');
  const departmentId = customFunctions.getLocalStorage('department');

  const childRoute = children&& children.props && children.props.children && children.props.children[0] && children.props.children[0].props && children.props.children[0].props.to;

  const childrenArr = ['/projects', '/interview-listing', '/recruitment'];
  const childArr = ['/projects', '/interview-listing'];

  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));

  if(Number(roleId) === 4 && Number(departmentId) !== 7 && Number(departmentId) !== 8 && childRoute === '/emp-timesheet'){
    return <></>;
  }  

  if(Number(roleId) === 4 && Number(departmentId) !== 8 && childRoute === '/project'){
    return <></>;
  }
  
  if(Number(roleId) === 4 && Number(departmentId) === 7 && childrenArr.includes(childRoute)){
    return <></>;
  }

  if(Number(roleId) === 4 && Number(departmentId) === 8 && childArr.includes(childRoute)){
    return <></>;
  }

  return <>{hasPermissions && <>{children}</>}</>;
      
}
