package com.rogchap.react.modules.twilio;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactMethod;

import com.twilio.client.Device;
import com.twilio.client.Connection;
import com.twilio.client.ConnectionListener;
import com.twilio.client.Twilio;

import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

public class TwilioModule extends ReactContextBaseJavaModule implements ConnectionListener {

  public TwilioModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  private Device _phone;
  private Connection _connection;
  private Connection _pendingConnection;

  @Override
  public String getName() {
    return "Twilio";
  }

  @ReactMethod
  public void initWithTokenUrl(String tokenUrl) {
    StringBuilder sb = new StringBuilder();
    try {
      URLConnection conn = new URL(tokenUrl).openConnection();
      InputStream in = conn.getInputStream();
      BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
      while ((line = reader.readLine()) != null) {
        sb.append(line);
      }
    } catch (Exception e) {
      Log.e(e.getMessage(), e);
    }
    initWithToken(sb.toString());
  }

  @ReactMethod
  public void initWithToken(String token) {
    if (!Twilio.isInitialized()) {
      Twilio.initialize(getApplicationContext(), new Twilio.InitListener() {
        @Override
          public void onInitialized() {
            try {
              if (_phone == null) {
                _phone = Twilio.createDevice(capabilityToken, this);
              }
            } catch (Exception e) {
              Log.e(e.getMessage(), e);
            }
          }

          @Override
          public void onError(Exception e) {
            Log.e(e.getMessage(), e);
          }
      });
    }
  }

  @ReactMethod
  public void connect(ReadableMap params) {
    if (_phone != null) {
      _connection = _phone.connect(params, this);
    }
  }

  @ReactMethod
  public void disconnect() {
    if (_connection != null) {
      _connection.disconnect();
      _connection = null;
    }
  }

  @ReactMethod
  public void accept() {
    _pendingConnection.accept();
    _pendingConnection.setConnectionListener(this);
    _connection = _pendingConnection;
    _pendingConnection = null;
  }

  @ReactMethod
  public void reject() {
    _pendingConnection.reject();
  }

  @ReactMethod
  public void ignore() {
    _pendingConnection.ignore();
  }

  @ReactMethod
  public void setMuted(Boolean isMuted) {
    if (_connection && _connection.getState() == Connection.State.CONNECTED) {
      _connection.setMuted(isMuted);
    }
  }

  /* ConnectionListener */

  @Override
  public void onConnecting(Connection connection) {

  }

  @Override
  public void onConnected(Connection connection) {

  }

  @Override
  public void onDisconnected(Connection connection) {

  }

  @Override
  public void onDisconnected(Connection connection, int errorCode, String errorMessage) {
    
  }
}
