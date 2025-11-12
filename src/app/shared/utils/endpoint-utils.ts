import { environment } from '@environments/environment';
import { AssetCategory } from '@app/shared/models/asset-category.model';

const { endpoints } = environment.api;

export function getEndpoint(assetCategory: AssetCategory): string {
  return endpoints[assetCategory];
}
