package com.rogchap.react.modules.twilio;

import android.support.annotation.Nullable;

import android.util.Log;
import android.app.PendingIntent;
import android.content.Intent;

import android.content.Context;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.twilio.client.Connection;
import com.twilio.client.ConnectionListener;
import com.twilio.client.Device;
import com.twilio.client.DeviceListener;
import com.twilio.client.PresenceEvent;
import com.twilio.client.Twilio;

import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.HashMap;
import java.util.Map;


public class TwilioModule extends ReactContextBaseJavaModule implements ConnectionListener, DeviceListener {

    private static final String TAG = TwilioModule.class.getName();

    private ReactApplicationContext reactContext;

    private Device _phone;
    private Connection _connection;
    private Connection _pendingConnection;
    private IntentReceiver _receiver;
    WritableMap params;

    public class IntentReceiver extends BroadcastReceiver {
        private ConnectionListener _cl;

        public IntentReceiver(ConnectionListener connectionListener) {
            this._cl = connectionListener;
        }

        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "onReceive");
            Device device = intent.getParcelableExtra(Device.EXTRA_DEVICE);
            Connection incomingConnection = intent.getParcelableExtra(Device.EXTRA_CONNECTION);

            if (incomingConnection == null && device == null) {
                return;
            }
            intent.removeExtra(Device.EXTRA_DEVICE);
            intent.removeExtra(Device.EXTRA_CONNECTION);

            _pendingConnection = incomingConnection;
            _pendingConnection.setConnectionListener(this._cl);
            Map<String, String> connParams = _pendingConnection.getParameters();
            params = Arguments.createMap();
            if (connParams != null) {
                for (Map.Entry<String, String> entry : connParams.entrySet()) {
                    params.putString(entry.getKey(), entry.getValue());
                }
            }
            sendEvent("deviceDidReceiveIncoming", params);
        }
    }

    public TwilioModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        this._receiver = new IntentReceiver(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.rogchap.react.modules.twilio.incoming");
        getReactApplicationContext().registerReceiver(this._receiver, intentFilter);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "Twilio";
    }

    @ReactMethod
    public void initWithToken(final String token) {
        final DeviceListener dl = this;
        Twilio.setLogLevel(Log.DEBUG);
        if (!Twilio.isInitialized()) {
            Twilio.initialize(getReactApplicationContext(), new Twilio.InitListener() {
                @Override
                public void onInitialized() {
                    try {
                        if (_phone == null) {
                            createDeviceWithToken(token, dl);
                        } else {
                            _phone.updateCapabilityToken(token);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, e.getMessage());
                    }
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, e.getMessage());
                }
            });
        } else {
            Log.d(TAG, "device was already initialized");
            try {
                if (_phone != null) {
                    _phone.release();
                }
                createDeviceWithToken(token, dl);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }
    }

    private void createDeviceWithToken(String token, DeviceListener dl) {
        _phone = Twilio.createDevice(token, dl);
        /*
         * Providing a PendingIntent to the newly create Device, allowing you to receive incoming calls
         *
         *  What you do when you receive the intent depends on the component you set in the Intent.
         *
         *  If you're using an Activity, you'll want to override Activity.onNewIntent()
         *  If you're using a Service, you'll want to override Service.onStartCommand().
         *  If you're using a BroadcastReceiver, override BroadcastReceiver.onReceive().
         */
        Intent intent = new Intent();
        intent.setAction("com.rogchap.react.modules.twilio.incoming");
        PendingIntent pi = PendingIntent.getBroadcast(getReactApplicationContext(), 0, intent, 0);
        _phone.setIncomingIntent(pi);
        sendEvent("deviceReady", null);
    }

    @ReactMethod
    public void initWithTokenUrl(String tokenUrl) {
        StringBuilder sb = new StringBuilder();
        try {
            URLConnection conn = new URL(tokenUrl).openConnection();
            InputStream in = conn.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String line = reader.readLine();
            while (line != null) {
                sb.append(line);
            }
            // String line = "";
            // while ((line = reader.readLine()) != null) {
            //   sb.append(line);
            // }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
        }
        initWithToken(sb.toString());
    }

    @ReactMethod
    public void connect(ReadableMap readableMap) {
        if (_phone != null) {
            _connection = _phone.connect(convertToNativeMap(readableMap), this);
        } else {
            Log.e(TAG, "Device is null");
            params = Arguments.createMap();
            params.putString("err", "Device is null");
            sendEvent("connectionDidFail", params);
        }
    }

    private Map<String, String> convertToNativeMap(ReadableMap readableMap) {
        Map<String, String> hashMap = new HashMap<String, String>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType readableType = readableMap.getType(key);
            switch (readableType) {
                case String:
                    hashMap.put(key, readableMap.getString(key));
                    break;
                default:
                    throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
            }
        }
        return hashMap;
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
        _connection = _pendingConnection;
        _pendingConnection = null;
    }

    @ReactMethod
    public void ignore() {
        _pendingConnection.ignore();
    }

    @ReactMethod
    public void reject() {
        _pendingConnection.reject();
    }

    @ReactMethod
    public void setMuted(Boolean isMuted) {
        if (_connection != null && _connection.getState() == Connection.State.CONNECTED) {
            _connection.setMuted(isMuted);
        }
    }

    @ReactMethod
    public void sendDigits(String digits) {
        if (_connection != null && _connection.getState() == Connection.State.CONNECTED) {
            _connection.sendDigits(digits);
        }
    }

    /* Device Listener */
    @Override
    public void onStartListening(Device device) {
        // this happens every 80 seconds
        Log.d(TAG, "Device has started listening for incoming connections");
        // this event crashes the app when sent after the first time.
        // commenting out it for now.
        // sendEvent("deviceDidStartListening", null);
    }

    /* Device Listener */
    @Override
    public void onStopListening(Device device) {
        Log.d(TAG, "Device has stopped listening for incoming connections");
        sendEvent("deviceDidStopListening", null);
    }

    /* Device Listener */
    @Override
    public void onStopListening(Device device, int errorCode, String error) {
        Log.e(TAG, String.format("Device has encountered an error and has stopped" +
                " listening for incoming connections: %s", error));
        params = Arguments.createMap();
        if (error != null) {
            params.putString("err", error);
        }
        sendEvent("deviceDidStopListening", params);
    }

    /* Device Listener */
    @Override
    public boolean receivePresenceEvents(Device device) {
        return false;
    }

    /* Device Listener */
    @Override
    public void onPresenceChanged(Device device, PresenceEvent presenceEvent) {

    }

    /* ConnectionListener */

    @Override
    public void onConnecting(Connection connection) {
        params = Arguments.createMap();
        if (connection.getParameters().containsKey("To")) {
            params.putString("To", connection.getParameters().get("To"));
        }
        sendEvent("connectionDidStartConnecting", params);
    }

    @Override
    public void onConnected(Connection connection) {
        params = Arguments.createMap();
        if (connection.getParameters().containsKey("To")) {
            params.putString("To", connection.getParameters().get("To"));
        }
        sendEvent("connectionDidConnect", params);
    }

    @Override
    public void onDisconnected(Connection connection) {
        if (connection == _connection) {
            _connection = null;
        }
        if (connection == _pendingConnection) {
            _pendingConnection = null;
        }
        params = Arguments.createMap();
        if (connection.getParameters().containsKey("To")) {
            Log.d(TAG, "onDisconnected: containsKey To " + connection.toString());
            params.putString("To", connection.getParameters().get("To"));
        }
        sendEvent("connectionDidDisconnect", params);
    }

    @Override
    public void onDisconnected(Connection connection, int errorCode, String errorMessage) {
        params = Arguments.createMap();
        params.putString("err", errorMessage);
        sendEvent("connectionDidDisconnect", params);
    }

}
