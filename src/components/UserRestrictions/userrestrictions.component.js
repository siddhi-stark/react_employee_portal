import React from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = customFunctions.getLocalStorage('group');
  const departmentId = customFunctions.getLocalStorage('department');

  const childRoute = children&& children.props && children.props.children && children.props.children[0] && children.props.children[0].props && children.props.children[0].props.to;

  const childrenArr = ['/projects', '/interview-listing', '/recruitment'];

  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));

    // console.log('find-',childrenArr.includes(childRoute));

  if(Number(roleId) === Number(4) && Number(departmentId) !== Number(7) && Number(departmentId) !== Number(8) && childRoute === '/emp-timesheet'){
    return <></>;
  }
  
  if(Number(roleId) === Number(4) && Number(departmentId) === Number(7) && childrenArr.includes(childRoute)){
    return <></>;
  }

  return <>{hasPermissions && <>{children}</>}</>;
      
}
