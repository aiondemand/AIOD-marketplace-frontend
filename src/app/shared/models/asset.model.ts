import { AssetCategory } from "./asset-category.model"
import { Media } from "./media.model";
export class AssetModel {
    identifier: number
    category: AssetCategory;
    name: string;
    description: string;
    platform: string;
    platform_resource_identifier: number;
    keywords: string[];
    sameAs: string;
    license?: string;
    research_area?: string[];
    scientific_domain?: string[];
    date_published?: Date;
    distribution?: any[];
    alternateName?: string[];
    media?: Media[]
    version?: string;
    citation?: string[];
    dateCreated?: Date | undefined;

    constructor(data: any, category: AssetCategory) {
        this.alternateName = data.alternateName;
        this.category = category;
        this.citation = data.citation;
        this.dateCreated = data.aiod_entry?.date_created? new Date(data.aiod_entry?.date_created): undefined;
        this.date_published = data.date_published;
        this.description = data.description?.plain ?? '';
        this.distribution = data.distribution;
        this.identifier = data.identifier??0;
        this.keywords = data.keyword??[];
        this.license = data.license;
        this.media = data.media?.map((dataMedia: any) => new Media(dataMedia));
        this.name = data.name??'';
        this.platform = data.platform??'';
        this.platform_resource_identifier = data.platform_resource_identifier??0;
        this.research_area = data.research_area;
        this.sameAs = data.same_as;
        this.scientific_domain = data.scientific_domain;
        this.version = data.version;
    }
}