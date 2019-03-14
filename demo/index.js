import React from 'react';
import { render } from 'react-dom';

import VindiciaFormWrapper from '../src'

class Demo extends React.Component {
  render() {
    return (
      <VindiciaFormWrapper
	  vindicia={window.vindicia}
	  options={
      vindiciaOptions
    }
	  onSubmitCompleteEvent={(e) => console.log('Form submitted!', e)}
  />
    );
  }
}

const vindiciaOptions= {
  formId: "mainForm",
  vindiciaAuthId: "cWEtZ2RsLTIwMTgtcTJfb25lX3RpbWVfbG9naW46cWEtZ2RsLTIwMTgtcTJfb25lX3RpbWVfbG9naW4=", // Authorization: Basic header"
  vindiciaServer: "secure.qa.vindicia.com", // to load the iframes from
  vindiciaRestServer: "api.qa.vindicia.com", // to submit the JSON data to
  iframeHeightPadding: 0
};