

# vindicia-pmt-react
A React.js wrapper component for the Vindicia Payment Method Tokenization (PMT) system

## Table of Contents
- [vindicia-pmt-react](#vindicia-pmt-react)
	- [Table of Contents](#table-of-contents)
- [Setup](#setup)
- [Quickstart](#quickstart)
- [Props](#props)
	- [vindicia](#vindicia)
	- [options](#options)
	- [fields](#fields)
	- [### Method 1 - construct text field](#method-1---construct-text-field)
	- [### Method 2 - construct vindicia field](#method-2---construct-vindicia-field)
	- [### Method 3 - Pass in jsx](#method-3---pass-in-jsx)
	- [styles](#styles)
	- [onVindiciaFieldEvent](#onvindiciafieldevent)
	- [onSubmitEvent](#onsubmitevent)
	- [onSubmitCompleteEvent](#onsubmitcompleteevent)
	- [onSubmitCompleteFailedEvent](#onsubmitcompletefailedevent)
- [How to create your form](#how-to-create-your-form)
  
 
# Setup
1. Install vindicia-react
 `npm install --save vindicia-pmt-react`

2. Add Vindicia to application
`<script id="vindicia-js" src="https://secure.vindicia.com/pmt/vindicia.js" async></script>`
  

# Quickstart
1.  Import VindiciaFormWrapper to your component\
`import VindiciaFormWrapper from 'vindicia-react';`
2. Initialize vindicia to null in component state
	```javascript
	constructor() {
	  super();
	  this.state = {
		vindicia:  null
	  };
	}
	```
3. Bind Vindicia on Load\
Add an event listener to `componentWillMount` which will add vindicia to state upon load
	```javascript
	componentWillMount() {
	if (window.vindicia) {
		this.setState({vindicia: window.vindicia});
	} else {
		document.querySelector('#vindicia-js').addEventListener('load', () => {
		this.setState({vindicia: window.vindicia});
		});
	}
	}
	```

4. Add VindiciaFormWrapper to the component
	```javascript
	<VindiciaFormWrapper
	  vindicia={vindicia}
	  options={options}
	  fields={fields}
	  styles={styles}
	  onSubmitEvent={this.onSubmitEvent}
	  onSubmitCompleteEvent={this.onSubmitCompleteEvent}
	  onSubmitCompleteFailedEvent={this.onSubmitCompleteFailedEvent}
	  onVindiciaFieldEvent={this.onVindiciaFieldEvent}
	/>
	```
5. Define your props

# Props
|Prop|Required?|
|--|--|
|vindicia|yes  |
|options|yes|
|fields|no|
|styles|no|
|onVindiciaFieldEvent|no|
|onSubmitEvent|no|
|onSubmitCompleteEvent|no|
|onSubmitCompleteFailedEvent|no|

## vindicia
The Vindicia object

## options
The basic setup options

```javascript
{
  formId: 'mainForm', // optional, defaults to mainForm
  vindiciaAuthId: 'your auth id', // required
  vindiciaServer: "secure.qa.vindicia.com", // required, to load the iframes from
  vindiciaRestServer: "api.qa.vindicia.com", // required, to submit the JSON data to
  iframeHeightPadding: 0, // optional, defaults to 0
}
```

## fields
fields is an array of objects, each corresponding to an item on the final form.

Here is a rundown of the available fields on the field objects:
|property|default|purpose|notes|
|--|--|--|--|
|type|`text`|determines type of field| accepts `'text'`, or one of the [vindicia field](#method-2---construct-vindicia-field) values
|label|`null`|creates `<label>` for given field|
|placeholder|`''`|adds `placeholder` attribute on form fields
|render|`null`|pass JSX to be displayed on form|overrides any constructed field logic
|format|`null`|only used on expirationDate
|value|`''`|default value of form field
|name|| applies HTML ID to form element
|autocomplete|`"off"`|Makes use of the browser's autofill feature|Used with `cardNumber`, `expirationDate`, and `cvn` 
|formatinput|`false`||Used with `cardNumber` and `expirationDate`
|maskinput|`false`||Used with `cardNumber` or `cvn`

There are several ways to leverage fields, as outlined below.

### Method 1 - construct text field
----
Passing in the following:
```javascript
{
	type:  'text',
	label:  'Name',
	placeholder:  'Your Full Name',
	name:  'name'
},
```
Will result in:

![Example of constructed field](demo/images/constructed-field-example.png)


### Method 2 - construct vindicia field
---
The following fields are able to be created within Vindicia. Setting a field's 	`type` to any of these will result in Vindicia handling the creation and validation of that field.
```
name
billing1
billing2
billing3
city
district // equivalent to US state
postalCode
country
phone
cardNumber
expirationDate
expirationMonth
expirationYear
cvn
```

For a pure credit card entry form, the simplest way forward is to use Vindicia-constructed fields.  This essentially give Vindicia full control (aside from styling) of your form.

Using the following `fields` setup:
```javascript
const fields = [
  {
    type: 'cardNumber',
    label: 'Credit Card Number',
    placeholder: 'CC Number',
    autocomplete: 'cc-number',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'expirationDate',
    label: 'Expiration Date',
    placeholder: 'MM/YY',
    format: 'MM/YY',
    autocomplete: 'cc-exp',
    formatinput: true,
    maskinput: true
  },
  {
    type: 'cvn',
    label: 'CVN',
    placeholder: 'CVN',
    autocomplete: 'cc-csc'
  },
];
```
Will result in:

![Example of Vindicia-constructed fields](demo/images/vindicia-fields-example.png)


### Method 3 - Pass in jsx
---
Use of the `render` property allows for the passing in of JSX. This JSX can be a form field, a	`<div>`, or a custom component.

Example of the use of the render property:
```javascript
{
  render: (
    <div className="text-block">
    <p>This is a text block that is passed from the parent. Styles can be applied via the styles prop.</p>
    </div>
  )
},
{
  label:  'Address',
  render: (
    <input
      type="text"
      id="address"
      required
    />
  ),
  name:  'address'
},
{
  render: (
    <MyComponent />
  ),
}
```
Note that in the first example, no properties other than `render` are passed in, while in the second example, `label` and `name` are passed. This is to ensure the `<label>` is created and synced with the `<input>` field via use of the `name` property which sets the `htmlFor` attribute on the `<label>`.


## styles
Any styles pertaining to Vindicia-generated fields must be limited to the following rules:
```
color
width
height
border
border-color
border-radius
font
font-family
font-size
font-size-adjust
font-stretch
font-style
font-variant
font-variant-alternates
font-variant-caps
font-variant-east-asian
font-variant-ligatures
font-variant-numeric
font-weight
line-height
opacity
outline
padding
margin
text-shadow
box-shadow
-webkit-box-shadow
-moz-osx-font-smoothing
-moz-transition
-webkit-font-smoothing
-webkit-transition
transition
```

## onVindiciaFieldEvent
`onVindiciaFieldEvent` is called when an onBlur event fires from a Vindicia-generated field. Note this function is not called when a constructed or passed-in field is modified.

## onSubmitEvent
`onSubmitEvent` fires when the submit button is clicked, but before data is submitted. This is your chance to run validation on the form's inputs.

## onSubmitCompleteEvent
`onSubmitCompleteEvent` is called when the form has been submitted and validated successfully. This is where you would proceed with your checkout process, e.g. route the user to a success page.

## onSubmitCompleteFailedEvent

# How to create your form
There are three methods to creating your form. You can:
1. Use the `fields` prop to pass in each field or JSX element, one after the other.
2. Pass in your own form as a child element, i.e.-
	```javascript
	<VindiciaFormWrapper
	  vindicia={vindicia}
	  options={vindiciaOptions}
	  styles={styles}
	>
	  <div className="your-field-container">
		<div className="form-group">

		</div>
	  </div>
	</VindiciaFormWrapper>
	```
3. Pass in no children or `fields` prop, and a form will be created that has fields for card number, expiration date, and cvn. The following will be enough to create your form, though you may want to add handlers for the submitComplete events.
	```javascript
	<VindiciaFormWrapper
	  vindicia={vindicia}
	  options={vindiciaOptions}
	/>
	```
