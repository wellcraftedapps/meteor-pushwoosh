#Pushwoosh package for Meteor

Pushwoosh is a service that makes it easy to send push notifications to your (mobile) app.

This package allows you to send (server) and receive (app) push notifications.

This package works for iOs and Android devices and includes
`cordova-plugin-device` for device detection.

## Install

> meteor add lpender:pushwoosh

## Usage

### Add your Pushwoosh settings to settings file

```json
{
  "public" : {
    "pushwoosh" : {
      "appId": "XXXXX-XXXXX"
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

You can request the token in the Pushwoosh admin panel.

### Add this to your `mobile-config.js` file

```
App.accessRule('*');
```

### Receiving events

Because receive events use a
[different API](http://docs.pushwoosh.com/docs/cordova-phonegap) for different
devices, they need to be dealt with differently.

The pushwoosh package allows you to deal with events yourself by triggering
different events for each device.

Here are some sample ways of handling push notifications in your app.

/client/push.js

    Meteor.startup(function(){
      Pushwoosh.initPushwoosh();

      document.addEventListener('push-notification', function(event){
        if (device.platform === "iOS") {
          //get the notification payload
          var notification = event.notification;

          //display alert to the user for example
          alert(notification.aps.alert);

          //clear the app badge
          pushNotification.setApplicationIconBadgeNumber(0);
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

## Server

To send a push notification call:

    Pushwoosh.createMessage({
      "send_date": "now",
      "ignore_user_timezone": true,
      "content": "Your message"
    });

When called client-side this method does nothing.

There are a lot of extra parameters available. You can check them [here](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/).

You can pass this method an array if you'd like to send more than one message.

## Notes

Please be sure to use the sandbox key for development or you will receive erros.

## Todo

Implement other calls.
