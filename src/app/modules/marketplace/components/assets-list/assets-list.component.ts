import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { ParamsReqAsset } from '@app/shared/interfaces/asset-service.interface';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subscription, of, switchMap } from 'rxjs';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { PageEvent } from '@angular/material/paginator';
import { ParamsReqSearchAsset } from "@app/shared/interfaces/search-service.interface";
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';
import { ElasticSearchService } from '../../services/elastic-search/elastic-search.service';
import { SearchModel } from '@app/shared/models/search.model';

@Component({
	selector: 'app-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {

	constructor(
		private generalAssetService: GeneralAssetService,
		private filtersStateService: FiltersStateService,
		private searchService: ElasticSearchService,
	) { }

	private subscriptions: Subscription = new Subscription();

	public isLoading = false;
	public assets: AssetModel[] = [];
	private categorySelected!: AssetCategory;
	private platformSelected!: string;

	public assetsSize = 0; /* number of assets found */
	public pageSize = 15; /* assets per page */
	public offset = 0;
	public pageSizeOptions = [15, 20, 50, 100];
	public currentPage = 1;

	private basicSearch(): void {
		this.isLoading = true;

		var query = this.filtersStateService.searchQuery;
		var platformsSelected = [];


		if(!!this.filtersStateService.platformSelected) {
			platformsSelected.push(this.filtersStateService.platformSelected);
		}

		const params: ParamsReqSearchAsset = {
			searchQuery: query,
			limit: this.pageSize,
			page: this.currentPage,
			platforms: platformsSelected
		}
		const subscribe = this.searchService.getAssetBySearch(params, this.categorySelected).subscribe({

			next: (resp: SearchModel) => {
				this.isLoading = false;
				this.assets = resp.resources;
				this.assetsSize = resp.totalHits;
			},
			error: (error: any) => {
				setTimeout(() => (this.isLoading = false), 5000);
				console.error('Error get assets', error)
			}
		})
		this.subscriptions.add(subscribe);
	}




	private getAssets(): void {
		this.isLoading = true;
		const parms: ParamsReqAsset = { offset: this.offset, limit: this.pageSize }
		this.generalAssetService.setAssetCategory(this.categorySelected);

		const serviceObs = !!this.platformSelected ?
			this.generalAssetService.getAssetsByPlatform(this.platformSelected, parms) :
			this.generalAssetService.getAssets(parms);

		const subscribe = serviceObs.subscribe({
			next: (assets: AssetModel[]) => {
				this.isLoading = false;
				this.assets = assets;
			},
			error: (error: any) => {
				this.assets = [];
				setTimeout(() => (this.isLoading = false), 3000);
				console.error('Error get assets', error)
			}
		});
		this.subscriptions.add(subscribe);

	}

	private getAssetsSize(category: AssetCategory): void {
		this.generalAssetService.setAssetCategory(category);
		const subscribe = this.generalAssetService.countAssets().subscribe({
			next: (size: number) => this.assetsSize = size,
			error: (error: any) => {
				this.assetsSize = 0;
				console.error('Error get assets size', error)
			}
		})
		this.subscriptions.add(subscribe);
	}

	private getFilters(): void {
		const subscribe = this.filtersStateService.assetCategorySelected$.pipe(
			switchMap((category: AssetCategory) => {
				this.categorySelected = category;
				return this.filtersStateService.platformSelected$;
			}),
			switchMap((platform: string) => {
				this.platformSelected = platform;
				return this.filtersStateService.searchQuery$;
			}),
			switchMap((searchQuery: string) => {
				if (searchQuery !== '') {
					this.basicSearch();
				} else {
					this.getAssets();
					this.getAssetsSize(this.categorySelected);
				}
				return of(null);
			})
		).subscribe(() => { });
		this.subscriptions.add(subscribe);
	}



	public handlePageEvent(e: PageEvent) {
		this.offset = e.pageIndex * e.pageSize;
		this.pageSize = e.pageSize;
		this.currentPage = e.pageIndex;
		this.getAssets();
	}

	ngOnInit(): void {
		this.getFilters();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
