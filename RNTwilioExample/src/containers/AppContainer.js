'use strict'

import React, {PropTypes} from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import {
    initTelephonyStart,
    makeCallStart,
    endCall,
    acceptCall,
} from '../actions'

import InputPrompt from '../components/InputPrompt'

const AppContainer = React.createClass({

    renderTelephonyStatus() {
        if (this.props.deviceError) {
            return <Text>Telephone error {this.props.deviceError}</Text>
        }
        if (this.props.deviceReady) {
            return <View>
                <Text>Telephone READY</Text>
                <Text>Listening {this.props.listening}</Text>
            </View>
        }
        if (this.props.clientName) {
            return <View>
                <Text>Telephone NOT READY</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {this.props.telephonyActions.initTelephonyStart(this.props.clientName)}}>
                    <Text style={styles.buttonText}>init device with token</Text>
                </TouchableOpacity>
            </View>
        }
    },

    // componentDidMount() {
    //     this.props.telephonyActions.initTelephonyStart(this.props.clientName)
    // },

    getInitialState() {
        return {
            callToNumber: this.props.callToNumber
        }
    },

    renderInputNumber() {
        if (this.props.deviceReady === false) {
            return null
        }

        const callNumber = () => {
            this.props.telephonyActions.makeCallStart(this.state.callToNumber)
        }
        const onSubmit = (event) => {
            this.state.callToNumber = event.nativeEvent.text
            callNumber()
        }
        const onChangeText = (text) => {
            this.setState({callToNumber: text})
        }
        return <View>
            <InputPrompt
                label="phone number to call"
                placeholder="Who would you like to call?"
                value={this.state.callToNumber}
                autoCorrect={false}
                autoFocus={false}
                keyboardType="phone-pad"
                underlineColorAndroid="rgba(0, 0, 0, 0)"
                onSubmit={onSubmit}
                onChangeText={onChangeText}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => callNumber()}>
                    <Text style={styles.buttonText}>DIAL</Text>
                </TouchableOpacity>
            </View>
    },

    hangup() {
        this.props.telephonyActions.endCall()
    },

    answer() {
        this.props.telephonyActions.acceptCall()
    },

    renderCallProgress() {
        if (this.props.deviceReady === false) {
            return null
        }

        if (this.props.callDirection === 'out') {
            return <View>
                <Text>You are dialing {this.props.callToNumber}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {this.hangup()}}>
                    <Text style={styles.buttonText}>Hang Up</Text>
                </TouchableOpacity>
            </View>
        }
        if (this.props.callDirection === 'in') {
            return <View>
                <Text>{this.props.callFromNumber} is calling</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {this.answer()}}>
                    <Text style={styles.buttonText}>Answer</Text>
                </TouchableOpacity>
            </View>
        }
    },

    renderListeningError() {
        if (this.props.callingError) {
            return <Text>calling errors: {this.props.callingError}</Text>
        }
    },

    renderCallingError() {
        if (this.props.listeningError) {
            return <Text>listening errors: {this.props.listeningError}</Text>
        }
    },


    render() {

        return (
            <View style={styles.outerContainer}>
                <Text>React Native Twilio Example</Text>
                {this.renderTelephonyStatus()}
                <Text>Your client name is: {this.props.clientName}</Text>
                {this.renderListeningError()}
                {this.renderInputNumber()}
                {this.renderCallProgress()}
                {this.renderCallingError()}
            </View>
        )
    }

})


AppContainer.propTypes = {
    telephonyActions: PropTypes.object.isRequired,
    clientName:       PropTypes.string.isRequired,
    callToNumber:     PropTypes.string,
    callFromNumber:   PropTypes.string,
    callingError:     PropTypes.string,
    callDirection:    PropTypes.string,
    listening:        PropTypes.bool.isRequired,
    listeningError:   PropTypes.string,
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        padding: 10,
    },
    container: {
        flex: 1,
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#111',
        alignSelf: 'center',
    },
})

function mapStateToProps(state) {
    const {
        telephonyState,
        callState,
    } = state
    const {
        deviceReady,
        clientName,
    } = telephonyState

    const {
        callToNumber,
        callFromNumber,
        callingError,
        callDirection,
        listening,
        listeningError,
    } = callState
    return {
        deviceReady,
        clientName,
        callToNumber,
        callFromNumber,
        callingError,
        callDirection,
        listening,
        listeningError,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        telephonyActions: bindActionCreators({initTelephonyStart, makeCallStart, endCall, acceptCall}, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer)
