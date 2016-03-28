package com.rogchap.react.modules.twilio;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;

public class TwilioModule extends ReactContextBaseJavaModule {

  public TwilioModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Twilio";
  }

  @ReactMethod
  public void initWithTokenUrl(String tokenUrl) {

  }

  @ReactMethod
  public void initWithToken(String token) {

  }

  @ReactMethod
  public void connect(ReadableMap params) {

  }

  @ReactMethod
  public void disconnect() {

  }

  @ReactMethod
  public void accept() {

  }

  @ReactMethod
  public void reject() {

  }

  @ReactMethod
  public void ignore() {

  }

  @ReactMethod
  public void setMuted(Boolean isMuted) {

  }

}
