# A React Native wrapper for the [Twilio](https://www.twilio.com) mobile SDK

## Installation iOS

1. Run `npm install react-native-twilio --save` in your project directory
1. Open your project in XCode, right click on `Libraries` and click `Add Files to "Your Project Name"`
1. Within `node_modules`, find `react-native-twilio/ios` and add RCTTwilio.xcodeproj to your project.
1. Add `libRCTTwilio.a` to `Build Phases -> Link Binary With Libraries`

## Installation Android

Coming Soon... PR anyone?

## Usage

Have a look at the [Twilio Client SDK](https://www.twilio.com/docs/api/client) for details.

``` javascript
const Twilio = require('react-native-twilio');

...

componentWillMount() {
  Twilio.initWithTokenUrl('https://example.com/token');
  Twilio.addEventListener('deviceDidStartListening', this._deviceDidStartListening);
  Twilio.addEventListener('deviceDidStopListening', this._deviceDidStopListening);
  Twilio.addEventListener('deviceDidReceiveIncoming', this._deviceDidReceiveIncoming);
  Twilio.addEventListener('connectionDidStartConnecting', this._connectionDidStartConnecting);
  Twilio.addEventListener('connectionDidConnect', this._connectionDidConnect);
  Twilio.addEventListener('connectionDidDisconnect', this._connectionDidDisconnect);
  Twilio.addEventListener('connectionDidFail', this._connectionDidFail);
}

...

Twilio.connect({To: '+61234567890'});
  
Twilio.disconnect();

Twilio.accept();

Twilio.reject();

Twilio.ignore();
```