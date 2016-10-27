# react-native-twilio example project

The Example show you how to:

- initialize the device
- make calls
- receive calls

# ios
Currently the ios example app is not done.

# android

## setup

### server

The server must implement:
- GET /token/
- POST /calls/

If you don't have your server code yet you can simply use a server example provided by Twilio. The simplier way is to download and run a the Python example
[mobile-quickstart](https://github.com/twilio/mobile-quickstart).

You will need to amend `server.py` to use your Twilio credentials.


The app only needs two endpoints running:

	# TwiML response for incoming/outgoing calls
	GET or POST http://localhost:5000/calls/
  
	# generate a JWT token for the app to initialise the device
	GET http://localhost:5000/token/


Setup an TwiML app through the Twilio Console and use the `APP_ID` for the server configuration.

Then you need to expose the server to the outside world so that Twilio can contact it when it looks for the TwiML to answer calls. You can use [ngrok](https://ngrok.com/) to do that
 
	./ngrok http 5000
 	# 5000 is the port you specified in server.py


### react-native
You will need to have `react-native` installed and available in your `PATH`.

Add your server IP address to `.env`

	ENV=dev
	API_URL=http://SERVER_IP_ADDRESS:YOUR_SERVER_PORT/

```bash
# install JS dependencies
cd RNTwilioExample
npm install

# run the JS packager
npm start

# compile and install a debug build
ENVFILE=.env react-native run-android
# or simply
react-native run-android
# because .env is the default config file
```

Now `reload JS` and you should be connected.

# help

If you spot some problems with this instructions or want to help clarifying them feel free to open a PR.
