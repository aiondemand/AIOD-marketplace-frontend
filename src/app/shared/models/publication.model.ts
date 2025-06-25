import { AiodEntry } from "../interfaces/aiod-entry.interface";
import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";

export class PublicationModel extends AssetModel {
  aiodEntry: AiodEntry;
  aiResourceIdentifier: number;
  applicationArea: string[];
  type: string;
  relevantTo: any[];
  relevantResource: any[];
  relevantLink: string[];
  note: any[];
  isPartOf: any[];
  industrialSector: string[];
  hasPart: any[];
  contact: any[];
  creator: string[];
  aiAssetIdentifier : string;
  documents : string[];

  constructor(data: any) {
    super(data, AssetCategory["Publication"]);

    this.aiodEntry = {
      platform: data.aiod_entry.platform, //platform
      platformIdentifier: data.aiod_entry.platform_identifier,
      dateModified: data.aiod_entry.date_modified,
      dateCreated: data.aiod_entry.date_created,
      editor: data.aiod_entry.editor,
      status: data.aiod_entry.status,
    };
    this.aiAssetIdentifier = data.ai_asset_identifier
    this.aiResourceIdentifier = data.ai_resource_identifier;
    this.alternateName = data.alternate_name
    this.applicationArea = data.application_area;
    this.contact = data.contact;
    this.creator = data.creator;
    this.documents = data.documents;
    this.hasPart = data.has_part;
    this.industrialSector = data.industrial_sector;
    this.isPartOf = data.is_part_of;
    this.note = data.note;
    this.relevantLink = data.relevant_link;
    this.relevantResource = data.relevant_resource;
    this.relevantTo = data.relevant_to;
    this.type = data.type;
  }
}
