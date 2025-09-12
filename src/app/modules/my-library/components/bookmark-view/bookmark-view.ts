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
  ) {
    // constructor should not create unmanaged subscriptions; subscribe in ngOnInit
  }

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
        this.dataSource.data = assets;
        this.dataSource.filter = 'any';
        console.log('dataSource after getBookmarks:', this.dataSource);
        this.lengthTable = this.dataSource.data.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.dataSource.data = [];
        setTimeout(() => (this.isLoading = false), 3000);
        console.error('Error to get assets purchases', error);
      },
    });
    this.subscriptions.add(subscribeLib);
  }

  public getColorCategory(category: AssetCategory): string {
    const key = getKeyCategoryByValue(AssetCategory, category) ?? '';
    return this.appConfig.assets[key.toLocaleLowerCase()].color;
  }

  public deleteAssetMyLibrary(asset: AssetsPurchase): void {
    console.log(asset);
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
      return data.category === category || filter === 'any';
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
    // Initialize paginator and then load bookmarks so the table and paginator
    // are ready when data arrives. Deferring the initial load to the next
    // macrotask avoids ExpressionChangedAfterItHasBeenCheckedError when the
    // data source updates synchronously during view initialization.
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.getAssetsPurchases());
  }

  private isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }
}
