export const endpoints = {
  //AIOD
  prefixApiAssets: '/api-metadata',
  prefixCount: '/v2/counts',
  prefixByPlatfoms: '/v2/platforms',
  prefixByCategories: '/v2',

  //Categories
  datasets: '/datasets',
  services: '/services',
  expetiments: '/experiments',
  aimodels: '/ml_models',
  educationalResources: '/educational_resources',
  publications: '/publications',
  caseStudies: '/case_studies',

  //Payments
  prefixApiPayment: '/api-library/api',
  payment: '/libraries/:userId/assets',

  //My-library
  prefixApiLibraries: '/api-library/api',
  libraries: '/libraries/:userId',
  librariesAssets: '/libraries/:userId/assets',

  //Platforms
  platforms: '/platforms',

  //Search
  search: '/v2/search',

  //Enhanced Search
  prefixApiRAIL: '/rail-api',
  enhancedSearch: '/search/v2',
  query: '/query',
};
