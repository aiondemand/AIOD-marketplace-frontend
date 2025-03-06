import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { ParamsReqAsset } from '@app/shared/interfaces/asset-service.interface';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subject, Subscription, combineLatest, debounceTime, filter, finalize, interval, map, of, scan, switchMap, take, takeUntil, takeWhile, throwError } from 'rxjs';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { PageEvent } from '@angular/material/paginator';
import { ParamsReqSearchAsset } from "@app/shared/interfaces/search-service.interface";
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';
import { ElasticSearchService } from '../../services/elastic-search/elastic-search.service';
import { SearchModel } from '@app/shared/models/search.model';
import { SpinnerService } from '@app/shared/services/spinner/spinner.service';
import { hasQuotes } from '../../utils/common.utils';

const MAX_ATTEMPTS = 15;

const assetCategoryMapping = {
	[AssetCategory.AIModel]: 'ml_models',
	[AssetCategory.Dataset]: 'datasets',
	[AssetCategory.Experiment]: 'experiments',
	[AssetCategory['Educational resource']]: 'educational_resources',
	[AssetCategory['Service']]: 'services',
}

@Component({
	selector: 'app-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	private enhancedSearchSubscription?: Subscription;

	public isLoading = false;
	public assets: AssetModel[] = [];
	private categorySelected!: AssetCategory;
	private platformSelected!: string;
	public isEnhancedSearch: boolean = false;
	public searchQueryValue: string = '';

	public assetsSize = 0; /* number of assets found */
	public pageSize = 15; /* assets per page */
	public offset = 0;
	public pageSizeOptions = [15, 20, 50, 100];
	public currentPage = 1;

	destroy$ = new Subject<any>();


	constructor(
		private generalAssetService: GeneralAssetService,
		private filtersStateService: FiltersStateService,
		private searchService: ElasticSearchService,
		private spinnerService: SpinnerService,
	) { }

	ngOnInit(): void {
		this.getFilters();
		this.filtersStateService.isEnhancedSerach$.pipe(takeUntil(this.destroy$)).subscribe({ next: (value) => {
			this.isEnhancedSearch = value;
		}})

		this.filtersStateService.searchQuery$.pipe(takeUntil(this.destroy$)).subscribe({ next: (value) => {
			this.searchQueryValue = value;
		}})
	}

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
  
		if (hasQuotes(query)) {
			params.exact_match = true
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

	private isValidAssetCategory(category: any): boolean {
		return Object.values(AssetCategory).includes(category);
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
				if (!this.isValidAssetCategory(this.categorySelected)) {
					this.categorySelected = AssetCategory.Dataset
					this.filtersStateService.setAssetCategorySelected(AssetCategory.Dataset)
				} else {
					this.categorySelected = category;
				}
				return this.filtersStateService.platformSelected$;
			}),
			switchMap((platform: string) => {
				this.platformSelected = platform;
				return combineLatest([
					this.filtersStateService.searchQuery$,
					this.filtersStateService.isEnhancedSerach$
				]);
			}),
			debounceTime(300),
			switchMap(([searchQuery, isEnhanced]) => {
				if (searchQuery !== '') {
						if (isEnhanced) {
								this.enhancedSearch(searchQuery);
						} else {
								this.basicSearch();
						}
				} else if (!isEnhanced) {
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
		if (!this.isEnhancedSearch) {
			this.getAssets();
		} else if (this.searchQueryValue){
			this.enhancedSearch(this.searchQueryValue);
		}
	}

	isPaginationDisabled() {
		if (this.isEnhancedSearch && !this.searchQueryValue) {
			return true;
		}

		return false;
	}

	initSpinner() {
		this.spinnerService.show('Initializing enhanced search...');
	}

	private enhancedSearch(query: string): void {
		const categorySelected = this.sanitizeAssetCategory(this.categorySelected);
		
		if (this.enhancedSearchSubscription) {
			this.enhancedSearchSubscription.unsubscribe();
		}

		this.generalAssetService.setAssetCategory(this.categorySelected);
		this.enhancedSearchSubscription = this.generalAssetService.getAssetsByEnhancedSearch(query, categorySelected, this.pageSize)
			.pipe(
				switchMap(locationHeader => {
					return interval(2000).pipe(
						switchMap(() => this.generalAssetService.checkEnhancedSearchStatus(locationHeader)),
						scan((attempts: any, response: any) => {
							this.spinnerService.updateMessage(`Search in progress...`);

							return {
								attempts: attempts.attempts + 1,
								response: response
							};
						}, { attempts: 0, response: null }),
						map((data: any) => ({
							...data.response,
							_attemptNumber: data.attempts
						})),
						takeWhile(response => response.status === 'In_progress' && response._attemptNumber < MAX_ATTEMPTS, true)
					);
				}),
				filter(response => response.status === 'Completed' && !!response.result_doc_ids),
				switchMap(response => {
					if (response.status === 'In_progress' && response._attemptNumber >= MAX_ATTEMPTS) {
						this.spinnerService.updateMessage('Search is taking longer than expected...');

						return throwError(() => new Error(`Attemps limit exceded (${MAX_ATTEMPTS * 2} seconds)`));
					}
					
					if (response.status === 'Completed' && !response.result_doc_ids) {
						this.spinnerService.updateMessage('No results found.');
						return of({ result_doc_ids: [] });
					}
					
					if (response.status === 'Completed' && response.result_doc_ids) {
						this.spinnerService.updateMessage('Loading results...');
						return of(response);
					}
					
					return throwError(() => new Error(response.status));
				}),
				take(1),
				switchMap(response => {
					if (response.result_doc_ids && response.result_doc_ids.length > 0) {
						return this.generalAssetService.getMultipleAssets(response.result_doc_ids);
					}

					return of([]);
				}),
				finalize(() => {
					this.spinnerService.hide();
				})
			).subscribe({
				next: (assets: any[]) => {
					this.assets = assets;
					this.assetsSize = assets.length;
					this.spinnerService.hide();
				},
				error: (error: any) => {
					this.assets = [];
					this.spinnerService.hide();
					throwError(() => new Error(error));
				}
			});

		this.subscriptions.add(this.enhancedSearchSubscription);
	}

	sanitizeAssetCategory(category: AssetCategory): string {
		this.initSpinner();

		if (category in assetCategoryMapping) {
			return assetCategoryMapping[category];
		}

		this.spinnerService.hide();
		return '';
	}

	ngOnDestroy(): void {
		this.spinnerService.hide();
		if (this.subscriptions) {
			this.subscriptions.unsubscribe();
		}

		this.destroy$.next(null);
    this.destroy$.complete();
	}
}
