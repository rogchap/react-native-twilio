//
//  RCTTwilio.m
//  RCTTwilio
//
//  Created by Roger Chapman on 11/11/2015.
//  Copyright © 2015 Rogchap Software. All rights reserved.
//

#import "RCTTwilio.h"
#import "RCTEventEmitter.h"

NSString *const deviceDidReceiveIncoming = @"deviceDidReceiveIncoming";
NSString *const deviceDidStartListening = @"deviceDidStartListening";
NSString *const deviceDidStopListening = @"deviceDidStopListening";
NSString *const connectionDidFail = @"connectionDidFail";
NSString *const connectionDidStartConnecting = @"connectionDidStartConnecting";
NSString *const connectionDidConnect = @"connectionDidConnect";
NSString *const connectionDidDisconnect = @"connectionDidDisconnect";

@implementation RCTTwilio
{
  TCDevice* _phone;
  TCConnection* _connection;
  TCConnection* _pendingConnection;
}

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (NSArray<NSString *> *)supportedEvents {
  return @[deviceDidReceiveIncoming, deviceDidStartListening, deviceDidStopListening, connectionDidFail, connectionDidStartConnecting, connectionDidConnect, connectionDidDisconnect];
}

RCT_EXPORT_METHOD(initWithTokenUrl:(NSString *) tokenUrl) {
  NSURL *url = [NSURL URLWithString: tokenUrl];
  NSError *error = nil;
  NSString *token = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:&error];
  if (token == nil) {
    NSLog(@"Error retrieving token: %@", [error localizedDescription]);
  } else {
    _phone = [[TCDevice alloc] initWithCapabilityToken:token delegate:self];
  }
}

RCT_EXPORT_METHOD(initWithToken:(NSString *) token) {
  _phone = [[TCDevice alloc] initWithCapabilityToken:token delegate:self];
}

RCT_EXPORT_METHOD(connect:(NSDictionary *) params) {
  _connection = [_phone connect:params delegate:self];
}

RCT_EXPORT_METHOD(disconnect) {
  [_connection disconnect];
}

RCT_EXPORT_METHOD(accept) {
  [_pendingConnection accept];
  _connection = _pendingConnection;
  _pendingConnection = nil;
}

RCT_EXPORT_METHOD(reject) {
  [_pendingConnection reject];
}

RCT_EXPORT_METHOD(ignore) {
  [_pendingConnection ignore];
}

RCT_EXPORT_METHOD(setMuted:(BOOL)isMuted) {
  if (_connection && _connection.state == TCConnectionStateConnected) {
    [_connection setMuted:isMuted];
  }
}

RCT_EXPORT_METHOD(sendDigits:(NSString *) digits) {
  if (_connection && _connection.state == TCConnectionStateConnected) {
    [_connection sendDigits:digits];
  }
}

#pragma mark - TCDeviceDelegate

-(void)device:(TCDevice *)device didReceiveIncomingConnection:(TCConnection *)connection {
  _pendingConnection = connection;
  [_pendingConnection setDelegate:self];
  [self sendEventWithName:deviceDidReceiveIncoming body:connection.parameters];
}

-(void)deviceDidStartListeningForIncomingConnections:(TCDevice*)device {
  [self sendEventWithName:deviceDidStartListening body:nil];
}

-(void)device:(TCDevice *)device didStopListeningForIncomingConnections:(NSError *)error {
  id body = nil;
  if (error != nil) {
    body = @{@"err": [error localizedDescription]};
  }
  [self sendEventWithName:deviceDidStopListening body:body];
}

#pragma mark - TCConnectionDelegate

-(void)connection:(TCConnection *)connection didFailWithError:(NSError *)error {
  [self sendEventWithName:connectionDidFail body:@{@"err": [error localizedDescription]}];
}

-(void)connectionDidStartConnecting:(TCConnection *)connection {
  [self sendEventWithName:connectionDidStartConnecting body:connection.parameters];
}

-(void)connectionDidConnect:(TCConnection *)connection {
  [self sendEventWithName:connectionDidConnect body:nil];
}

-(void)connectionDidDisconnect:(TCConnection *)connection {
  if (connection == _connection) {
    _connection = nil;
  }
  
  if (connection == _pendingConnection) {
    _pendingConnection = nil;
  }
  [self sendEventWithName:connectionDidDisconnect body:nil];
}

@end
