import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subscription, switchMap } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { BookmarkService } from '../../services/common-services/bookmark-service/bookmark.service';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { GenericItem } from '@app/shared/models/generic.model';
import { modelConfig } from '@app/shared/models/modelConfig';
@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss'],
})
export class AssetDetailComponent implements OnInit, OnDestroy {
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

  public subscriptions: Subscription = new Subscription();
  public icon!: string;
  public categoryColor!: string;
  public isLoading = false;
  public asset!: AssetModel;
  public category!: AssetCategory;
  public AssetCategory = AssetCategory;
  protected isBookmarked = false;

  // Use configuration from modelConfig - will be set dynamically based on asset category
  public genericData: GenericItem[] = [];
  public genericColumns: string[] = [];
  public genericTitle = '';

  public getAsset(id: string, category: AssetCategory): void {
    this.isLoading = true;
    this.generalAssetService.setAssetCategory(category);

    const subscribe = this.generalAssetService.getAsset(id).subscribe({
      next: (asset: AssetModel) => {
        this.asset = asset;
        this.breadcrumbService.set('@assetName', this.asset.name);
        this.isLoading = false;
        this.prepareGenericData();
        // After asset is loaded, check if it's bookmarked
        const bookmarkSub = this.bookmarkService.getBookmarks().subscribe({
          next: (bookmarks: AssetsPurchase[] | any) => {
            try {
              // The BookmarkService returns an array of items with resource_identifier
              // In some code paths it may return an Observable-wrapped forkJoin; handle safely
              const list = Array.isArray(bookmarks) ? bookmarks : [];
              this.isBookmarked = list.some(
                (b: any) =>
                  b && b.resource_identifier === this.asset.identifier,
              );
            } catch (e) {
              this.isBookmarked = false;
            }
          },
          error: (err: any) => {
            console.error('Error fetching bookmarks for asset detail', err);
            this.isBookmarked = false;
          },
        });
        this.subscriptions.add(bookmarkSub);
      },
      error: (error: any) => {
        setTimeout(() => (this.isLoading = false), 3000);
        console.error('Error get asset', error);
        //   this.asset bellow might be used for testing purposes
        // this.asset={
        //     "identifier": "data_02E1OuNCoTvFQPkYTkHDCOLX",
        //     "category": AssetCategory.Dataset,
        //     "name": "bigIR/ar_cov19",
        //     "description": "ArCOV-19 is an Arabic COVID-19 Twitter dataset that covers the period from 27th of January till 30th of April 2020. ArCOV-19 is designed to enable research under several domains including natural language processing, information retrieval, and social computing, among others",
        //     "platform": "huggingface",
        //     "platform_resource_identifier": "11111111",
        //     "keywords": [
        //         "source_datasets:original",
        //         "multilinguality:monolingual",
        //         "region:us",
        //         "language_creators:found",
        //         "language:ar",
        //         "annotations_creators:no-annotation",
        //         "size_categories:1m<n<10m",
        //         "task_categories:other",
        //         "arxiv:2004.05861",
        //         "data-mining"
        //     ],
        //     "sameAs": "https://huggingface.co/datasets/bigIR/ar_cov19",
        //     "scientific_domain": [],
        //     "research_area": [],
        //     "date_published": new Date("2023-12-19T09:25:41.000Z"),
        //     "media": [],
        //     "citation": [],
        //     "dateCreated": new Date("2023-12-19T09:25:41.000Z")
        // }
      },
    });
  }

  private getParams(): void {
    const subscribe = this.route.queryParams
      .pipe(
        switchMap((params: Params) => {
          const category = params['category'];
          this.icon = this.appConfig.assets[category.toLocaleLowerCase()]?.icon;
          this.categoryColor =
            this.appConfig.assets[category.toLocaleLowerCase()]?.color;
          this.category = AssetCategory[category as keyof typeof AssetCategory];
          return this.route.params;
        }),
      )
      .subscribe((params: Params) => {
        const id = params['id'];
        this.getAsset(id, this.category);
      });

    this.subscriptions.add(subscribe);
  }

  protected onClickBookmark(): void {
    if (!this.isAuthenticated()) return;

    if (!this.isBookmarked) {
      this.addBookmark();
    } else this.deleteBookmark();

    this.isBookmarked = !this.isBookmarked;
  }

  public isURL(value: string): boolean {
    try {
      return new URL(value).href ? true : false;
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
    if (this.userProfile) {
      const bookmarkedAsset = this.getBookmarkedAsset();

      this.bookmarkService.addBookmark(bookmarkedAsset.identifier).subscribe({
        next: () => {
          // ToDo: change bookmark icon style
        },
        error: (error: any) => console.error('Error bookmarking asset', error),
      });
    }
  }

  private deleteBookmark() {
    if (this.userProfile) {
      this.bookmarkService
        .deleteBookmark(this.asset.identifier.toString())
        .subscribe({
          next: () => {
            // ToDo: change bookmark icon style
          },
          error: (error: any) =>
            console.error('Error deleting asset from bookmarks', error),
        });
    }
  }

  private getBookmarkedAsset(): AssetsPurchase {
    return {
      identifier: '' + this.asset.identifier,
      name: this.asset.name,
      category: this.asset.category,
      urlMetadata: this.asset.sameAs,
      price: 0,
      addedAt: new Date().getDate(),
    } as AssetsPurchase;
  }

  private getNestedProperty(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (current && current[key] !== undefined) {
        current = current[key];

        // If we have more keys to process and current is an array
        if (i < keys.length - 1 && Array.isArray(current)) {
          const remainingPath = keys.slice(i + 1).join('.');
          // Collect the property from all array items
          const values = current
            .map((item) => this.getNestedProperty(item, remainingPath))
            .filter((value) => value !== null && value !== undefined);

          return values.length > 0 ? values.join(', ') : null;
        }
      } else {
        return null;
      }
    }

    return current;
  }

  private formatValue(value: any): string {
    return String(value);
  }

  private prepareGenericData(): void {
    const categoryKey = this.category as keyof typeof modelConfig;
    const config = modelConfig[categoryKey];

    this.genericColumns = config.columns;
    this.genericTitle = config.title;

    const assetData: any = { id: '1' };

    // Group columns by parent path
    const groupedColumns: { [key: string]: string[] } = {};

    this.genericColumns.forEach((column) => {
      const parts = column.split('.');
      if (parts.length > 1) {
        const parentPath = parts[0];
        if (!groupedColumns[parentPath]) {
          groupedColumns[parentPath] = [];
        }
        groupedColumns[parentPath].push(column);
      } else {
        // Handle single-level properties normally
        const value = this.getNestedProperty(this.asset, column);
        assetData[column] =
          typeof value === 'object' && value !== null
            ? value
            : this.formatValue(value);
      }
    });

    Object.keys(groupedColumns).forEach((parentPath) => {
      const columns = groupedColumns[parentPath];
      const parentArray = (this.asset as any)[parentPath];

      if (Array.isArray(parentArray)) {
        const result = parentArray.map((item) => {
          const obj: any = {};
          columns.forEach((column) => {
            const propertyName = column.split('.').slice(1).join('.');
            obj[propertyName] = this.getNestedProperty(item, propertyName);
          });
          return obj;
        });
        assetData[parentPath] = result;
      } else {
        // Fallback to original behavior if not an array
        columns.forEach((column) => {
          const value = this.getNestedProperty(this.asset, column);
          assetData[column] = this.formatValue(value);
        });
      }
    });
    this.genericData = [assetData];
  }
}
