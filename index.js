let React = require('react-native');
let { NativeModules, NativeAppEventEmitter } = React;

let TwilioRCT = NativeModules.Twilio;

let _eventHandlers = {
  deviceDidStartListening: new Map(),
  deviceDidStopListening: new Map(),
  deviceDidReceiveIncoming: new Map(),
  connectionDidFail: new Map(),
  connectionDidStartConnecting: new Map(),
  connectionDidConnect: new Map(),
  connectionDidDisconnect: new Map(),
};

let Twilio = {
  initWithTokenUrl(tokenUrl) {
    TwilioRCT.initWithTokenUrl(tokenUrl);
  },
  connect(params = {}) {
    TwilioRCT.connect(params);
  },
  disconnect() {
    TwilioRCT.disconnect();
  },
  accept() {
    TwilioRCT.accept();
  },
  reject() {
    TwilioRCT.reject();
  },
  ignore() {
    TwilioRCT.ignore();
  },
  addEventListener(type, handler) {
    _eventHandlers[type].set(handler, NativeAppEventEmitter.addListener(
      type, rtn => {
        handler(rtn);
      }
    ));
  },
  removeEventListener(type, handler) {
    if (!_eventHandlers[type].has(handler)) {
      return;
    }
    _eventHandlers[type].get(handler).remove();
    _eventHandlers[type].delete(handler);
  },
};

module.exports = Twilio;
