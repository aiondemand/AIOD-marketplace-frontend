import { AssetModel } from "./asset.model";
import { AssetCategory } from "./asset-category.model";
export interface MeasuredModel {
    variable: string;
    technique: string;
}

export class DatasetModel extends AssetModel {
    platform_identifier?: string
    creator?: string;
    contact?: string;
    funder?: string[];
    isAccessibleForFree?: boolean;
    issn?: string;
    publisher?: string;
    spatialCoverage?: string;
    temporalCoverageFrom?: string;
    temporalCoverageTo?: string;
    version?: string;
    hasParts?: number[];
    isPart?: number[];
    alternate_names?: string[];
    citations?: number[];
    measuredValues?: MeasuredModel[];
    dateModified?: Date;



    constructor(data: any) {
        super(data, AssetCategory.Dataset);
        if (data) this.parseToData(data);
    }
    private parseToData(data: any): void {
        this.name = data.name;
        this.issn = data.issn;
        this.version = data.version;
        this.contact = data.contact;
        this.creator = data.creator;
        this.funder = data.funder;
        this.publisher = data.publisher;
        this.isAccessibleForFree = data.is_accessible_for_free;
        this.platform = data.platform;
        this.platform_identifier = data.platform_identifier;
        this.spatialCoverage = data.spatial_coverage;
        this.temporalCoverageFrom = data.temporal_coverage_from;
        this.temporalCoverageTo = data.temporal_coverage_to;
        this.dateModified = data.date_modified ?? new Date();
        this.date_published = data.date_published;
        this.citations = data.citations;
        this.description = data.description;
        this.hasParts = data.has_parts;
        this.isPart = data.is_part;
        this.alternate_names = data.alternate_names;
        if (data.measuredValues) {
            this.measuredValues = data.measuredValues.map((item: any) => {
                variable: item.variable;
                technique: item.technique;
            })
        } else {
            this.measuredValues = []
        }

    }
}