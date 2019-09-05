import React from 'react';
const isProd = process.env.NODE_ENV === 'production';

//  compile time components

const withAPI = (Comp, Fn, requirePath = false) => {
  let staticProps = {};
  if (isProd && requirePath) {
    // HOW TO ROUTE IT MAN
    staticProps = require(`./data/${requirePath}`); // bc this **should** returns the module
  }
  const MyComp = props => {
    return <Comp {...staticProps} {...props} />;
  };
  if (!isProd || !requirePath) {
    MyComp.getInitialProps = Fn;
  }
  return MyComp;
}

module.exports = { withAPI }