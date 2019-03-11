import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import { hostedFieldDefaults, defaultStyles } from './defaults';

class VindiciaFormWrapper extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sessionId: '',
      sessionHash: '',
      localOptions: this.constructOptions(),
      isValid: false,
      submitInProgress: false,
      formFields: {},
    };
  }

  componentWillMount() {
    this.addFieldsToState();
  }

  componentDidMount() {
    const { vindicia } = this.props;
    const { localOptions } = this.state;

    this.updateHiddenFields();
    if (vindicia) {
      vindicia.setup(localOptions);
    }
  }

  componentWillUnmount() {
    const { vindicia } = this.props;
    vindicia.destroy();
  }

  onFieldChange(field, e) {
    const { formFields } = this.state;
    this.setState({
      formFields: {
        ...formFields,
        [field.name]: e.target.value,
      },
    });
    this.checkFormValidity();
  }

  checkFormValidity = () => {
    const { isValid } = this.state;

    if (isValid !== window.vindicia.isValid()) {
      this.setState({ isValid: !isValid });
    }
  };

  onVindiciaFieldChange = (event) => {
    const { onVindiciaFieldEvent } = this.props;
    this.checkFormValidity();
    return onVindiciaFieldEvent(event);
  };

  onSubmit = (form) => {
    const { onSubmitEvent } = this.props;
    this.setState({ submitInProgress: true });
    return onSubmitEvent(form);
  };

  onSubmitFail = (data) => {
    const { onSubmitCompleteFailedEvent } = this.props;
    this.setState({ submitInProgress: false });
    return onSubmitCompleteFailedEvent(data);
  };

  onSubmitComplete = (data) => {
    const { onSubmitCompleteEvent } = this.props;
    this.setState({ submitInProgress: false });
    return onSubmitCompleteEvent(data);
  };

  constructOptions() {
    const { options, fields, styles } = this.props;

    const hostedFields = {};
    const localFields = fields ? [...fields] : [];

    if (fields) {
      fields.forEach((item) => {
        for (let i = 0; i < hostedFieldDefaults.length; i += 1) {
          if (item.type === hostedFieldDefaults[i].name) {
            hostedFields[hostedFieldDefaults[i].name] = {
              selector: item.selector || hostedFieldDefaults[i].selector,
              placeholder: item.placeholder || hostedFieldDefaults[i].placeholder || '',
              label: item.label || hostedFieldDefaults[i].label,
              format: item.format || hostedFieldDefaults[i].format,
            };
          }
        }
      });
    } else {
      // if no fields are passed, add the default fields to the form
      for (let i = 0; i < hostedFieldDefaults.length; i += 1) {
        if (hostedFieldDefaults[i].isDefault) {
          hostedFields[hostedFieldDefaults[i].name] = {
            selector: hostedFieldDefaults[i].selector,
            format: hostedFieldDefaults[i].format,
            placeholder: '',
            type: hostedFieldDefaults[i].name,
          };
          localFields.push({
            selector: hostedFieldDefaults[i].selector,
            label: hostedFieldDefaults[i].label,
            format: hostedFieldDefaults[i].format,
            placeholder: '',
            type: hostedFieldDefaults[i].name,
          });
        }
      }
    }

    hostedFields.styles = styles || defaultStyles;
    options.iframeHeightPadding = options.iframeHeightPadding || 0;
    options.formId = options.formId || 'mainForm';

    const localOptions = {
      ...options,
      hostedFields,
      fields: localFields,
      onSubmitEvent: this.onSubmit,
      onSubmitCompleteEvent: this.onSubmitComplete,
      onSubmitCompleteFailedEvent: this.onSubmitFail,
      onVindiciaFieldEvent: this.onVindiciaFieldChange,
    };

    return localOptions;
  }

  resetVindicia() {
    const { vindicia } = this.props;
    vindicia.clearData();
    vindicia.resetCompleteStatus();
    this.updateHiddenFields();
  }

  updateHiddenFields() {
    const otlHmacKey = '4Isv4EqzeKRHlXFHPU3OIBNzjNY';
    const sessionId = `SEAT_PMT_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const sessionHash = CryptoJS.HmacSHA512(`${sessionId}#POST#/payment_methods`, otlHmacKey);

    this.setState({ sessionId, sessionHash });
  }

  addFieldsToState() {
    const { fields } = this.props;

    const formFields = {};

    if (fields) {
      fields.forEach((field) => {
        if (field.name) {
          formFields[field.name] = field.value || '';
        }
      });
    }

    this.setState({ formFields });
  }

  parseStyles() {
    const {
      localOptions: {
        hostedFields: { styles },
      },
    } = this.state;

    let styleOutput = '';

    Object.keys(styles).forEach((selector) => {
      styleOutput += `${selector} {\n`;
      Object.keys(styles[selector]).forEach((rule) => {
        styleOutput += `  ${rule}: ${styles[selector][rule]};\n`;
      });
      styleOutput += '}\n';
    });

    return styleOutput;
  }

  renderFields() {
    const {
      localOptions: { fields, hostedFields },
      formFields,
    } = this.state;

    return (hostedFields && fields.map((field, index) => {
        let inputField;

        const validHostedFieldValues = hostedFieldDefaults.reduce(
          (acc, curr) => acc.concat(curr.name),
          [],
        );

        if (validHostedFieldValues.includes(field.type)) {
          let { selector } = hostedFields[field.type];
          selector = selector.substring(1, selector.length);

          inputField = <div id={selector} />;
        } else {
          inputField = (
            <input
              className={`field-group__input ${field.className || ''}`}
              type={field.type || 'text'}
              placeholder={field.placeholder || ''}
              value={formFields[field.name]}
              id={field.name}
              onChange={e => this.onFieldChange(field, e)}
            />
          );
        }

        return (
          <div
            className="field-group"
            key={`vin-field-${field.label || field.type || `jsx-${field.name || index}`}`}
          >
            {field.label && (
              <label className="field-group__label" htmlFor={field.name}>
                {field.label}
              </label>
            )}
            {field.render || inputField}
          </div>
        );
      })
    );
  }

  render() {
    const {
      sessionId, sessionHash, isValid, submitInProgress,
    } = this.state;

    const { options, children, vindicia } = this.props;

    return (
      vindicia && (
        <form id={options.formId || 'mainForm'}>
          <input name="vin_session_id" value={sessionId} type="hidden" />
          <input name="vin_session_hash" value={sessionHash} type="hidden" />
          <style type="text/css" dangerouslySetInnerHTML={{ __html: this.parseStyles() }} />
          {children || (
            <div>
              {this.renderFields()}
              <button type="submit" id="submitButton" disabled={!isValid || submitInProgress}>
                Submit
              </button>
            </div>
          )}
        </form>
      )
    );
  }
}

VindiciaFormWrapper.propTypes = {
  options: PropTypes.shape({}),
  fields: PropTypes.arrayOf(PropTypes.object),
  styles: PropTypes.shape({}),
  vindicia: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onSubmitEvent: PropTypes.func,
  onSubmitCompleteEvent: PropTypes.func,
  onSubmitCompleteFailedEvent: PropTypes.func,
  onVindiciaFieldEvent: PropTypes.func,
};

VindiciaFormWrapper.defaultProps = {
  options: {},
  fields: null,
  styles: null,
  children: null,
  onSubmitEvent: () => true,
  onSubmitCompleteEvent: () => true,
  onSubmitCompleteFailedEvent: () => true,
  onVindiciaFieldEvent: () => true,
};

export default VindiciaFormWrapper;
