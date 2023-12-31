import { Injectable } from "@angular/core";
import { AssetCategory } from "@app/shared/models/asset-category.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FiltersStateService {
    private assetCategory = new BehaviorSubject<AssetCategory>(AssetCategory.Dataset);
    private platform = new BehaviorSubject<string>('');
    private query = new BehaviorSubject<string>('');

    get assetCategorySelected(): AssetCategory {
        return this.assetCategory.getValue();
    }
    get assetCategorySelected$(): Observable<AssetCategory> {
        return this.assetCategory.asObservable();
    }

    get platformSelected(): string {
        return this.platform.getValue();
    }

    get platformSelected$(): Observable<string> {
        return this.platform.asObservable();
    }

    get searchQuery() : string {
        return this.query.getValue();
    }

    get searchQuery$() : Observable<string> {
        return this.query.asObservable();
    }

    public setSearchQuery(query : string) : void {
        this.query.next(query);
    }

    public setAssetCategorySelected(category: AssetCategory): void {
        this.assetCategory.next(category);
    }

    public setPlatformSelected(platform: string): void {
        this.platform.next(platform);
    }

}