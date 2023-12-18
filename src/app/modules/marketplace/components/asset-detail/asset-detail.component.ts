import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AssetModel } from '@app/shared/models/asset.model';
import {  Subscription, switchMap } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShoppingCartService } from '@app/shared/services/shopping-cart/shopping-cart.service';
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})

export class AssetDetailComponent implements OnInit, OnDestroy{
  constructor(
    private appConfig: AppConfigService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private generalAssetSerice: GeneralAssetService,
    private shoppingCartService: ShoppingCartService,
  ) {}
  
  private subscriptions: Subscription = new Subscription();
  public icon!: string;
  public categoryColor!: string;
  public isLoading = false;
  public asset!: AssetModel;
  private category!: AssetCategory;
  public AssetCategory = AssetCategory;

  private getAsset(id: number, category: AssetCategory): void {
    this.isLoading = true;
    this.generalAssetSerice.setAssetCategory(category);
    
    const subscribe = this.generalAssetSerice.getAsset(id).subscribe( {
      next: (asset: AssetModel) => {
        this.asset = asset;
        this.breadcrumbService.set('@assetName', this.asset.name)
        this.isLoading = false;
      },
      error: (error: any) => {
        setTimeout(() => (this.isLoading = false), 3000)
        console.error('Error get asset', error)
      }
    })
  }

  private getParams(): void {
    const subscribe = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const category = params['category']
        this.icon = this.appConfig.assets[category.toLocaleLowerCase()].icon;
        this.categoryColor = this.appConfig.assets[category.toLocaleLowerCase()].color;
        this.category = AssetCategory[category as keyof typeof AssetCategory];
        return this.route.params;
      })).subscribe((params: Params) => {
        const id = +params['id'];
        this.getAsset(id, this.category);
      })

      this.subscriptions.add(subscribe);
  }

  protected addItemCart(): void {
    this.shoppingCartService.addCartItems(this.asset);
  }

  public isURL(value: string): boolean {
    try {
      return new URL(value).href? true:false;;
    } catch (error) {
      return false;
    }
  }

  ngOnInit(): void {
    this.getParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
