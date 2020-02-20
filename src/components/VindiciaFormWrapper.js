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
      shouldLoad: this.shouldLoad(),
    };
  }

  componentWillMount() {
    this.addFieldsToState();
  }

  componentDidMount() {
    const { vindicia } = this.props;
    const { localOptions, shouldLoad } = this.state;

    if (shouldLoad) {
      this.updateHiddenFields();
      if (vindicia) {
        vindicia.setup(localOptions);
      }
    }
  }

  componentWillUnmount() {
    const { vindicia } = this.props;
    if (vindicia.destroy) {
      vindicia.destroy();
    }
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
    const { vindicia } = this.props;

    if (isValid !== vindicia.isValid()) {
      this.setState({ isValid: !isValid });
    }
  };

  onVindiciaFieldChange = (event) => {
    const { onVindiciaFieldEvent } = this.props;
    this.checkFormValidity();
    return onVindiciaFieldEvent(event);
  };

  onSubmit = () => {
    const { formFields } = this.state;
    const { onSubmitEvent } = this.props;
    this.setState({ submitInProgress: true });
    return onSubmitEvent(formFields);
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

  shouldLoad() {
    const { options } = this.props;
    return options.hmac && options.vindiciaAuthId;
  }

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
              formatinput: item.formatinput || hostedFieldDefaults[i].formatinput,
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
            formatinput: hostedFieldDefaults[i].formatinput,
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
    const iframeHeightPadding = options.iframeHeightPadding || 0;
    options.formId = options.formId || 'mainForm';

    const localOptions = {
      ...options,
      hostedFields,
      fields: localFields,
      onSubmitEvent: this.onSubmit,
      onSubmitCompleteEvent: this.onSubmitComplete,
      onSubmitCompleteFailedEvent: this.onSubmitFail,
      onVindiciaFieldEvent: this.onVindiciaFieldChange,
      iframeHeightPadding,
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
    const { options } = this.props;

    if (options.hmac && typeof options.hmac === 'string') {
      const otlHmacKey = options.hmac;
      const sessionId = `SEAT_PMT_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const sessionHash = CryptoJS.HmacSHA512(`${sessionId}#POST#/payment_methods`, otlHmacKey);
      this.setState({ sessionId, sessionHash });
    }
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
    }));
  }

  render() {
    const {
      sessionId,
      sessionHash,
      isValid,
      submitInProgress,
      shouldLoad,
    } = this.state;

    const {
      options,
      children,
      vindicia,
      vinValidate,
      currency,
      ignoreCvnPolicy,
      minChargebackProb,
      sourceIp,
      ignoreAvsPolicy,
    } = this.props;

    return (
      vindicia && shouldLoad ? (
        <form id={options.formId || 'mainForm'}>
          <input name="vin_session_id" value={sessionId} type="hidden" />
          <input name="vin_session_hash" value={sessionHash} type="hidden" />
          { vinValidate && <input name="vin_validate" value={vinValidate} type="hidden" /> }
          { ignoreAvsPolicy && <input name="vin_ignore_avs_policy" value="1" type="hidden" /> }
          { ignoreCvnPolicy && <input name="vin_ignore_cvn_policy" value="1" type="hidden" /> }
          { minChargebackProb && <input name="vin_min_chargeback_probability" value={minChargebackProb} type="hidden" /> }
          { sourceIp && <input name="vin_source_ip" value={sourceIp} type="hidden" /> }
          { currency && <input name="vin_currency" value="EUR" type="hidden" /> }
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
      ) : null
    );
  }
}

VindiciaFormWrapper.propTypes = {
  options: PropTypes.shape({
    vindiciaAuthId: PropTypes.string,
    hmac: PropTypes.string,
    iframeHeightPadding: PropTypes.number,
    formId: PropTypes.string,
  }),
  fields: PropTypes.arrayOf(PropTypes.object),
  styles: PropTypes.shape({}),
  vindicia: PropTypes.shape({
    setup: PropTypes.func,
    destroy: PropTypes.func,
    isValid: PropTypes.func,
    resetCompleteStatus: PropTypes.func,
    clearData: PropTypes.func,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onSubmitEvent: PropTypes.func,
  onSubmitCompleteEvent: PropTypes.func,
  onSubmitCompleteFailedEvent: PropTypes.func,
  onVindiciaFieldEvent: PropTypes.func,
  vinValidate: PropTypes.string,
  currency: PropTypes.bool,
  ignoreCvnPolicy: PropTypes.bool,
  minChargebackProb: PropTypes.string,
  sourceIp: PropTypes.string,
  ignoreAvsPolicy: PropTypes.bool,
};

VindiciaFormWrapper.defaultProps = {
  options: {},
  fields: null,
  styles: null,
  vindicia: {},
  children: null,
  onSubmitEvent: () => true,
  onSubmitCompleteEvent: () => true,
  onSubmitCompleteFailedEvent: () => true,
  onVindiciaFieldEvent: () => true,
  vinValidate: null,
  currency: null,
  ignoreCvnPolicy: null,
  minChargebackProb: null,
  sourceIp: null,
  ignoreAvsPolicy: null,
};

export default VindiciaFormWrapper;
