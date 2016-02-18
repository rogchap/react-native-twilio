//
//  RCTTwilio.m
//  RCTTwilio
//
//  Created by Roger Chapman on 11/11/2015.
//  Copyright © 2015 Rogchap Software. All rights reserved.
//

#import "RCTTwilio.h"
#import "RCTEventDispatcher.h"

@implementation RCTTwilio {
    TCDevice* _phone;
    TCConnection* _connection;
    TCConnection* _pendingConnection;
}

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

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

#pragma mark - TCDeviceDelegate

-(void)device:(TCDevice *)device didReceiveIncomingConnection:(TCConnection *)connection {
    _pendingConnection = connection;
    [_pendingConnection setDelegate:self];
    [self.bridge.eventDispatcher sendAppEventWithName:@"deviceDidReceiveIncoming" body:connection.parameters];
}

-(void)deviceDidStartListeningForIncomingConnections:(TCDevice*)device {
    [self.bridge.eventDispatcher sendAppEventWithName:@"deviceDidStartListening" body:nil];
}

-(void)device:(TCDevice *)device didStopListeningForIncomingConnections:(NSError *)error {
    id body = nil;
    if (error != nil) {
        body = @{@"err": [error localizedDescription]};
    }
    [self.bridge.eventDispatcher
     sendAppEventWithName:@"deviceDidStopListening" body:body];
}

#pragma mark - TCConnectionDelegate

-(void)connection:(TCConnection *)connection didFailWithError:(NSError *)error {
    [self.bridge.eventDispatcher
     sendAppEventWithName:@"connectionDidFail" body:@{@"err": [error localizedDescription]}];
}

-(void)connectionDidStartConnecting:(TCConnection *)connection {
    [self.bridge.eventDispatcher
     sendAppEventWithName:@"connectionDidStartConnecting" body:connection.parameters];
}

-(void)connectionDidConnect:(TCConnection *)connection {
    [self.bridge.eventDispatcher
     sendAppEventWithName:@"connectionDidConnect" body:nil];
}

-(void)connectionDidDisconnect:(TCConnection *)connection {
    if (connection == _connection) {
        _connection = nil;
    }
    
    if (connection == _pendingConnection) {
        _pendingConnection = nil;
    }
    [self.bridge.eventDispatcher
     sendAppEventWithName:@"connectionDidDisconnect" body:nil];
}

@end
