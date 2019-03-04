import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

class VindiciaFormWrapper extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sessionId: '',
            sessionHash: '',
            localOptions: this.constructOptions(),
            isValid: false,
            submitInProgress: false,
            formFields: {}
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

        this.addFocusForProtectedFields();
    }

    componentWillUnmount() {
        const { vindicia } = this.props;
        vindicia.destroy();
    }

    addFieldsToState() {
        const { fields } = this.props;

        const formFields = {};

        if (fields) {
            fields.map(field => {
                if (field.name) {
                    formFields[field.name] = field.value || '';
                }
            });
        }

        this.setState({ formFields });
    }

    onFieldChange(field, e) {
        this.setState({
            formFields: {
                ...this.state.formFields,
                [field.name]: e.target.value
            }
        });
        this.checkFormValidity();
    }

    updateHiddenFields() {
        const otl_hmac_key = "4Isv4EqzeKRHlXFHPU3OIBNzjNY";
        const sessionId = `SEAT_PMT_${Math.random().toString(36).substr(2, 9)}`;
        const sessionHash = CryptoJS.HmacSHA512(`${sessionId}#POST#/payment_methods`, otl_hmac_key);

        this.setState({ sessionId, sessionHash });
    }

    resetVindicia() {
        const { vindicia } = this.props;
        vindicia.clearData();
        vindicia.resetCompleteStatus();
        this.updateHiddenFields();
    }

    constructOptions() {
        const {
            options,
            fields,
            styles,} = this.props;

        const hostedFields = {};
        const localFields = fields ? [...fields] : [];

        if (fields) {
            fields.forEach(item => {
                for (let i = 0; i < hostedFieldDefaults.length; i++) {
                    if (item.type === hostedFieldDefaults[i].name) {
                        hostedFields[hostedFieldDefaults[i].name] = {
                            selector: item.selector || hostedFieldDefaults[i].selector,
                            placeholder: item.placeholder || hostedFieldDefaults[i].placeholder || '',
                            label: item.label || hostedFieldDefaults[i].label,
                            format: item.format || hostedFieldDefaults[i].format
                        };
                    }
                }
            });
        } else { // if no fields are passed, add the default fields to the form
            for (let i = 0; i < hostedFieldDefaults.length; i++) {
                if (hostedFieldDefaults[i].isDefault) {
                    hostedFields[hostedFieldDefaults[i].name] = {
                        selector: hostedFieldDefaults[i].selector,
                        format: hostedFieldDefaults[i].format,
                        placeholder: '',
                        type: hostedFieldDefaults[i].name
                    };
                    localFields.push({
                        selector: hostedFieldDefaults[i].selector,
                        label: hostedFieldDefaults[i].label,
                        format: hostedFieldDefaults[i].format,
                        placeholder: '',
                        type: hostedFieldDefaults[i].name
                    })
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
            onVindiciaFieldEvent: this.onVindiciaFieldChange
        };

        return localOptions;
    }

    checkFormValidity = () => {
        const { isValid } = this.state;

        if (isValid !== window.vindicia.isValid()) {
            this.setState({ isValid: !isValid });
        }
    }

    onVindiciaFieldChange = (event) => {
        const { onVindiciaFieldEvent } = this.props;
        this.checkFormValidity();
        return onVindiciaFieldEvent(event);
    }

    onSubmit = (form) => {
        const { onSubmitEvent } = this.props;
        this.setState({ submitInProgress: true });
        return onSubmitEvent(form);
    }

    onSubmitFail = (data) => {
        const { onSubmitCompleteFailedEvent } = this.props;
        this.setState({ submitInProgress: false });
        return onSubmitCompleteFailedEvent(data);
    }

    onSubmitComplete = (data) => {
        const { onSubmitCompleteEvent } = this.props;
        this.setState({ submitInProgress: false });
        return onSubmitCompleteEvent(data);
    }

    addFocusForProtectedFields() {
        const { hostedFields, vindicia } = this.props;

        for (let field in hostedFields) {
            const selector = hostedFields[field].selector;
            const el = document.querySelectorAll(`[for="${selector.slice(1, selector.length)}"`);
            
            if (el && vindicia.frames[field].source) {
                el.onclick = vindicia.frames[field].source.focus();
            }
        }
    }

    parseStyles() {
        const {
            localOptions : { 
                hostedFields: { 
                    styles 
                } 
            } 
        } = this.state;

        let styleOutput = '';

        console.log('STYLES', styles);

        Object.keys(styles).map(selector => {
            styleOutput += `${selector} {\n`;
            Object.keys(styles[selector]).map(rule => {
                styleOutput += `  ${rule}: ${styles[selector][rule]};\n`;
            });
            styleOutput += '}\n';
        });

        console.log('SYLEOUTPUT', styleOutput)

        return styleOutput;
    }

    renderFields() {
        const { localOptions : { fields, hostedFields } } = this.state;

        return hostedFields && fields.map((field, index) => {

            let inputField;

            const validHostedFieldValues = hostedFieldDefaults.reduce((acc, curr) => acc.concat(curr.name), []);

            if (validHostedFieldValues.includes(field.type)) {
                let selector = hostedFields[field.type].selector;
                selector = selector.substring(1, selector.length);

                inputField = (
                    <div id={selector} />
                );
            } else {
                inputField = (
                    <input
                        className={`field-group__input ${field.className || ''}`}
                        type={field.type || 'text'}
                        placeholder={field.placeholder || ''}
                        value={this.state.formFields[field.name]}
                        id={field.name}
                        onChange={(e) => this.onFieldChange(field, e)}
                    />
                );
            }

            console.log('EACH FIELD', field);

            return (
                <div
                    className="field-group"
                    key={`vin-field-${field.label || field.type || `jsx-${field.name || index}`}`}
                >
                    {field.label &&
                        <label
                            className="field-group__label"
                            htmlFor={field.name}
                        >
                            {field.label}
                        </label>
                    }
                    {field.render || inputField}
                </div>
            );
        });
    }

    render () {
        const {
            sessionId,
            sessionHash,
            isValid,
            submitInProgress } = this.state;

        const {
            options,
            children,
            vindicia } = this.props;

        return (vindicia &&
            <form id={options.formId || 'mainForm'}>
                <input name="vin_session_id" value={sessionId} type="hidden" />
                <input name="vin_session_hash" value={sessionHash} type="hidden" />
                <style
                    type="text/css"
                    dangerouslySetInnerHTML={{__html: this.parseStyles()}}
                />
                {children ?
                    children
                    : (
                        <div>
                            {this.renderFields()}
                            <button
                                type="submit"
                                id="submitButton"
                                disabled={!isValid || submitInProgress}
                            >
                                Submit
                            </button>
                        </div>
                    )
                }
            </form>
        );
    };
}

VindiciaFormWrapper.propTypes = {
    options: PropTypes.object,
    hostedFields: PropTypes.array,
    styles: PropTypes.object,
    vindicia: PropTypes.object,
    onSubmitEvent: PropTypes.func,
    onSubmitCompleteEvent: PropTypes.func,
    onSubmitCompleteFailedEvent: PropTypes.func,
    onVindiciaFieldEvent: PropTypes.func
};

VindiciaFormWrapper.defaultProps = {
    onSubmitEvent: () => { return true; },
    onSubmitCompleteEvent: () => { return true; },
    onSubmitCompleteFailedEvent: () => { return true; },
    onVindiciaFieldEvent: () => { return true; }
};

const hostedFieldDefaults = [
    {
        name: 'name',
        label: 'Name',
        selector: '#vin_account_holder' },
    {
        name: 'billing1',
        label: 'Address Line 1',
        selector: '#vin_billing_address_line1'
    },
    {
        name: 'billing2',
        label: 'Address Line 2',
        selector: '#vin_billing_address_line2'
    },
    {
        name: 'billing3',
        label: 'Address Line 3',
        selector: '#vin_billing_address_line3'
    },
    {
        name: 'city',
        label: 'City',
        selector: '#vin_billing_city'
    },
    {
        name: 'district',
        label: 'State',
        selector: '#vin_billing_address_district'
    },
    {
        name: 'postalCode',
        label: 'Postal Code',
        selector: '#vin_billing_address_postal_code'
    },
    {
        name: 'country',
        label: 'Country',
        selector: '#vin_billing_address_country'
    },
    {
        name: 'phone',
        selector: '#vin_billing_address_phone'
    },
    {
        name: 'cardNumber',
        label: 'Card Number',
        selector: '#vin_credit_card_account',
        isDefault: true
    },
    {
        name: 'expirationDate',
        label: 'Expiration Date',
        selector: '#vin_credit_card_expiration_date',
        format: 'MM/YY',
        isDefault: true
    },
    {
        name: 'expirationMonth',
        selector: '#vin_credit_card_expiration_month'
    },
    {
        name: 'expirationYear',
        selector: '#vin_credit_card_expiration_year'
    },
    {
        name: 'cvn',
        label: 'CVN',
        selector: '#vin_credit_card_cvn',
        isDefault: true
    }
];

const defaultStyles = {
    'input': {
        'width': '200px',
        'display': 'block',
        'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
        'font-size': '14px',
        'color': '#777',
        'height': 'auto',
        'padding': '6px 12px',
        'margin': '5px 0px 20px 0px',
        'line-height': '1.42857',
        'border': '1px solid #ccc',
        "border-radius": "4px",
        "box-shadow": "0px 1px 1px rgba(0,0,0,0.075) inset",
        "-webkit-transition": "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
        "transition": "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
    },
    "select": {
        "width": "100%",
        "font-family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
        "font-size": "14px",
        "color": "#555",
        "height": "34px",
        "padding": "6px 12px",
        "margin": "5px 0px",
        "line-height": "1.42857",
        "border": "1px solid #ccc",
        "border-radius": "4px",
        "box-shadow": "0px 1px 1px rgba(0,0,0,0.075) inset",
        "-webkit-transition": "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
        "transition": "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
    },
    ":focus": {
        "border-color": "#66afe9",
        "outline": "0",
        "-webkit-box-shadow": "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)",
        "box-shadow": "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)"
    },
    ".valid": {
        "border-color": "#228B22",
    },
    ".notValid": {
        "border-color": "#ff0000",
    },
    '.text-block': {
        padding: '10px',
        'background-color': '#ccc',
        width: '300px',
    },
    'button[type="submit"]': {
        'padding': '10px 20px',
        'background-color': '#ccc',
        'color': '#444',
        'border-radius': '4px',
    },
    'button[type="submit"][disabled]': {
        'background-color': '#eee',
        'color': '#ddd'
    }
};

export default VindiciaFormWrapper;
