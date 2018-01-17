Package.describe({
  name: "levensailor:ciscospark",
  summary: "Ciscospark OAuth flow",
  version: "1.0.0",
  git: 'https://github.com/levensailor/ciscospark-oauth.git'
});

Package.onUse(function(api) {
  api.use('oauth2@1.1.10', ['client', 'server']);
  api.use('oauth@1.1.11', ['client', 'server']);
  api.use('http@1.1.8', ['server']);
  api.use(['underscore@1.0.9', 'service-configuration@1.0.10'], ['client', 'server']);
  api.use(['random@1.0.10', 'templating@1.1.14'], 'client');

  api.export('Ciscospark');

  api.addFiles(
    ['ciscospark_configure.html', 'ciscospark_configure.js'],
    'client');

  api.addFiles('ciscospark_server.js', 'server');
  api.addFiles('ciscospark_client.js', 'client');
});
