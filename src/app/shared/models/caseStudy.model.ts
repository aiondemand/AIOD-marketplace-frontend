import { AiodEntry } from "../interfaces/aiod-entry.interface";
import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";

export class CaseStudyModel extends AssetModel {
  aiodEntry: AiodEntry;
  aiResourceIdentifier: number;
  applicationArea: string[];
  contact: any[];
  creator: string[];
  hasPart: any[];
  industrialSector: string[];
  isPartOf: any[];
  note: any[];
  relevantLink: string[];
  relevantResource: any[];
  relevantTo: any[];
  isAccessibleForFree: string;
  aiAssetIdentifier: string;


  constructor(data: any) {
    super(data, AssetCategory["Case study"]);
    this.aiodEntry = {
      platform: data.aiod_entry.platform,
      platformIdentifier: data.aiod_entry.platform_identifier,
      dateModified: data.aiod_entry.date_modified,
      dateCreated: data.aiod_entry.date_created,
      editor: data.aiod_entry.editor,
      status: data.aiod_entry.status,
    };
    this.isAccessibleForFree = data.is_accessible_for_free;
    this.aiAssetIdentifier = data.ai_asset_identifier
    this.aiResourceIdentifier = data.ai_resource_identifier;
    this.applicationArea = data.application_area;
    this.contact = data.contact;
    this.creator = data.creator;
    this.hasPart = data.has_part;
    this.industrialSector = data.industrial_sector;
    this.isPartOf = data.is_part_of;
    this.note = data.note;
    this.relevantLink = data.relevant_link;
    this.relevantResource = data.relevant_resource;
    this.relevantTo = data.relevant_to;
  }
}
