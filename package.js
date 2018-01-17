Package.describe({
  summary: "Ciscospark OAuth flow",
  version: "1.0.0",
  git: 'https://github.com/levensailor/ciscospark-oauth.git'
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.export('Ciscospark');

  api.addFiles(
    ['ciscospark_configure.html', 'ciscospark_configure.js'],
    'client');

  api.addFiles('ciscospark_server.js', 'server');
  api.addFiles('ciscospark_client.js', 'client');
});
