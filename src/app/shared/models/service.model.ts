import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";

export interface AiodEntry {
    platform: string;
    platformIdentifier: string;
    dateModified: string;
    dateCreated: string;
    editor: number[];
    status: string;
}

export interface Media {
    checksum: string;
    checksumAlgorithm: string;
    copyright: string;
    contentUrl: string;
    contentSizeKb: number;
    datePublished: string;
    description: string;
    encodingFormat: string;
    name: string;
    technologyReadinessLevel: number;
}

export class ServiceModel extends AssetModel {
    slogan: string;
    termsOfService: string;
    aiodEntry: AiodEntry;
    alternateName: string[];
    applicationArea: string[];
    contact: any[];
    hasPart: any[];
    industrialSector: string[];
    isPartOf: any[];
    keyword: string[];
    media: Media[];
    researchArea: string[];
    resourceIdentifier: number;
    scientificDomain: string[];

    constructor(data: any) {
        super(data, AssetCategory.Service)
        this.slogan = data.slogan;
        this.termsOfService = data.terms_of_service;
        this.aiodEntry = {
            platform: data.aiod_entry.platform,
            platformIdentifier: data.aiod_entry.platform_identifier,
            dateModified: data.aiod_entry.date_modified,
            dateCreated: data.aiod_entry.date_created,
            editor: data.aiod_entry.editor,
            status: data.aiod_entry.status,
        };
        this.alternateName = data.alternate_name;
        this.applicationArea = data.application_area;
        this.contact = data.contact;
        this.hasPart = data.has_part;
        this.industrialSector = data.industrial_sector;
        this.isPartOf = data.is_part_of;
        this.keyword = data.keyword;
        this.media = data.media;
        this.researchArea = data.research_area;
        this.resourceIdentifier = data.resource_identifier;
        this.scientificDomain = data.scientific_domain;
    }
}




