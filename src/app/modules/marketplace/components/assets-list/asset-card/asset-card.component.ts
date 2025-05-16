import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetModel } from '@app/shared/models/asset.model';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit{
  constructor(private appConfig: AppConfigService) {}
  @Input() mode: number= 1
  @Input() asset!: AssetModel;
  categoryColor: string = '';
  categoryKey!: string | undefined;
  assetIcon: string = '';

  ngOnInit(): void {
    if(this.asset) {
      this.categoryKey = getKeyCategoryByValue(AssetCategory, this.asset.category)
    }
  }
}
