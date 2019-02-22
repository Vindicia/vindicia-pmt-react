
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

## vindicia
The Vindicia Object

## options
Example
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
Example
```javascript
[
	{
		type:  'text',
		label:  'Salutation',
		placeholder:  'Mr/Ms/Mrs/Dr/Sr',
		render:  null,
		format:  null,
		value:  null
	},
	{
		type:  'name',
		placeholder:  'Name',
		label:  'Name'
	},
	{
		render: (
			<div  className="text-block">
				This is a text block that is passed from the parent. Styles can be applied via the styles prop.
			</div>
		)
	},
	{
		type:  'cardNumber',
		placeholder:  'Credit Card Number',
		label:  'Credit Card Number'
	},
	{
		type:  'expirationDate',
		placeholder:  'MM/YY',
		format:  'MM/YY',
		label:  'Expiration Date'
	},
	{
		type:  'cvn',
		placeholder:  'CVN',
		label:  'CVN'
	}
]
```

## styles
Example

```javascript
{
	"input": {
		"width":  "50%",
		"font-family":  "'Helvetica Neue',Helvetica,Arial,sans-serif",
		"font-size":  "14px",
		"color":  "#777",
		"height":  "auto",
		"padding":  "6px 12px",
		"margin":  "5px 0px",
		"line-height":  "1.42857",
		"border":  "1px solid #ccc",
		"border-radius":  "4px",
		"box-shadow":  "0px 1px 1px rgba(0,0,0,0.075) inset",
		"-webkit-transition":  "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
		"transition":  "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
	},
	"select": {
		"width":  "100%",
		"font-family":  "'Helvetica Neue',Helvetica,Arial,sans-serif",
		"font-size":  "14px",
		"color":  "#555",
		"height":  "34px",
		"padding":  "6px 12px",
		"margin":  "5px 0px",
		"line-height":  "1.42857",
		"border":  "1px solid #ccc",
		"border-radius":  "4px",
		"box-shadow":  "0px 1px 1px rgba(0,0,0,0.075) inset",
		"-webkit-transition":  "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
		"transition":  "border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s",
	},
	":focus": {
		"border-color":  "#66afe9",
		"outline":  "0",
		"-webkit-box-shadow":  "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)",
		"box-shadow":  "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)"
	},
	".valid": {
		"border-color":  "#228B22",
	},
	".notValid": {
		"border-color":  "#ff0000",
	},
	'.text-block': {
		padding:  '10px',
		'background-color':  '#ccc',
		width:  '300px',
	},
	'button[type="submit"]': {
		padding:  '10px 20px',
	}
}
```
