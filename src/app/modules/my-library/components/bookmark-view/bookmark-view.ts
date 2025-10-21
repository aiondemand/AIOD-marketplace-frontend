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

  private subscriptions: Subscription = new Subscription();
  public displayedColumns: string[] = [
    'name',
    'category',
    'urlMetadata',
    'delete',
  ];
  public assetsPurchase: AssetsPurchase[] = [];
  public allAssets: AssetsPurchase[] = [];
  public paginatedAssets: AssetsPurchase[] = [];
  public dataSource = new MatTableDataSource(this.paginatedAssets);
  public isLoading = false;
  public userProfile!: UserProfile;
  public lengthTable = 0;

  public pageSizeOptions: number[] = [10, 15, 25, 100];
  public currentPageSize = 10;
  public currentPage = 0;
  public assetsSize: number | null = null;
  public isLightTheme: string | null = null;

  private getAssetsPurchases(): void {
    this.isLoading = true;
    const subscribeLib = this.bookmarkService.getBookmarks().subscribe({
      next: (assets: AssetsPurchase[]) => {
        const incoming = assets ?? [];
        const validAssets = incoming.filter(
          (a) => a && a.identifier && (a.name || a.urlMetadata),
        );
        this.allAssets = validAssets;
        this.lengthTable = this.allAssets.length;
        this.assetsSize = this.allAssets.length;
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 422) {
          this.allAssets = [];
          this.paginatedAssets = [];
          this.dataSource.data = [];
          this.lengthTable = 0;
          this.assetsSize = 0;
          this.isLoading = false;
          console.warn('Handled 422 response when getting bookmarks');
          return;
        }

        this.allAssets = [];
        this.paginatedAssets = [];
        this.dataSource.data = [];
        this.assetsSize = 0;
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
    this.lengthTable = this.allAssets.length;
    this.assetsSize = this.allAssets.length;
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  public onPageSizeChange(event: Event): void {
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  public getTotalPages(): number {
    if (!this.assetsSize) return 0;
    return Math.ceil(this.assetsSize / this.currentPageSize);
  }

  public getRangeLabel(): string {
    if (!this.assetsSize || this.assetsSize === 0) {
      return '0 of 0';
    }
    const startIndex = this.currentPage * this.currentPageSize + 1;
    const endIndex = Math.min(
      (this.currentPage + 1) * this.currentPageSize,
      this.assetsSize,
    );
    return `${startIndex} - ${endIndex} of ${this.assetsSize}`;
  }

  private updatePaginatedData(): void {
    const startIndex = this.currentPage * this.currentPageSize;
    const endIndex = startIndex + this.currentPageSize;
    this.paginatedAssets = this.allAssets.slice(startIndex, endIndex);
    this.dataSource.data = this.paginatedAssets;
  }

  ngOnInit(): void {
    this.isLightTheme = document.documentElement.getAttribute('data-theme');
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
    setTimeout(() => this.getAssetsPurchases());
  }

  private isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }
}
