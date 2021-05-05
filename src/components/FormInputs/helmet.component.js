import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const HelmetComponent = (props) => {
  const { title } = props;
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            {title ? `${title} |Employee Portal` : `Employee Portal`}
          </title>
          <meta name="description" content="" />
          <link rel="canonical" href="" />
        </Helmet>
      </HelmetProvider>
    </div>
  );
};

export default HelmetComponent;
