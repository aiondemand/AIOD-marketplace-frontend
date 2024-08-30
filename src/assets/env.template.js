(function(window) {
  window['env'] = window['env'] || {};
  window['env']['KEYCLOAK_URL'] = '${KEYCLOAK_URL}';
  window['env']['KEYCLOAK_REALM'] = '${KEYCLOAK_REALM}';
  window['env']['KEYCLOAK_CLIENT_ID'] = '${KEYCLOAK_CLIENT_ID}';
  window['env']['API_URL'] = '${API_URL}'
})(this);