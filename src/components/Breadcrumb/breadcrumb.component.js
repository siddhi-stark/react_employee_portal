import React from 'react';

function Breadcrumb(props) {
  const { items } = props;
  return (
    <>
      <ol className="breadcrumb">
        {items &&
          items.map(({ to, label }) => (
            <li key={to} className="breadcrumb-item active">
              <a href={to}>{label}</a>
            </li>
          ))}
      </ol>
    </>
  );
}

export default Breadcrumb;
