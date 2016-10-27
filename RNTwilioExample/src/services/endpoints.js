import Config from 'react-native-config'

export default {
    calls: {
        make:  Config.API_URL + 'calls/',
        token: Config.API_URL + 'token/',
    }
}
