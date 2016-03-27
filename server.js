Pushwoosh = {}

Pushwoosh.initPushwoosh = function(appId) {
  return true;
}

/*
 * createMessage({
 *   query: { _id: Meteor.user()._id },
 *   message: "YAS"
 * });
 */
Pushwoosh.createMessage = function(notifications) {
  if(notifications instanceof Array) {
  } else {
    notifications = [notifications];
  }

  var request = Npm.require('request');

  // map devices onto notification
  notifications = notifications.map(function(notification) {
    var devices = [];

    // Find the users that match the included query
    var users = Meteor.users.find(notification.query).fetch();

    users.forEach(function(user) {
      if (typeof user.profile.pushwoosh_device_tokens == 'object') {
        Array.prototype.push.apply(
          devices,
          user.services.pushwoosh.deviceTokens
        );
      }
    });

    notification.devices = devices;

    return notification;
  });

  var data = {
    request: {
      application: Meteor.settings.pushwoosh.appId,
      auth: Meteor.settings.pushwoosh.token,
      notifications: notifications
    }
  };

  // for each notification, do it up right
  request({
    uri: 'https://cp.pushwoosh.com/json/1.3/createMessage',
    body: data,
    json: true,
    method: 'post'
  }, function(err, res) {
    //console.log(res);
  });
};
