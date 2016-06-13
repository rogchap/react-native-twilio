# A React Native wrapper for the [Twilio](https://www.twilio.com) mobile SDK

[![npm version](https://badge.fury.io/js/react-native-twilio.svg)](https://badge.fury.io/js/react-native-twilio)

This library implement the superseeded Twilio Client SDK. Twilio has moved to the new Programmable Voice SDK.

Run `npm install react-native-twilio --save` in your project directory

## Installation iOS

1. Open your project in XCode, right click on `Libraries` and click `Add Files to "Your Project Name"`
2. Within `node_modules`, find `react-native-twilio/ios` and add RCTTwilio.xcodeproj to your project.
3. Add `libRCTTwilio.a` to `Build Phases -> Link Binary With Libraries`

## Installation Android

Add the lib to `android/settings.gradle`

```
include ':react-native-twilio'
project(':react-native-twilio').projectDir = new File(settingsDir,
  '../node_modules/react-native-twilio/android')

```

Add the lib dependency to `app/build.gradle`

```
dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile "com.android.support:appcompat-v7:23.0.1"
    ...
    compile project(':react-native-twilio') // <----
}
```

Import the library in your `MainApplication.java`

```

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.rogchap.react.modules.twilio.TwilioPackage; // <----

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new TwilioPackage() // <----
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

}

```

configure your `AndroidManifest.xml` file

```
      <uses-permission android:name="android.permission.INTERNET" />

      ...

      <!-- Twilio -->
      <service android:name="com.twilio.client.TwilioClientService" android:exported="false" android:stopWithTask="true"/>
      <!-- Twilio -->
```

For a full example check [the full working example](RNTwilioExample)


## Usage

Have a look at the [Twilio Client SDK](https://www.twilio.com/docs/api/client) for details.

``` javascript
const Twilio = require('react-native-twilio');

...

componentWillMount() {
  Twilio.initWithTokenUrl('https://example.com/token');
  // or 
  Twilio.initWithToken('sometoken');
  Twilio.addEventListener('deviceReady', this._deviceReady);
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

## LICENSE

[MIT License](LICENSE)
