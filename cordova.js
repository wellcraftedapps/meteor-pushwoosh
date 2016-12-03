(function (root) {
  Pushwoosh = {};

  Pushwoosh.initPushwoosh = function() {
    this.pushNotification =
      cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set config
    this.pushNotification.onDeviceReady({
      projectid: Meteor.settings.public.pushwoosh.google.project_number,
      pw_appid : Meteor.settings.public.pushwoosh.appId
    });

    //register for pushes
    this.pushNotification.registerDevice(
      function(status) { _this._register(status.pushToken) },
      _this._registerFail
    );

    //reset badges on app start
    this.pushNotification.setApplicationIconBadgeNumber(0);
  }

  Pushwoosh._register = function(token) {
    console.log('calling registertoken')
    Tracker.autorun(function() {
      Meteor.call('registerToken', token, Meteor.userId())
    });
  };

  Pushwoosh._registerFail = function(status) {
    console.error('failed to register : ' + JSON.stringify(status));
  };

  Pushwoosh.createMessage = function(notification) {
    throw new Meteor.Error('302', 'Only supported on server');
  }

  root.Pushwoosh = Pushwoosh;
})(this)
