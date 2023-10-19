import { AssetCategory } from "./asset-category.model"

export class AssetModel {
    identifier: number
    category: AssetCategory;
    name: string;
    description: string;
    platform: string;
    keywords: string[];
    sameAs: string;
    license?: string;
    research_area?: string[];
    scientific_domain?: string[];
    date_published?: Date;
    distributions?: any[];

    constructor(data: any, category: AssetCategory) {
        this.identifier = data.identifier??0;
        this.category = category;
        this.name = data.name??'';
        this.description = data.description??'';
        this.platform = data.platform??'';
        this.keywords = data.keyword??[];
        this.sameAs = data.same_as;
        this.license = data.license;
        this.scientific_domain = data.scientific_domain;
        this.research_area = data.research_area;
        this.date_published = data.date_published;
        this.distributions = data.distributions;
    }
}