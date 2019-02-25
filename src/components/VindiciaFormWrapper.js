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

        fields.map(field => {
            if (field.name) {
                formFields[field.name] = field.value || '';
            }
        });

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
        fields.forEach(item => {
            for (let i = 0; i < hostedFieldDefaults.length; i++) {
                if (item.type === hostedFieldDefaults[i].name) {
                    hostedFields[hostedFieldDefaults[i].name] = {
                        selector: item.selector || hostedFieldDefaults[i].selector,
                        placeholder: item.placeholder || hostedFieldDefaults[i].placeholder,
                        format: item.format || hostedFieldDefaults[i].format
                    };
                }
            }
        });

        hostedFields.styles = styles;

        const localOptions = {
            ...options,
            hostedFields,
            onSubmitEvent: this.onSubmit,
            onSubmitCompleteEvent: this.onSubmitComplete,
            onSubmitCompleteFailedEvent: this.onSubmitFail,
            onVindiciaFieldEvent: this.checkFormValidity
        };

        return localOptions;
    }

    checkFormValidity = () => {
        const { isValid } = this.state;

        if (isValid !== window.vindicia.isValid()) {
            this.setState({ isValid: !isValid });
        }
    }

    onVindiciaFieldChange = (vin) => {
        this.checkFormValidity();
        this.props.onVindiciaFieldEvent(vin);
    }

    onSubmit = (vin) => {
        const { onSubmitEvent } = this.props;
        this.setState({ submitInProgress: true });
        onSubmitEvent(vin);
    }

    onSubmitFail = (vin) => {
        const { onSubmitCompleteFailedEvent } = this.props;
        this.setState({ submitInProgress: false });
        onSubmitCompleteFailedEvent(vin);
    }

    onSubmitComplete = (vin) => {
        const { onSubmitCompleteEvent } = this.props;
        this.setState({ submitInProgress: false });
        onSubmitCompleteEvent(vin);
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
        const { styles } = this.props;

        let styleOutput = '';

        Object.keys(styles).map(selector => {
            styleOutput += `${selector} {\n`;
            Object.keys(styles[selector]).map(rule => {
                styleOutput += `  ${rule}: ${styles[selector][rule]};\n`;
            });
            styleOutput += '}\n';
        });

        return styleOutput;
    }

    renderFields() {
        const { fields } = this.props;
        const { localOptions : { hostedFields } } = this.state;

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
            vindicia,
            styles } = this.props;

        return (vindicia &&
            <form id={options.formId || 'mainForm'}>
                <input name="vin_session_id" value={sessionId} type="hidden" />
                <input name="vin_session_hash" value={sessionHash} type="hidden" />
                {children ?
                    children
                    : (
                        <div>
                            {styles &&
                                <style
                                    type="text/css"
                                    dangerouslySetInnerHTML={{__html: this.parseStyles(styles)}}
                                />
                            }
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
    { name: 'name', selector: '#vin_account_holder' },
    { name: 'billing1', selector: '#vin_billing_address_line1' },
    { name: 'billing2', selector: '#vin_billing_address_line2' },
    { name: 'billing3', selector: '#vin_billing_address_line3' },
    { name: 'city', selector: '#vin_billing_city' },
    { name: 'district', selector: '#vin_billing_address_district' },
    { name: 'postalCode', selector: '#vin_billing_address_postal_code' },
    { name: 'country', selector: '#vin_billing_address_country' },
    { name: 'phone', selector: '#vin_billing_address_phone' },
    { name: 'cardNumber', selector: '#vin_credit_card_account' },
    { name: 'expirationDate', selector: '#vin_credit_card_expiration_date', format: 'MM/YY' },
    { name: 'expirationMonth', selector: '#vin_credit_card_expiration_month' },
    { name: 'expirationYear', selector: '#vin_credit_card_expiration_year' },
    { name: 'cvn', selector: '#vin_credit_card_cvn' }
];

export default VindiciaFormWrapper;
