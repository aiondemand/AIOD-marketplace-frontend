(function(window) {
  window['env'] = window['env'] || {};
  window['env']['KEYCLOAK_URL'] = '${KEYCLOAK_URL}';
  window['env']['KEYCLOAK_REALM'] = '${KEYCLOAK_REALM}';
  window['env']['KEYCLOAK_CLIENT_ID'] = '${KEYCLOAK_CLIENT_ID}';
  window['env']['API_URL'] = '${API_URL}';
  window['env']['AIOD_ENHANCED_API'] = '${AIOD_ENHANCED_API}';
  window['env']['ML_REDIRECT_URI'] = '${ML_REDIRECT_URI}'
  window['env']['ZOHO_URL']='${ZOHO_URL}';
})(this);