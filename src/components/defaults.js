export const defaultStyles = {
  input: {
    width: '200px',
    display: 'block',
    'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
    'font-size': '14px',
    color: '#777',
    height: 'auto',
    padding: '6px 12px',
    margin: '5px 0px 20px 0px',
    'line-height': '1.42857',
    border: '1px solid #ccc',
    'border-radius': '4px',
    'box-shadow': '0px 1px 1px rgba(0,0,0,0.075) inset',
    '-webkit-transition': 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
    transition: 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
  },
  select: {
    width: '100%',
    'font-family': "'Helvetica Neue',Helvetica,Arial,sans-serif",
    'font-size': '14px',
    color: '#555',
    height: '34px',
    padding: '6px 12px',
    margin: '5px 0px',
    'line-height': '1.42857',
    border: '1px solid #ccc',
    'border-radius': '4px',
    'box-shadow': '0px 1px 1px rgba(0,0,0,0.075) inset',
    '-webkit-transition': 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
    transition: 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
  },
  ':focus': {
    'border-color': '#66afe9',
    outline: '0',
    '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)',
    'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)',
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
    color: '#444',
    'border-radius': '4px',
    'font-size': '12px',
  },
  'button[type="submit"][disabled]': {
    'background-color': '#eee',
    color: '#ddd',
  },
};

export const hostedFieldDefaults = [
  {
    name: 'name',
    label: 'Name',
    selector: '#vin_account_holder',
  },
  {
    name: 'billing1',
    label: 'Address Line 1',
    selector: '#vin_billing_address_line1',
  },
  {
    name: 'billing2',
    label: 'Address Line 2',
    selector: '#vin_billing_address_line2',
  },
  {
    name: 'billing3',
    label: 'Address Line 3',
    selector: '#vin_billing_address_line3',
  },
  {
    name: 'city',
    label: 'City',
    selector: '#vin_billing_city',
  },
  {
    name: 'district',
    label: 'State',
    selector: '#vin_billing_address_district',
  },
  {
    name: 'postalCode',
    label: 'Postal Code',
    selector: '#vin_billing_address_postal_code',
  },
  {
    name: 'country',
    label: 'Country',
    selector: '#vin_billing_address_country',
  },
  {
    name: 'phone',
    selector: '#vin_billing_address_phone',
  },
  {
    name: 'cardNumber',
    label: 'Card Number',
    selector: '#vin_credit_card_account',
    isDefault: true,
  },
  {
    name: 'expirationDate',
    label: 'Expiration Date',
    selector: '#vin_credit_card_expiration_date',
    format: 'MM/YY',
    isDefault: true,
  },
  {
    name: 'expirationMonth',
    selector: '#vin_credit_card_expiration_month',
  },
  {
    name: 'expirationYear',
    selector: '#vin_credit_card_expiration_year',
  },
  {
    name: 'cvn',
    label: 'CVN',
    selector: '#vin_credit_card_cvn',
    isDefault: true,
  },
];
