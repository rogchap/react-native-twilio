//
//  RCTTwilio.h
//  RCTTwilio
//
//  Created by Roger Chapman on 11/11/2015.
//  Copyright © 2015 Rogchap Software. All rights reserved.
//

#import "RCTBridgeModule.h"
#import "TwilioClient.h"
#import "RCTEventEmitter.h"

@interface RCTTwilio : RCTEventEmitter <RCTBridgeModule, TCDeviceDelegate, TCConnectionDelegate>
@end
