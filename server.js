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

function getUsers(data) {
  // Find the users that match the included query
  Meteor.users.find(data.query).fetch().filter(function(user) {
    return user.services.pushwoosh && typeof user.services.pushwoosh.deviceTokens == 'object'
  });
}

function getDevicesFor(users) {
  // map devices onto notification
  var devices = [];

  users.forEach(function(user) {
    Array.prototype.push.apply(
      devices,
      user.services.pushwoosh.deviceTokens
    );
  });
}

Pushwoosh.createMessage = function(data) {
  var Pushwoosh = NPM.require('pushwoosh-client');
  var client = new Pushwoosh(Meteor.settings.public.pushwoosh.appId, Meteor.settings.pushwoosh.token);

  console.log("lpender:pushwoosh : createMessage received data")
  console.log(data)

  users = getUsers(data);

  console.log("lpender:pushwoosh : pushing to users");
  console.log(users);

  devices = getDevicesFor(users);

  console.log("lpender:pushwoosh : pushing to devices")
  console.log(devices)

  client.sendMessage(data.content, devices, data)
};
