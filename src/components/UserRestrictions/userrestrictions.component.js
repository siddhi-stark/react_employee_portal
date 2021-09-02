import React from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = customFunctions.getLocalStorage('group');
  const departmentId = customFunctions.getLocalStorage('department');

  const childRoute = children&& children.props && children.props.children && children.props.children[0] && children.props.children[0].props && children.props.children[0].props.to;


  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));


  if(Number(roleId) === Number(4) && Number(departmentId) !== Number(7) && childRoute === '/emp-timesheet'){
    return <></>;
  }

  return <>{hasPermissions && <>{children}</>}</>;
      
}
