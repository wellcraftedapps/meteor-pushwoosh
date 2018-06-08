Package.describe({
  name: 'wellcraftedapps:pushwoosh',
  summary: 'Send and receive push notifications via Pushwoosh (forked from lpender:pushwoosh)',
  version: '3.0.0',
  git: 'https://github.com/wellcraftedapps/meteor-pushwoosh.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1.1');
  api.addFiles('cordova.js', 'web.cordova');
  api.addFiles('browser.js', 'web.browser');
  api.addFiles('server.js', 'server');
  api.addFiles('methods.js', ['web.browser', 'web.cordova', 'server']);
  api.use('http');
  api.export('Pushwoosh');
});

Package.onTest(function(api) {

});

Cordova.depends({
  'pushwoosh-cordova-plugin': '7.5.0',
  'cordova-plugin-device': '1.1.6'
});

Npm.depends({
  "request": "2.85.0"
});
