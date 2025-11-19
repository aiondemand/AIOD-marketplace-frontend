import { AssetCategory } from '../app/shared/models/asset-category.model';

export const endpoints = {
  //AIOD
  prefixApiAssets: '/api-metadata',
  prefixCount: '/v2/counts',
  prefixByPlatfoms: '/v2/platforms',
  prefixByCategories: '/v2',

  //Categories
  [AssetCategory.Dataset]: '/datasets',
  [AssetCategory.Service]: '/services',
  [AssetCategory.Experiment]: '/experiments',
  [AssetCategory.AIModel]: '/ml_models',
  [AssetCategory['Computational asset']]: '/computational_assets',
  [AssetCategory['Educational resource']]: '/educational_resources',
  [AssetCategory.Publication]: '/publications',
  [AssetCategory['Success stories']]: '/case_studies',
  [AssetCategory['Resource Bundle']]: '/resource_bundles',

  //Payments
  prefixApiPayment: '/api-library/api',
  payment: '/libraries/:userId/assets',

  //My-library
  prefixApiLibraries: '/api-library/api',
  libraries: '/libraries/:userId',
  librariesAssets: '/libraries/:userId/assets',

  //Platforms
  platforms: '/platforms',
  //Projects
  project: '/projects',
  //Organisations
  organisation: '/organisations',
  //Persons
  persons: '/persons',
  //Search
  search: '/v2/search',

  //Enhanced Search
  prefixApiRAIL: '/rail-api',
  enhancedSearch: '/search/v2',
  query: '/query',
};
