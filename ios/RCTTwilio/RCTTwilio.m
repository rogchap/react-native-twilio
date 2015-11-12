//
//  RCTTwilio.m
//  RCTTwilio
//
//  Created by Roger Chapman on 11/11/2015.
//  Copyright © 2015 Rogchap Software. All rights reserved.
//

#import "RCTTwilio.h"

@implementation RCTTwilio {
    TCDevice* _phone;
    TCConnection* _connection;
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

RCT_EXPORT_METHOD(connect) {
    _connection = [_phone connect:nil delegate:nil];
}

RCT_EXPORT_METHOD(connect:(NSDictionary *) params) {
    _connection = [_phone connect:params delegate:nil];
}

RCT_EXPORT_METHOD(disconnect) {
    [_connection disconnect];
}

-(void)device:(TCDevice *)device didReceiveIncomingConnection:(TCConnection *)connection {
    if (device.state == TCDeviceStateBusy) {
        [connection reject];
    } else {
        [connection accept];
        _connection = connection;
    }
}

-(void)deviceDidStartListeningForIncomingConnections:(TCDevice*)device {
    NSLog(@"Device: %@ deviceDidStartListeningForIncomingConnections", device);
}

-(void)device:(TCDevice *)device didStopListeningForIncomingConnections:(NSError *)error {
    NSLog(@"Device: %@ didStopListeningForIncomingConnections: %@", device, error);
}


@end
