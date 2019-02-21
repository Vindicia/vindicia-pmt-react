# vindicia-pmt-react
A React.js wrapper component for the Vindicia Payment Method Tokenization (PMT) system

------------

# Setup
Install vindicia-react
`npm install --save vindicia-react`

Add Vindicia to application
`<script id="vindicia-js" src="https://secure.vindicia.com/pmt/vindicia.js" async></script>`

# Usage
Import VindiciaFormWrapper
`import VindiciaFormWrapper from 'vindicia-react';`

Initialize vindicia to null in component state
```javascript
    constructor() {
        super();
        this.state = {
            vindicia: null
        };
    }
```

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
