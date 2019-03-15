import React from 'react';
import { render } from 'react-dom';

import VindiciaFormWrapper from '../src/index'

class GeneratedForm extends React.Component {
  constructor() {
    super();
    this.state = {
        vindicia: null,
        isValid: false, 
        isSynced: false,
        isComplete: false
    };
}

componentWillMount() {
    if (window.vindicia) {
        this.setState({vindicia: window.vindicia});
    } else {
        document.querySelector('#vindicia-js').addEventListener('load', () => {
            this.setState({vindicia: window.vindicia});
        });
    }
}
  render() {
    const { vindicia } = this.state;
    return (
      <VindiciaFormWrapper
        vindicia={vindicia}
        options={vindiciaOptions}
        onSubmitCompleteEvent={(e) => console.log('Form submitted!', e)}
      />
    );
  }
}

// const vindiciaOptions= {
//   formId: "mainForm",
//   vindiciaAuthId: "cG10X3JlYWN0X2RlbW9fb3RsOnBtdF9yZWFjdF9kZW1vX290bA===", // Authorization: Basic header"
//   vindiciaServer: "secure.prodtest2.vindicia.com", // to load the iframes from
//   vindiciaRestServer: "api.prodtest.vindicia.com", // to submit the JSON data to
//   iframeHeightPadding: 0
// };

const vindiciaOptions= {
  formId: "mainForm",
  vindiciaAuthId: "cWEtZ2RsLTIwMTgtcTJfb25lX3RpbWVfbG9naW46cWEtZ2RsLTIwMTgtcTJfb25lX3RpbWVfbG9naW4=", // Authorization: Basic header"
  vindiciaServer: "secure.qa.vindicia.com", // to load the iframes from
  vindiciaRestServer: "api.qa.vindicia.com", // to submit the JSON data to
  iframeHeightPadding: 0
};

const App = () => {
  return (
    <GeneratedForm />
  );
};

const appElement = document.querySelector('.App');
if (appElement) {
  render(<App />, appElement);
} else {
  console.error(
    'We could not find an HTML element with a class name of "App" in the DOM. Please make sure you copy index.html as well for this demo to work.'
  );
}
