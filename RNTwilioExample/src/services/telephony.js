import qs from 'qs'

import Twilio from 'react-native-twilio'

import endpoints from './endpoints'

import store from '../store'

import {
    deviceDidStartListening,
    deviceDidStopListening,
    deviceDidReceiveIncoming,
    connectionDidStartConnecting,
    connectionDidConnect,
    connectionDidDisconnect,
    connectionDidFail,
} from '../actions'

import {
    deviceReady,
} from '../actions'

function _deviceDidStartListening(params) {
    store.dispatch(deviceDidStartListening(params))
}

function _deviceDidStopListening(params) {
    store.dispatch(deviceDidStopListening(params))
}

function _deviceDidReceiveIncoming(params) {
    store.dispatch(deviceDidReceiveIncoming(params))
}

function _connectionDidStartConnecting(params) {
    store.dispatch(connectionDidStartConnecting(params))
}

function _connectionDidConnect(params) {
    store.dispatch(connectionDidConnect(params))
}

function _connectionDidDisconnect(params) {
    store.dispatch(connectionDidDisconnect(params))
}

function _connectionDidFail(params) {
    store.dispatch(connectionDidFail(params))
}

function _deviceReady(params) {
    store.dispatch(deviceReady(params))
}

let telephonyService = {
    init(client) {
        this.initDeviceListeners()

        let urlEncodedQuery = qs.stringify({client: client})
        let url = `${endpoints.calls.token}?${urlEncodedQuery}`
        console.log('token url', url)
        // Could use the Native fetcher as well
        // Twilio.initWithTokenUrl(url)

        return fetch(url)
            .then(res => res.text())
            .then(token => {
                console.log('token =>', token)
                Twilio.initWithToken(token)
                return true
            })
    },
    makeCall(number) {
        console.log('telephonyService::makeCall()', number)
        Twilio.connect({
            To: number
        })
        return
    },
    acceptCall() {
        console.log('telephonyService::acceptCall()')
        Twilio.accept()
        return
    },
    rejectCall() {
        console.log('telephonyService::rejectCall()')
        Twilio.reject()
        return
    },
    ignoreCall() {
        console.log('telephonyService::ignoreCall()')
        Twilio.ignore()
        return
    },
    endCall() {
        console.log('telephonyService::endCall()')
        Twilio.disconnect()
        return
    },
    initDeviceListeners() {
        Twilio.addEventListener('deviceReady', _deviceReady)
    },
    initListeners() {
        Twilio.addEventListener('deviceDidStartListening', _deviceDidStartListening)
        Twilio.addEventListener('deviceDidStopListening', _deviceDidStopListening)
        Twilio.addEventListener('deviceDidReceiveIncoming', _deviceDidReceiveIncoming)

        Twilio.addEventListener('connectionDidStartConnecting', _connectionDidStartConnecting)
        Twilio.addEventListener('connectionDidConnect', _connectionDidConnect)
        Twilio.addEventListener('connectionDidDisconnect', _connectionDidDisconnect)
        Twilio.addEventListener('connectionDidFail', _connectionDidFail)

    }
}

export default telephonyService
