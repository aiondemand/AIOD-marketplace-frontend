import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { Subscription } from 'rxjs';
import { BookmarkService } from '../../../marketplace/services/common-services/bookmark-service/bookmark.service';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bookmark-view',
  templateUrl: './bookmark-view.html',
  styleUrls: ['./bookmark-view.scss'],
})
export class BookmarkViewComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private appConfig: AppConfigService,
    private filterState: FiltersStateService,
    private bookmarkService: BookmarkService,
    private authService: AuthService,
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private subscriptions: Subscription = new Subscription();
  public displayedColumns: string[] = [
    'name',
    'category',
    'urlMetadata',
    'delete',
  ];
  public assetsPurchase: AssetsPurchase[] = [];
  public dataSource = new MatTableDataSource(this.assetsPurchase);
  public isLoading = false;
  public userProfile!: UserProfile;
  public lengthTable = 0;

  private getAssetsPurchases(): void {
    this.isLoading = true;
    const subscribeLib = this.bookmarkService.getBookmarks().subscribe({
      next: (assets: AssetsPurchase[]) => {
        const incoming = assets ?? [];
        const validAssets = incoming.filter(
          (a) => a && a.identifier && (a.name || a.urlMetadata),
        );
        this.dataSource.data = validAssets;
        this.dataSource.filter = 'any';
        this.lengthTable = this.dataSource.data.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 422) {
          this.dataSource.data = [];
          this.lengthTable = 0;
          this.isLoading = false;
          console.warn('Handled 422 response when getting bookmarks');
          return;
        }

        this.dataSource.data = [];
        setTimeout(() => (this.isLoading = false), 3000);
        console.error('Error to get assets purchases', error);
      },
    });
    this.subscriptions.add(subscribeLib);
  }

  public getColorCategory(category?: AssetCategory): string {
    const assetsConfig = this.appConfig?.assets ?? {};

    if (!category) {
      const first = Object.values(assetsConfig)[0] as any;
      return first?.color ?? '';
    }

    const key = getKeyCategoryByValue(AssetCategory, category) ?? '';
    const assetConfig = assetsConfig[key.toLocaleLowerCase()];

    if (!assetConfig || !assetConfig.color) {
      const first = Object.values(assetsConfig)[0] as any;
      return first?.color ?? '';
    }

    return assetConfig.color;
  }

  public deleteAssetMyLibrary(asset: AssetsPurchase): void {
    this.bookmarkService.deleteBookmark(asset.identifier).subscribe({
      next: () => {
        this.getAssetsPurchases();
      },
      error: (error: any) =>
        console.error('Error to delete asset of my libreary', error),
    });
  }

  private applyFilter(category: AssetCategory): void {
    this.dataSource.filterPredicate = (
      data: AssetsPurchase,
      filter: string,
    ) => {
      return filter === 'any';
    };
    this.dataSource.filter = category;
    this.lengthTable = this.dataSource.paginator?.length ?? 0;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.filterState.assetCategorySelected$.subscribe((category) =>
        this.applyFilter(category),
      ),
    );
    this.subscriptions.add(
      this.authService.userProfileSubject.subscribe((profile) => {
        this.userProfile = profile;
        if (!this.isAuthenticated()) this.getAssetsPurchases();
      }),
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.getAssetsPurchases());
  }

  private isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }
}
