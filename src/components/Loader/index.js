import React from 'react';

function Loader(props) {

  const { showLoader } = props;
  
  return (
    (showLoader) ? (
      <div className="preloader">
       <img src="/images/loader.gif" alt=""/>
         <h4 className='loader-texts'>Loading...</h4>
      </div>
      
    ) : null
  );
}

export default Loader;