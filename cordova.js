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

  // This will trigger all pending push notifications on start.
  Pushwoosh._initAndroid = function() {
    var _this = this;

    this.pushNotification.onDeviceReady({
      projectid: Meteor.settings.public.pushwoosh.google.project_number,
      pw_appid : Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(token) { _this._register(token) },
      _this._registerFail
    );
  }

  // This will trigger all pending push notifications on start.
  Pushwoosh._initIOs = function() {
    var _this = this;

    this.pushNotification.onDeviceReady({
      pw_appid: Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) { _this._register(status['deviceToken'])},
      _this._registerFail
    );
  }

  Pushwoosh._register = function(token) {
    var userId;
    console.log('push token: ' + token);

    if (userId = Meteor.userId()) {
      console.log("adding to userId: " + userId);
      Meteor.users.update({ _id: userId }, {
        $addToSet: { 'services.pushwoosh.deviceTokens': token }
      });
    }

    Session.set('pushwoosh_device_token', token);
  };

  Pushwoosh._registerFail = function(status) {
    console.error('failed to register : ' + JSON.stringify(status));
  };

  Pushwoosh.createMessage = function(notification) {
    throw new Meteor.Error('302', 'Only supported on server');
  }

  root.Pushwoosh = Pushwoosh;
})(this)
