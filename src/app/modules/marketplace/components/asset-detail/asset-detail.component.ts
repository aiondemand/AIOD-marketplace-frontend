import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subscription, switchMap } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { BookmarkBodyRemove, BookmarkService } from '../../services/common-services/bookmark-service/bookmark.service';
import { UserModel } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})

export class AssetDetailComponent implements OnInit, OnDestroy{
  public userProfile!: UserProfile;

  constructor(
    private appConfig: AppConfigService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private bookmarkService: BookmarkService,
    private generalAssetService: GeneralAssetService,
  ) {
    this.authService.userProfileSubject.subscribe((profile) => {
      this.userProfile = profile;
    });
  }
  
  private subscriptions: Subscription = new Subscription();
  public icon!: string;
  public categoryColor!: string;
  public isLoading = false;
  public asset!: AssetModel;
  private category!: AssetCategory;
  public AssetCategory = AssetCategory;
  protected isBookmarked: boolean = false;

  private getAsset(id: string, category: AssetCategory): void {
    this.isLoading = true;
    this.generalAssetService.setAssetCategory(category);
    
    const subscribe = this.generalAssetService.getAsset(id).subscribe( {
      next: (asset: AssetModel) => {
        this.asset = asset;
        this.breadcrumbService.set('@assetName', this.asset.name)
        this.isLoading = false;
      },
      error: (error: any) => {
        setTimeout(() => (this.isLoading = false), 3000)
        console.error('Error get asset', error)
        this.asset={
          "identifier": 24,
          "category": AssetCategory.Dataset,
          "name": "bigIR/ar_cov19",
          "description": "ArCOV-19 is an Arabic COVID-19 Twitter dataset that covers the period from 27th of January till 30th of April 2020. ArCOV-19 is designed to enable research under several domains including natural language processing, information retrieval, and social computing, among others",
          "platform": "huggingface",
          "platform_resource_identifier":11111111,
          "keywords": [
              "source_datasets:original",
              "multilinguality:monolingual",
              "region:us",
              "language_creators:found",
              "language:ar",
              "annotations_creators:no-annotation",
              "size_categories:1m<n<10m",
              "task_categories:other",
              "arxiv:2004.05861",
              "data-mining"
          ],
          "sameAs": "https://huggingface.co/datasets/bigIR/ar_cov19",
          "scientific_domain": [],
          "research_area": [],
          "date_published": new Date("2023-12-19T09:25:41.000Z"),
          "media": [],
          "citation": [],
          "dateCreated": new Date("2023-12-19T09:25:41.000Z")
      }
      }
    })
  }

  private getParams(): void {
    const subscribe = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const category = params['category']
        this.icon = this.appConfig.assets[category.toLocaleLowerCase()]?.icon;
        this.categoryColor = this.appConfig.assets[category.toLocaleLowerCase()]?.color;
        this.category = AssetCategory[category as keyof typeof AssetCategory];
        return this.route.params;
      })).subscribe((params: Params) => {
        const id = +params['id'];
        this.getAsset(id, this.category);
      })

      this.subscriptions.add(subscribe);
  }

  protected onClickBookmark(): void {
    if (!this.isAuthenticated())
      return;

    if (!this.isBookmarked) {
      this.addBookmark();
    } 
    else 
      this.deleteBookmark();

    this.isBookmarked = !this.isBookmarked; 
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

  isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }

  private addBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const bookmarkedAsset = this.getBookmarkedAsset();

      this.bookmarkService.addBookmark(user, [ bookmarkedAsset ]).subscribe({
        next: (_bookmarkedAssets: any) => { 
          // ToDo: change bookmark icon style
        },
        error: (error: any) => console.error('Error bookmarking asset', error)
      });
    }    
  }

  private deleteBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const deleteBody = {
        identifier: this.asset.identifier.toString(),
        category: this.asset.category
      } as  BookmarkBodyRemove

      this.bookmarkService.deleteBookmark(user, deleteBody).subscribe({
        next: () => {
          // ToDo: change bookmark icon style
        },
        error: (error: any) => console.error('Error deleting asset from bookmarks', error)
      });
    }    
  }

  private getBookmarkedAsset(): AssetsPurchase {
    return {
      identifier: ''+this.asset.identifier,
      name: this.asset.name,
      category: this.asset.category,
      urlMetadata: this.asset.sameAs,
      price: 0,
      addedAt: new Date().getDate()
    } as AssetsPurchase
  }  
}
