import { AssetCategory } from './asset-category.model';

export class AssetsPurchase {
  identifier: string;
  name: string;
  category: AssetCategory;
  urlMetadata: string;
  price: number;
  addedAt: number;

  constructor(data: any) {
    this.identifier = data?.resource_identifier ?? '';
    this.category = data.category;
    this.name = data.name;
    this.urlMetadata = data?.url_metadata ?? '';
    this.price = data?.price ?? 0;
    this.addedAt = data?.addedAt ?? 0;
  }
}
