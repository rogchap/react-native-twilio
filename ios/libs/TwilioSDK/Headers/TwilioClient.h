//
//  Copyright 2011-2016 Twilio. All rights reserved.
//
//  Use of this software is subject to the terms and conditions of the 
//  Twilio Terms of Service located at http://www.twilio.com/legal/tos
//

#import "TCConnection.h"
#import "TCConnectionDelegate.h"
#import "TCDevice.h"
#import "TCDeviceDelegate.h"
#import "TCPresenceEvent.h"

@interface TwilioClient : NSObject 

/*!
 *
 * @enum Different logging levels.
 *
 */
typedef NS_ENUM(NSInteger, TCLogLevel) {
    TC_LOG_OFF = 0,
    TC_LOG_ERROR,
    TC_LOG_WARN,
    TC_LOG_INFO,
    TC_LOG_DEBUG,
    TC_LOG_VERBOSE
};


/*! Version of the TwilioClient SDK. */
@property (nonatomic, strong, readonly, nonnull) NSString *version;

/*!
 *
 * This class method returns a singleton reference of the TwilioClient.
 *
 * @return Reference of type TwilioClient.
 *
 */
+ (nonnull id)sharedInstance;


/*!
 *
 * The version of the TwilioClient SDK
 *
 * @returns The SDK version in NSString
 *
 */
+ (nonnull NSString *)version;


/*!
 *
 * This method allows you configure different levels of TwilioClient logging.
 *
 * @see TCLogLevel
 *
 */
- (void)setLogLevel:(TCLogLevel)level;


/*!
 *
 * Enable or disable call quality metrics reporting.
 * Reporting is enabled by default.
 *
 * @param enabled 'YES' to enable; 'NO' to disable.
 *
 */
- (void)setMetricsEnabled:(BOOL)enabled;

@end

