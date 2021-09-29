import React from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = customFunctions.getLocalStorage('group');
  const departmentId = customFunctions.getLocalStorage('department');

  const childRoute = children&& children.props && children.props.children && children.props.children[0] && children.props.children[0].props && children.props.children[0].props.to;

  const childrenArr = ['/projects', '/interview-listing', '/recruitment','/project','/scheduler','/team-scheduler'];
  const childArr = ['/projects','/team-scheduler'];
  const childProjectArr = ['/scheduler','/team-scheduler'];

  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));

  if(Number(roleId) === 4 && Number(departmentId) !== 7 && Number(departmentId) !== 8 && childRoute === '/emp-timesheet'){
    return <></>;
  }  

  if(Number(roleId) === 4 && Number(departmentId) === 7 && childRoute === '/project' && childRoute === '/scheduler'){
    return <></>;
  }
  
  if(Number(roleId) === 4 && Number(departmentId) === 7 && childrenArr.includes(childRoute)){
    return <></>;
  }

  if(Number(roleId) === 4 && Number(departmentId) === 8 && childArr.includes(childRoute)){
    return <></>;
  }

  if((Number(roleId) === 4 && (Number(departmentId) === 2 || Number(departmentId) === 3 || Number(departmentId) === 4 || Number(departmentId) === 5 || Number(departmentId) === 6 || Number(departmentId) === 7)) && childProjectArr.includes(childRoute)){
    return <></>;
  }

  return <>{hasPermissions && <>{children}</>}</>;
      
}
