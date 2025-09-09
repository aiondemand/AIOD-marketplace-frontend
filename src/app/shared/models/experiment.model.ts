import { AssetCategory } from './asset-category.model';
import { AssetModel } from './asset.model';

export class ExperimentModel extends AssetModel {
  datePublished: string;
  pid: string;
  experimentalWorkflow: string;
  exemplaryExecutionSettings: string;
  reproducibilityExplanation: string;
  aiodEntry: {
    platform: string;
    platformIdentifier: string;
    editor: any[];
    status: string;
    dateModified: string;
    dateCreated: string;
  };
  applicationArea: string[];
  assetIdentifier: number;
  badge: string[];
  contact: any[];
  creator: any[];
  distribution: {
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
    installationScript: string;
    installation: string;
    installationTimeMilliseconds: number;
    deploymentScript: string;
    deployment: string;
    deploymentTimeMilliseconds: number;
    osRequirement: string;
    dependency: string;
    hardwareRequirement: string;
  }[];
  hasPart: any[];
  industrialSector: string[];
  isPartOf: any[];
  keyword: string[];
  note: string[];
  researchArea: string[];
  resourceIdentifier: number;
  scientificDomain: string[];

  constructor(data: any) {
    super(data, AssetCategory.Experiment);
    this.datePublished = data.date_published;
    this.pid = data.pid;
    this.experimentalWorkflow = data.experimental_workflow;
    this.exemplaryExecutionSettings = data.execution_settings;
    this.reproducibilityExplanation = data.reproducibility_explanation;
    this.aiodEntry = {
      platform: data.aiod_entry.platform,
      platformIdentifier: data.aiod_entry.platform_identifier,
      editor: data.aiod_entry.editor,
      status: data.aiod_entry.status,
      dateModified: data.aiod_entry.date_modified,
      dateCreated: data.aiod_entry.date_created,
    };
    this.applicationArea = data.application_area;
    this.assetIdentifier = data.asset_identifier;
    this.badge = data.badge;
    this.contact = data.contact;
    this.creator = data.creator;
    this.distribution = data.distribution;
    this.hasPart = data.has_part;
    this.industrialSector = data.industrial_sector;
    this.isPartOf = data.is_part_of;
    this.keyword = data.keyword;
    this.note = data.note;
    this.researchArea = data.research_area;
    this.resourceIdentifier = data.resource_identifier;
    this.scientificDomain = data.scientific_domain;
  }
}
