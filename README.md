
# vindicia-pmt-react

A React.js wrapper component for the Vindicia Payment Method Tokenization (PMT) system

------------

 
# Setup
Install vindicia-react

`npm install --save vindicia-react`

  

Add Vindicia to application

`<script id="vindicia-js" src="https://secure.vindicia.com/pmt/vindicia.js" async></script>`

  

# Usage

## Import VindiciaFormWrapper
`import VindiciaFormWrapper from 'vindicia-react';`

Initialize vindicia to null in component state

```javascript
constructor() {
	super();
	this.state = {
		vindicia:  null
	};
}
```
## Bind Vindicia on Load
Add an event listener to `componentWillMount` which will add vindicia to state upon load

```javascript
componentWillMount() {
	if (window.vindicia) {
		this.setState({vindicia:  window.vindicia});
	} else {
		document.querySelector('#vindicia-js').addEventListener('load', () => {
			this.setState({vindicia:  window.vindicia});
		});
	}
}
```

Add VindiciaFormWrapper to the component
```javascript
<VindiciaFormWrapper
	vindicia={vindicia}
	options={vindiciaOptions}
	fields={fields}
	styles={styles}
	onSubmitEvent={this.onSubmitEvent}
	onSubmitCompleteEvent={this.onSubmitCompleteEvent}
	onSubmitCompleteFailedEvent={this.onSubmitCompleteFailedEvent}
	onVindiciaFieldEvent={this.onVindiciaFieldEvent}
/>
```

# Props
|Prop  |Required?  |
|--|--|
|vindicia|yes  |
|options|yes|
|fields|yes|
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
	formId: 'your-form-id', // optional, defaults to mainForm
	vindiciaAuthId: 'your auth id', // required
	vindiciaServer: "secure.qa.vindicia.com", // to load the iframes from
	vindiciaRestServer: "api.qa.vindicia.com", // to submit the JSON data to
	iframeHeightPadding: 0
}
```

## fields
fields is an array of objects, each corresponding to an item on the final form.

Here is a rundown of the available fields on the field objects:
|property|default|purpose|notes|
|--|--|--|--|
|type|`text`|determines type of field| accepts `'text'`, or one of the vindicia field values
|label|`null`|creates `<label>` for given field|
|placeholder|`''`|adds `placeholder` attribute on form fields
|render|`null`|pass JSX to be displayed on form|overrides any constructed field logic
|format|`null`|only used on expirationDate
|value|`''`|default value of form field
|name|| applies HTML ID to form element
|autocomplete|`"off"`||Used with `cardNumber`, `expirationDate`, and `cvn` 
|formatinput|`false`||Used with `cardNumber` and `expirationDate`
|maskinput|`false`||Used with `cardNumber` or `cvn`

You have a few ways of getting what you want into the form.

#### Method 1 - construct text field
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

![enter image description here](https://lh3.googleusercontent.com/vvv6m34cTTzxca3nN9JGsRhrn82Y8E0fpX6Ri-NYVkMsv846HtLUDbnLoxSXmGX4cH_IaCPuOC6oNg)



#### Method 2 - construct vindicia field
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

#### Method 3 - Pass in jsx
---
Use of the `render` property allows for the passing in of JSX. This JSX can be a form field, a	`<div>`, or a custom component.

Example of the use of the render property:
```javascript
{
	render: (
		<div  className="text-block">
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
The onVindiciaFieldEvent is called when an onBlur event fires from a Vindicia-generated field. Note this function is not called when a constructed or passed-in field is modified.

## onSubmitEvent
onSubmitEvent fires when the submit button is clicked, but before data is submitted. This is your chance to run validation on the form's inputs.

## onSubmitCompleteEvent

## onSubmitCompleteFailedEvent