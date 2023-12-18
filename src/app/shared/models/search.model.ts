import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";

export class SearchModel {
    totalHits: number;
    resources: AssetModel[];
    nextOffset: any[];
    currentPage: number;
    pageSize: number;

    constructor(data: any, assetCategory: AssetCategory) {
        this.totalHits = data.total_hits??0;
        this.resources =  Array.isArray(data.resources)? 
            data.resources.map( (resource: any) => new AssetModel(resource, assetCategory)): [];
        this.nextOffset = data.next_offset;
        this.currentPage = data.current_page;
        this.pageSize = data.page_size;
    }
}