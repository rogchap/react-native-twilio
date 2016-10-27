import { combineReducers } from 'redux'

import telephonyService from './services/telephony'

import {
    INIT_TELEPHONY_START,
    DEVICE_READY,
    DEVICE_CREATION_FAILURE,
    CALL_START,
    ACCEPT_CALL,
    IGNORE_CALL,
    REJECT_CALL,
    END_CALL,
    CONNECTION_START,
    CONNECTION_SUCCESS,
    CONNECTION_FAILURE,
    CONNECTION_STOP,
    DEVICE_LISTENING_START,
    DEVICE_LISTENING_STOP,
    DEVICE_RECEIVED_INCOMING,
} from './actions'


const telephonyInitialState = {
    deviceReady: false,
    deviceError: null,
    clientName:  'jenny',
}

const callInitialState = {
    callDirection:  null,
    callingError:   null,
    callFromNumber: null,
    callToNumber:   null,
    listening:      false,
}

function telephonyState(state = telephonyInitialState, action = {}) {
    switch (action.type) {
        case INIT_TELEPHONY_START:
            telephonyService.init(action.client)
            return Object.assign({}, state, {
                deviceError: null,
            })

        case DEVICE_READY:
            telephonyService.initListeners()
            return Object.assign({}, state, {
                deviceReady: true,
                deviceError: null,
            })

        case DEVICE_CREATION_FAILURE:
            return Object.assign({}, state, {
                deviceReady: false,
                deviceError: action.err,
            })

        default:
            return state
    }
}

function callState(state = callInitialState, action = {}) {
    switch (action.type) {
        case CONNECTION_START:
            return Object.assign({}, state, {
                callFromNumber: action.From,
                callToNumber: action.To,
            })

        case CONNECTION_SUCCESS:
            return state

        case CONNECTION_FAILURE:
            return Object.assign({}, state, {
                callDirection: null,
                callFromNumber: null,
                callToNumber: null,
                callingError: action.err,
            })

        case CONNECTION_STOP:
            return Object.assign({}, state, {
                callFromNumber: null,
                callToNumber: null,
                callingError: action.err,
            })

        case CALL_START:
            telephonyService.makeCall(action.number)
            return Object.assign({}, state, {
                callDirection: 'out',
                callFromNumber: null,
                callToNumber: action.number,
                callingError: null,
            })

        case DEVICE_LISTENING_START:
            return Object.assign({}, state, {
                listening: true,
            })

        case DEVICE_RECEIVED_INCOMING:
            return Object.assign({}, state, {
                callDirection: 'in',
                callFromNumber: action.From,
                callToNumber: null,
                callingError: null,
            })

        case DEVICE_LISTENING_STOP:
            return Object.assign({}, state, {
                listening: false,
                listeningError: params.err,
            })

        case ACCEPT_CALL:
            telephonyService.acceptCall()
            return Object.assign({}, state, {
                callingError: null,
            })

        case REJECT_CALL:
            telephonyService.rejectCall()
            return Object.assign({}, state, {
                callDirection: null,
                callFromNumber: null,
                callToNumber: null,
                callingError: null,
            })

        case IGNORE_CALL:
            telephonyService.ignoreCall()
            return Object.assign({}, state, {
                callDirection: null,
                callFromNumber: null,
                callToNumber: null,
                callingError: null,
            })

        case END_CALL:
            telephonyService.endCall()
            return Object.assign({}, state, {
                callDirection: null,
                callFromNumber: null,
                callToNumber: null,
                callingError: null,
            })

        default:
            return state
    }
}

const appReducers = combineReducers({
    callState,
    telephonyState,
})

export default appReducers
