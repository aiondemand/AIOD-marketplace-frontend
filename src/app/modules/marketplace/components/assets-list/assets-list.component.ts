import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import {  ParamsReqAsset } from '@app/shared/interfaces/asset-service.interface';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subscription, switchMap } from 'rxjs';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { PageEvent } from '@angular/material/paginator';
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';

@Component({
	selector: 'app-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {

	constructor(
		private generalAssetService: GeneralAssetService,
		private filtersState: FiltersStateService,
	) { }

	private subscriptions: Subscription = new Subscription();

	public isLoading = false;
	public assets: AssetModel[] = [];
	private categorySelected!: AssetCategory;
	private platformSelected!: string;

	public assetsSize = 0;
	public pageSize = 15;
	public offset = 0;
	public pageSizeOptions = [15, 20, 50, 100];

	private getAssets(): void {
		this.isLoading = true;
		const parms: ParamsReqAsset = { offset: this.offset, limit: this.pageSize }
		this.generalAssetService.setCategoryAsset(this.categorySelected);

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
		this.generalAssetService.setCategoryAsset(category);
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
		const subscribe = this.filtersState.assetCategorySelected$.pipe(
			switchMap((category: AssetCategory) => {
				this.categorySelected = category;
				return this.filtersState.platformSelected$;
			})
		).subscribe((platform: string) => {
			this.platformSelected = platform;
			this.getAssets();
			this.getAssetsSize(this.categorySelected);
		});
		this.subscriptions.add(subscribe);
	}

	public handlePageEvent(e: PageEvent) {
		this.offset = e.pageIndex * e.pageSize;
		this.pageSize = e.pageSize;
		this.getAssets();
	}

	ngOnInit(): void {
		this.getFilters();
		
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
