import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import VindiciaFormWrapper from '../src/index';

class GeneratedForm extends React.Component {
  constructor() {
    super();
    this.state = {
        detail: null
    };
  }

  onFormSubmitComplete = (data) => {
    this.setState({ detail: data.detail });
    console.log('Form Submitted and Validated', data);
  }

  onFormSubmit = (data) => {
    console.log('Form Submitted', data);
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <div className="example">
        <h1>Generated Form</h1>
        <div className="description">
          <p>The quickest way to get up and running is to have VindiciaFormWrapper 
          contruct your form for you. In this example, only the <code>vindicia</code> and 
          <code>options</code> props are necessary, with <code>onSubmitCompleteEvent</code>&nbsp;
          being ideal to perform the next step in your process.</p>
          <pre>
            {`
            const vindiciaOptions= {
              formId: "mainForm",
              vindiciaAuthId: "your-auth-id",
              vindiciaServer: "secure.staging.us-west.vindicia.com",
              vindiciaRestServer: "api.staging.us-west.vindicia.com",
              hmac: 'your-hmac-key'
            };
            `}
          </pre>
          <pre>
            {`
            <VindiciaFormWrapper
              vindicia={window.vindicia}
              options={vindiciaOptions}
              onSubmitCompleteEvent={this.onFormSubmitComplete}
              onSubmitEvent={this.onFormSubmit}
            />
            `}
          </pre>
        </div>
        <div className="form-container">
          <VindiciaFormWrapper
            vindicia={window.vindicia}
            options={vindiciaOptions}
            onSubmitCompleteEvent={this.onFormSubmitComplete}
            onSubmitEvent={this.onFormSubmit}
            vinValidate="0"
          />
          {detail && 
            <div className="results">
              Form submitted successfully!<br />
              vid: <span>{detail.vid}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}

class FormFromProps extends React.Component {
  constructor() {
    super();
    this.state = {
        detail: null
    };
  }

  onFormSubmitComplete = (data) => {
    this.setState({ detail: data.detail });
    console.log('Form Submitted and Validated', data);
  }

  onFormSubmit = (data) => {
    console.log('Form Submitted', data);
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <div className="example">
        <h1>Form from fields prop - Vindicia-created</h1>
        <div className="description">
          <p>The form below makes use of the <code>fields</code> prop. More information
          regarding the use of the <code>fields</code> prop can be found <a href="https://github.com/Vindicia/vindicia-pmt-react#fields">here</a>.</p>
          <pre>
            {`
            const fields = [
              {
                type: 'cardNumber',
                placeholder: 'Credit Card Number',
                label: 'Credit Card Number',
                autocomplete: 'cc-number',
                formatinput: true,
                maskinput: true
              },
              {
                type: 'expirationDate',
                placeholder: 'MM/YY',
                format: 'MM/YY',
                label: 'Expiration Date',
                formatinput: true,
                maskinput: true
              },
              {
                type: 'cvn',
                placeholder: 'CVN',
                label: 'CVN',
                autocomplete: 'cc-csc'
              },
              {
                type: 'text',
                label: 'Billing Zip Code',
                placeholder: 'Zip Code',
                render: null,
                format: null,
                value: null,
                name: 'zip-code'
              },
            ];
            `}
          </pre>
          <pre>
            {`
            const vindiciaOptions= {
              formId: "mainForm",
              vindiciaAuthId: "your-auth-id",
              vindiciaServer: "secure.staging.us-west.vindicia.com",
              vindiciaRestServer: "api.staging.us-west.vindicia.com",
              hmac: 'your-hmac-key'
            };
            `}
          </pre>
          <pre>
            {`
            <VindiciaFormWrapper
              vindicia={window.vindicia}
              options={vindiciaOptions}
              fields={fields}
              onSubmitCompleteEvent={onFormSubmitComplete}
              onSubmitEvent={onFormSubmit}
            />
            `}
          </pre>
          
        </div>
        <div className="form-container">
          <VindiciaFormWrapper
            vindicia={window.vindicia}
            options={vindiciaOptions}
            fields={fields}
            onSubmitCompleteEvent={this.onFormSubmitComplete}
            onSubmitEvent={this.onFormSubmit}
            vinValidate="0"
          />
          {detail && 
            <div className="results">
              Form submitted successfully!<br />
              vid: <span>{detail.vid}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}

class FormFromCustomFields extends React.Component {
  constructor() {
    super();
    this.state = {
        detail: null
    };
  }

  onFormSubmitComplete = (data) => {
    this.setState({ detail: data.detail });
    console.log('Form Submitted and Validated', data);
  }

  onFormSubmit = (data) => {
    console.log('Form Submitted', data);
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <div className="example">
        <h1>Form from fields prop - Custom</h1>
        <div className="description">
          <p>The form below makes use of the <code>fields</code> prop, with custom HTML passed in for the Name field as well as the HTML block below. More information
          regarding the use of the <code>fields</code> prop can be found <a href="https://github.com/Vindicia/vindicia-pmt-react#fields">here</a>.</p>
          <pre>
            {`
              const customFields = [
                {
                  type: 'text',
                  placeholder: 'Full Name',
                  label: 'Full Name',
                  name: 'name
                },
                {
                  render: (
                    <div className="form-note">
                      <p>
                        This is an HTML element passed in via 
                        the <code>render</code> property within 
                        a <code>field</code> object.
                      </p>
                      <p>
                        This allows for passing in HTML or even a component.
                      </p>
                    </div>
                  )
                },
                {
                  type: 'cardNumber',
                  placeholder: 'Credit Card Number',
                  label: 'Credit Card Number',
                  autocomplete: 'cc-number',
                  formatinput: true,
                  maskinput: true
                },
                {
                  type: 'expirationDate',
                  placeholder: 'MM/YY',
                  format: 'MM/YY',
                  label: 'Expiration Date',
                  formatinput: true,
                  maskinput: true
                },
                {
                  type: 'cvn',
                  placeholder: 'CVN',
                  label: 'CVN',
                  autocomplete: 'cc-csc'
                }
              ];
            `}
          </pre>
          <pre>
            {`
            const vindiciaOptions= {
              formId: "mainForm",
              vindiciaAuthId: "your-auth-id",
              vindiciaServer: "secure.staging.us-west.vindicia.com",
              vindiciaRestServer: "api.staging.us-west.vindicia.com",
              hmac: 'your-hmac-key'
            };
            `}
          </pre>
          <pre>
            {`
            <VindiciaFormWrapper
              vindicia={window.vindicia}
              options={vindiciaOptions}
              fields={customFields}
              onSubmitCompleteEvent={onFormSubmitComplete}
              onSubmitEvent={onFormSubmit}
            />
            `}
          </pre>
          
        </div>
        <div className="form-container">
          <VindiciaFormWrapper
            vindicia={window.vindicia}
            options={vindiciaOptions}
            fields={customFields}
            onSubmitCompleteEvent={this.onFormSubmitComplete}
            onSubmitEvent={this.onFormSubmit}
            vinValidate="0"
          />
          {detail && 
            <div className="results">
              Form submitted successfully!<br />
              vid: <span>{detail.vid}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}


class FormFromChildren extends React.Component {
  constructor() {
    super();
    this.state = {
        detail: null
    };
  }

  onFormSubmitComplete = (data) => {
    this.setState({ detail: data.detail });
    console.log('Form Submitted and Validated', data);
  }

  onFormSubmit = (data) => {
    console.log('Form Submitted', data);
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <div className="example">
        <h1>Form from children prop</h1>
        <div className="description">
          <p>For more control, you may also pass in a form as a child of the 
            component. This method is more along the lines of the traditional 
            use of vindicia.js.</p>
          <pre>
            {`
            const vindiciaOptions= {
              formId: "mainForm",
              vindiciaAuthId: "your-auth-id",
              vindiciaServer: "secure.staging.us-west.vindicia.com",
              vindiciaRestServer: "api.staging.us-west.vindicia.com",
              hmac: 'your-hmac-key'
            };
            `}
          </pre>
          <pre>
            {`
            <VindiciaFormWrapper
            vindicia={window.vindicia}
            options={vindiciaOptions}
            onSubmitCompleteEvent={onFormSubmitComplete}
            onSubmitEvent={onFormSubmit}
            vinValidate="0"
          >
            <div>
              <div className="form--section">
                <div className="form--section__header">Personal Information</div>
                <div className="form--field-group">
                  <label>Name</label>
                  <input type="text" required />
                </div>
                <div className="form--field-group">
                  <label>Address</label>
                  <input type="text" required />
                </div>
                <div className="form--field-group">
                  <label>City</label>
                  <input type="text" required />
                </div>
              </div>

              <div className="form--section">
                <div className="form--section__header">Payment Information</div>
                <div className="form--field-group">
                  <label>Credit Card Number</label>
                  <div id="vin_credit_card_account"></div>
                </div>
                <div className="form--field-group">
                  <label>Expiration Date</label>
                  <div id="vin_credit_card_expiration_date"></div>
                </div>
                <div className="form--field-group">
                  <label>CVN</label>
                  <div id="vin_credit_card_cvn"></div>
                </div>
              </div>
              
              <button type="submit">Submit</button>
            </div>
          </VindiciaFormWrapper>
            `}
          </pre>
        </div>
        <div className="form-container">
          <VindiciaFormWrapper
            vindicia={window.vindicia}
            options={vindiciaOptions}
            onSubmitCompleteEvent={this.onFormSubmitComplete}
            onSubmitEvent={this.onFormSubmit}
            vinValidate="0"
          >
            <div>
              <div className="form--section">
                <div className="form--section__header">Personal Information</div>
                <div className="form--field-group">
                  <label>Name</label>
                  <input type="text" required />
                </div>
                <div className="form--field-group">
                  <label>Address</label>
                  <input type="text" required />
                </div>
                <div className="form--field-group">
                  <label>City</label>
                  <input type="text" required />
                </div>
              </div>

              <div className="form--section">
                <div className="form--section__header">Payment Information</div>
                <div className="form--field-group">
                  <label>Credit Card Number</label>
                  <div id="vin_credit_card_account"></div>
                </div>
                <div className="form--field-group">
                  <label>Expiration Date</label>
                  <div id="vin_credit_card_expiration_date"></div>
                </div>
                <div className="form--field-group">
                  <label>CVN</label>
                  <div id="vin_credit_card_cvn"></div>
                </div>
              </div>
              
              <button type="submit">Submit</button>
            </div>
          </VindiciaFormWrapper>
          {detail && 
            <div className="results">
              Form submitted successfully!<br />
              vid: <span>{detail.vid}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}

class FormWithStyles extends React.Component {
  constructor() {
    super();
    this.state = {
        detail: null
    };
  }

  onFormSubmitComplete = (data) => {
    this.setState({ detail: data.detail });
    console.log('Form Submitted and Validated', data);
  }

  onFormSubmit = (data) => {
    console.log('Form Submitted', data);
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <div className="example">
        <script type="text/css">
        </script>
        <h1>Form with styles prop - Custom</h1>
        <div className="description">
        <p>The form below makes use of the <code>styles</code> prop. More information
          regarding the use of the <code>styles</code> prop can be found <a href="https://github.com/Vindicia/vindicia-pmt-react#styles">here</a>.</p>
          <pre>
            {`
            const customStyles = {
              form: {
                'font-family': 'Titillium Web',
                'font-style': 'normal',
                'font-weight': 'bold'
              },
              input: {
                width: '200px',
                display: 'block',
                'font-size': '14px',
                'font-family': 'Titillium Web',
                color: '#3ca2a9',
                height: 'auto',
                padding: '6px 12px',
                margin: '5px 0px 20px 0px',
                'line-height': '1.42857',
                border: '1px solid #ccc',
                'border-radius': '4px',
                'box-shadow': '0px 1px 1px rgba(0,0,0,0.075) inset',
              },
              ':focus': {
                'border-color': '#66afe9',
                outline: '0',
              },
              '.valid': {
                'border-color': '#228B22',
              },
              '.notValid': {
                'border-color': '#ff0000',
              },
              '.text-block': {
                padding: '10px',
                'background-color': '#ccc',
                width: '300px',
              },
              'button[type="submit"]': {
                padding: '10px 20px',
                'background-color': '#ccc',
                color: '#777',
                'border-radius': '4px',
                'font-size': '12px',
              },
              'button[type="submit"][disabled]': {
                'background-color': '#eee',
                color: '#777',
              },
            };
            `}
          </pre>
          <pre>
            {`
            const vindiciaOptions= {
              formId: "mainForm",
              vindiciaAuthId: "your-auth-id",
              vindiciaServer: "secure.staging.us-west.vindicia.com",
              vindiciaRestServer: "api.staging.us-west.vindicia.com",
              hmac: 'your-hmac-key'
            };
            `}
          </pre>
          <pre>
            {`
            <div className="form-container">
              <link href="https://fonts.googleapis.com/css2?family=Titillium+Web"
                rel="stylesheet"/>
              <VindiciaFormWrapper
              vindicia={window.vindicia}
              styles={customStyles}
              options={vindiciaOptions}
              onSubmitCompleteEvent={onFormSubmitComplete}
              onSubmitEvent={onFormSubmit}
              vinValidate="0"
            >
                <div>
                  <div className="form--section">
                    <div className="form--section__header">
                      Payment Information
                    </div>
                    <div className="form--field-group">
                      <label>Cardholder's Name</label>
                      <input type="text" required />
                    </div>
                    <div className="form--field-group">
                      <label>Credit Card Number</label>
                      <div id="vin_credit_card_account"></div>
                    </div>
                    <div className="form--field-group">
                      <label>Expiration Date</label>
                      <div id="vin_credit_card_expiration_date"></div>
                    </div>
                    <div className="form--field-group">
                      <label>CVN</label>
                      <div id="vin_credit_card_cvn"></div>
                    </div>
                  </div>
                  <button type="submit">Submit</button>
                </div>
              </VindiciaFormWrapper>
            </div>
            `}
          </pre>
        </div>
        <div className="form-container">
          <link href="https://fonts.googleapis.com/css2?family=Titillium+Web" rel="stylesheet"/>
          <VindiciaFormWrapper
            vindicia={window.vindicia}
            styles={customStyles}
            options={vindiciaOptions}
            onSubmitCompleteEvent={this.onFormSubmitComplete}
            onSubmitEvent={this.onFormSubmit}
            vinValidate="0"
          >
            <div>
              <div className="form--section">
                <div className="form--section__header">Payment Information</div>
                <div className="form--field-group">
                  <label>Cardholder's Name</label>
                  <input type="text" required />
                </div>
                <div className="form--field-group">
                  <label>Credit Card Number</label>
                  <div id="vin_credit_card_account"></div>
                </div>
                <div className="form--field-group">
                  <label>Expiration Date</label>
                  <div id="vin_credit_card_expiration_date"></div>
                </div>
                <div className="form--field-group">
                  <label>CVN</label>
                  <div id="vin_credit_card_cvn"></div>
                </div>
              </div>
              <button type="submit">Submit</button>
            </div>
          </VindiciaFormWrapper>
          {detail &&
            <div className="results">
              Form submitted successfully!<br />
              vid: <span>{detail.vid}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}

const fields = [
  {
    type: 'cardNumber',
    placeholder: 'Credit Card Number',
    label: 'Credit Card Number',
    autocomplete: 'cc-number',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'expirationDate',
    placeholder: 'MM/YY',
    format: 'MM/YY',
    label: 'Expiration Date',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'cvn',
    placeholder: 'CVN',
    label: 'CVN',
    autocomplete: 'cc-csc'
  },
  {
    type: 'postalCode',
    label: 'Billing Zip Code',
    placeholder: 'Zip Code'
  },
];

const customStyles = {
  form: {
    'font-family': 'Titillium Web',
    'font-style': 'italic',
    'font-weight': 'bold'
  },
  input: {
    width: '200px',
    display: 'block',
    'font-size': '14px',
    'font-family': 'Titillium Web',
    color: '#3ca2a9',
    height: 'auto',
    padding: '6px 12px',
    margin: '5px 0px 20px 0px',
    'line-height': '1.42857',
    border: '1px solid #ccc',
    'border-radius': '4px',
    'box-shadow': '0px 1px 1px rgba(0,0,0,0.075) inset',
  },
  ':focus': {
    'border-color': '#66afe9',
    outline: '0',
  },
  '.valid': {
    'border-color': '#228B22',
  },
  '.notValid': {
    'border-color': '#ff0000',
  },
  '.text-block': {
    padding: '10px',
    'background-color': '#ccc',
    width: '300px',
  },
  'button[type="submit"]': {
    padding: '10px 20px',
    'background-color': '#ccc',
    color: '#777',
    'border-radius': '4px',
    'font-size': '12px',
  },
  'button[type="submit"][disabled]': {
    'background-color': '#eee',
    color: '#777',
  },
};

const customFields = [
  {
    type: 'text',
    placeholder: 'Full Name',
    label: 'Full Name',
    name: 'name'
  },
  {
    render: (
      <div className="form-note">
        <p>
          This is an HTML element passed in via 
          the <code>render</code> property within 
          a <code>field</code> object.
        </p>
        <p>
          This allows for passing in HTML or even a component.
        </p>
      </div>
    )
  },
  {
    type: 'cardNumber',
    placeholder: 'Credit Card Number',
    label: 'Credit Card Number',
    autocomplete: 'cc-number',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'expirationDate',
    placeholder: 'MM/YY',
    format: 'MM/YY',
    label: 'Expiration Date',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'cvn',
    placeholder: 'CVN',
    label: 'CVN',
    autocomplete: 'cc-csc'
  }
];

const vindiciaOptions= {
  formId: "mainForm",
  vindiciaAuthId: "cG10X3JlYWN0X2RlbW9fb3RsOnBtdF9yZWFjdF9kZW1vX290bA===", // Authorization: Basic header"
  vindiciaServer: "secure.staging.us-west.vindicia.com", // to load the iframes from
  vindiciaRestServer: "api.staging.us-west.vindicia.com", // to submit the JSON data to
  iframeHeightPadding: 0,
  hmac: 'FVNszvMg6fVjf736_LSX0w5GZio'
};

const App = () => {
  return (
    <Router>
      <div className="header">
        <h1>vindicia-pmt-react</h1>
        <h3>A React.js wrapper component for the Vindicia Payment Method Tokenization (PMT) system</h3>
        <div className="nav">
          <p>Examples:</p>
          <ul>
            <li><NavLink className="nav--link" to="/">Generated Form</NavLink></li>
            <li><NavLink className="nav--link" to="fields-vindicia-created">Form from fields prop - Vindicia-created</NavLink></li>
            <li><NavLink className="nav--link" to="fields-custom">Form from fields prop - Custom</NavLink></li>
            <li><NavLink className="nav--link" to="form-from-children">Form from children prop</NavLink></li>
            <li><NavLink className="nav--link" to="form-with-styles">Form with styles prop - custom</NavLink></li>
          </ul>
        </div>
      </div>
      <Route exact path="/" component={GeneratedForm} />
      <Route path="/fields-vindicia-created" component={FormFromProps} />
      <Route path="/fields-custom" component={FormFromCustomFields} />
      <Route path="/form-from-children" component={FormFromChildren} />
      <Route path="/form-with-styles" component={FormWithStyles} />
    </Router>
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
