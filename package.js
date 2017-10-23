Package.describe({
  name: 'faburem:client-server-logger',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Boilerplate for ostrio:logger to enable easy client side logging to the server console',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/faburem/meteor-client-server-logger',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4')
  api.use(['ecmascript','ostrio:logger@2.0.4', 'ostrio:loggerconsole@2.0.2'], ['client', 'server'])
  api.mainModule('client-server-logger.js', 'server')
  api.mainModule('init-client.js', 'client')
});

Package.onTest(function(api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('faburem:client-server-logger')
  api.mainModule('client-server-logger-tests.js')
})
