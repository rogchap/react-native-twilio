export const INIT_TELEPHONY_START     = 'INIT_TELEPHONY_START'
export const DEVICE_READY             = 'DEVICE_READY'
export const DEVICE_CREATION_FAILURE  = 'DEVICE_CREATION_FAILURE'
export const CALL_START               = 'CALL_START'
export const ACCEPT_CALL              = 'ACCEPT_CALL'
export const IGNORE_CALL              = 'IGNORE_CALL'
export const REJECT_CALL              = 'REJECT_CALL'
export const END_CALL                 = 'END_CALL'
export const CONNECTION_START         = 'CONNECTION_START'
export const CONNECTION_SUCCESS       = 'CONNECTION_SUCCESS'
export const CONNECTION_FAILURE       = 'CONNECTION_FAILURE'
export const CONNECTION_STOP          = 'CONNECTION_STOP'
export const DEVICE_LISTENING_START   = 'DEVICE_LISTENING_START'
export const DEVICE_LISTENING_STOP    = 'DEVICE_LISTENING_STOP'
export const DEVICE_RECEIVED_INCOMING = 'DEVICE_RECEIVED_INCOMING'

export function connectionDidStartConnecting(params) {
    let To = ''
    if (params && params.To) {
        To = params.To
    }
    return {
        type: CONNECTION_START,
        To:   To,
    }
}

export function connectionDidConnect(params) {
    return {
        type:   CONNECTION_SUCCESS,
        params: params,
    }
}

export function connectionDidFail(params) {
    return {
        type: CONNECTION_FAILURE,
        err:  (params && params.err) ? params.err : null,
    }
}

export function connectionDidDisconnect(params) {
    return {
        type: CONNECTION_STOP,
        err:  (params && params.err) ? params.err : null,
    }
}

export function deviceDidStartListening(params) {
    return {
        type:   DEVICE_LISTENING_START,
        params: params,
    }
}

export function deviceDidStopListening(params) {
    return {
        type: DEVICE_LISTENING_STOP,
        err:  (params && params.err) ? params.err : null,
    }
}

export function deviceDidReceiveIncoming(params) {
    return {
        type: DEVICE_RECEIVED_INCOMING,
        From: params.From,
    }
}

export function makeCallStart(number) {
    return {
        type:   CALL_START,
        number: number,
    }
}

export function acceptCall() {
    return {
        type: ACCEPT_CALL,
    }
}

export function rejectCall() {
    return {
        type: REJECT_CALL,
    }
}

export function ignoreCall() {
    return {
        type: IGNORE_CALL,
    }
}

export function endCall() {
    return {
        type: END_CALL,
    }
}

export function initTelephonyStart(client) {
    return {
        type:   INIT_TELEPHONY_START,
        client: client,
    }
}

export function deviceReady() {
    return {
        type: DEVICE_READY,
    }
}

export function telephonyInitFailure(err) {
    return {
        type: DEVICE_CREATION_FAILURE,
        err:  err,
    }
}
