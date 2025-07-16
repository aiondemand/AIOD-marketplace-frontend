import { AssetCategory } from './asset-category.model';
import { AssetModel } from './asset.model';

export class AIModelModel extends AssetModel {
  pid?: string;
  note?: string[];
  type?: string;

  constructor(data: any) {
    super(data, AssetCategory.AIModel);
    if (data) this.parseToData(data);
  }
  private parseToData(data: any): void {
    this.pid = data.pid;
    this.note = data.note;
    this.type = data.type;
  }
}
