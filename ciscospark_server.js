Ciscospark = {};

// https://developer.ciscospark.com/authentication.html
// add fields here that you want to allow the meteor application to read
Ciscospark.whitelistedFields = ['id', 'emails', 'displayName', 'nickName', 'firstName',
                   'lastName', 'avatar', 'orgId', 'timeZone', 'status'];

OAuth.registerService('ciscospark', 2, null, function(query) {

  var response = getTokens(query);
  var expiresAt = (+new Date) + (1000 * parseInt(response.expiresIn, 10));
  var accessToken = response.accessToken;

  var identity = getIdentity(accessToken);

  var serviceData = {
    id: identity.id,
    accessToken: accessToken,
    expiresAt: expiresAt
  };

  var fields = _.pick(identity, Ciscospark.whitelistedFields);
  _.extend(serviceData, fields);

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken)
    serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.displayName}}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'ciscospark'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://api.ciscospark.com/v1/access_token", {params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('ciscospark', config),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Ciscospark. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Ciscospark. " + response.data.error);
  } else {

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      refreshTokenExpiresIn: response.data.refresh_token_expires_in
    };
  }
};

// returns an object similar to below:
//   "id": "alpha_numeric_id_redacted",
//   "emails": [
//       "jlevensailor@presidio.com"
//   ],
//   "displayName": "Jeff Levensailor",
//   "nickName": "Jeff",
//   "firstName": "Jeff",
//   "lastName": "Levensailor",
//   "avatar": "https://a72640b9bd48ca692276-7a8d714e47e774a40b228a7bbc0710ed.ssl.cf1.rackcdn.com/V1~562513038e8ee51e60ca9ace63641f58~mpAYGgrARj2KyOJv8hS1Cw==~1600",
//   "orgId": "alpha_numeric_id_redacted",
//   "created": "2015-02-18T02:26:47.923Z",
//   "timeZone": "America/Los_Angeles",
//   "lastActivity": "2018-01-13T17:00:03.240Z",
//   "status": "active",
//   "type": "person"
var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://api.ciscospark.com/v1/people/me",
//        "https://hookb.in/KG7drVoV",
      {
        headers: {
          "Authorization": "Bearer "+accessToken,
          "Content-Type": "application/json"
        }
      }
    ).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Ciscospark. " + err.message),
                   {response: err.response});
  }
};

Ciscospark.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
