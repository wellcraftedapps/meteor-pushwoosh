#Pushwoosh package for Meteor

Pushwoosh is a service that makes it easy to send push notifications to your (mobile) app.

This package:

- Allows you to send (server) and receive (app) push notifications.
- Allows querying by user when creating a notification.
- Works for iOs and Android devices and includes `cordova-plugin-device` for
  device detection.

## Install

> meteor add lpender:pushwoosh

## Usage

### Add your Pushwoosh settings to settings file

```json
{
  "public" : {
    "pushwoosh" : {
      "appId": "XXXXX-XXXXX",
      "google": {
        "project_number": "123456"
      }
    }
  },
  "pushwoosh": {
    "appId": "XXXXX-XXXXX",
    "token": "sample_pushwoosh_token"
  }
}
```

You can request the "token" in the Pushwoosh admin panel.

### Add this to your `mobile-config.js` file

```
App.accessRule('*');
```

You may also need to add `cordova-whitelist`

### Send a push notification:

    if (Meteor.isServer) {

      Pushwoosh.createMessage({
        "query": { _id: Meteor.userId() },
        "send_date": "now",
        "ignore_user_timezone": true,
        "content": "Your message"
      });

    }

You can pass this method an array of objects, if you'd like to send more than
one message.

[createMessage API](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/).

### Receive a push notification

In order to message specific users via their devices, you have to associate
`pushwoosh_device_token`s with each of your users.

This value is stored in a `Session` variable if users are not logged in.

To associate users with their device tokens upon login:

    Accounts.onLogin(function(succ) {
      var token;
      if (Meteor.isClient) {
        if (token = Session.get('pushwoosh_device_token')) {
          Meteor.users.update({ _id: succ.user._id },
            {
              $addToSet: {
                'services.pushwoosh.deviceTokens': token
              }
            }
          );
        }
      }
    });

    Meteor.users.allow({
      update: function(userId, doc) {
        return (
          userId === doc._id
        )
      }
    });

## Handling notifications in-app

Push notifications do not usually appear while the app is in-use.

However, there are JavaScript events that you can listen for, to handle
this scenario:

    if (Meteor.isClient) {
      Meteor.startup(function(){
        Pushwoosh.initPushwoosh();

        document.addEventListener('push-notification', function(event){
          if (device.platform === "iOS") {
            //get the notification payload
            var notification = event.notification;

            //display alert to the user for example
            alert(notification.aps.alert);
          } else if (device.platform === "Android") {
            var title = event.notification.title;
            var userData = event.notification.userdata;

            if(typeof(userData) != "undefined") {
              console.warn('user data: ' + JSON.stringify(userData));
            }

            alert(title);
          }
        });
      });
    }

[Cordova Pushwoosh API](http://docs.pushwoosh.com/docs/cordova-phonegap).

## Notes

Please be sure to use the sandbox key for development.

## Todo

Testing.
