(function (root) {
  Pushwoosh = {};

  Pushwoosh.initPushwoosh = function() {
    this.pushNotification =
      cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    if (device.platform === "Android") {
      this._initAndroid();
    } else if (device.platform === "iOS") {
      this._initIOs();
    }

    //reset badges on app start
    this.pushNotification.setApplicationIconBadgeNumber(0);
  }

  Pushwoosh._initAndroid = function() {
    //initialize Pushwoosh. This will trigger all pending push notifications on start.
    this.pushNotification.onDeviceReady({
      projectid: Meteor.settings.public.pushwoosh.google.project_number,
      pw_appid : Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) {
        var pushToken = status;
        console.warn('push token: ' + pushToken);
      },
      function(status) {
        console.warn(JSON.stringify(['failed to register ', status]));
      }
    );
  }

  Pushwoosh._initIOs = function() {
    this.pushNotification.onDeviceReady({
      pw_appid: Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) {
        var deviceToken = status['deviceToken'];
        console.warn('registerDevice: ' + deviceToken);
      },
      function(status) {
        console.warn('failed to register : ' + JSON.stringify(status));
        alert(JSON.stringify(['failed to register ', status]));
      }
    );
  }

  Pushwoosh.createMessage = function(notification) {
    throw new Meteor.Error('302', 'Only supported on server');
  }

  root.Pushwoosh = Pushwoosh;
})(this)
