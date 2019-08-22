const isProd = process.env.NODE_ENV === 'production';

const withAPI = (Comp, Fn, requirePath = false) => {
  let staticProps = {};
  if (isProd && requirePath) {
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