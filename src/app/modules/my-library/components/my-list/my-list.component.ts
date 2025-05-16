import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { Subscription } from 'rxjs';
import { BookmarkBodyRemove, BookmarkService } from '../../../marketplace/services/common-services/bookmark-service/bookmark.service';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private appConfig: AppConfigService,
    private filterState: FiltersStateService,
    private bookmarkService: BookmarkService,
    private authService: AuthService,
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private subscriptions: Subscription = new Subscription();
  public displayedColumns: string[] = ['name', 'category', 'urlMetadata', 'delete' ];
  public assetsPurchase: AssetsPurchase[] = [];
  public dataSource = new MatTableDataSource(this.assetsPurchase);
  public isLoading = false;
  public userProfile!: UserProfile;
  public lengthTable: number = 0;

  private getAssetsPurchases(): void {
    this.isLoading = true;
    const subscribeLib = this.bookmarkService.getBookmarks({id: this.userProfile.identifier, email: this.userProfile.email})
      .subscribe({
        next: (assets: AssetsPurchase[]) => {
          this.dataSource.data = assets;
          this.lengthTable = this.dataSource.data.length
          this.isLoading = false;
        },
        error: (error: any) => {
          this.dataSource.data = [];
				  setTimeout(() => (this.isLoading = false), 3000);
          console.error('Error to get assets purchases', error)
        }
      });
      this.subscriptions.add(subscribeLib);
  }

  public getColorCategory(category: AssetCategory): string {
    const key = getKeyCategoryByValue(AssetCategory, category)??'';
    return this.appConfig.assets[key.toLocaleLowerCase()].color;
  }

  public deleteAssetMyLibrary(asset: AssetsPurchase): void {
    const body = {
      identifier: asset.identifier,
      category: asset.category
    } as BookmarkBodyRemove
    
    this.bookmarkService.deleteBookmark({id: this.userProfile.identifier, email: this.userProfile.email}, body).subscribe({
      next: () => {
        this.getAssetsPurchases();
      },
      error: (error: any) => console.error('Error to delete asset of my libreary', error)
    });
  }

  private applyFilter(category: AssetCategory): void{
    this.dataSource.filterPredicate = (data: AssetsPurchase, filter: string) => {
      return data.category === category || filter === 'any';
    }
    this.dataSource.filter = category
    this.lengthTable = this.dataSource.paginator?.length??0;
  }

  ngOnInit(): void {
    const subscribe = this.filterState.assetCategorySelected$.subscribe(category => this.applyFilter(category));
    const subscribeUser = this.authService.userProfileSubject.subscribe((profile) => {
      this.userProfile = profile
      this.getAssetsPurchases();
    });
    this.subscriptions.add(subscribe);
    this.subscriptions.add(subscribeUser);
    
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.data = []
    this.dataSource.paginator = this.paginator;
  }
}
