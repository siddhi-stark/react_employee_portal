import React from 'react';

function Loader(props) {

  const { showLoader, needFullPage } = props;
  
  return (
    (showLoader) ? (
      <div className={(needFullPage) ? 'loader-overlay full-loader' : 'loader-overlay'}>
        <div className="loader" />
      </div>
    ) : null
  );
}

export default Loader;