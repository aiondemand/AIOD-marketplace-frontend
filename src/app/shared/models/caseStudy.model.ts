import { AiodEntry } from "../interfaces/aiod-entry.interface";
import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";

export class CaseStudyModel extends AssetModel {
  aiodEntry: AiodEntry;
  timeRequired: string;
  accessMode: string[];
  aiResourceIdentifier: number;
  applicationArea: string[];
  contact: any[];
  content: string;
  creator: string[];
  educationalLevel: string[];
  hasPart: any[];
  inLanguage: string[];
  industrialSector: string[];
  isPartOf: any[];
  location: any[];
  note: any[];
  pace: string;
  prerequisite: string[];
  relevantLink: string[];
  relevantResource: any[];
  relevantTo: any[];
  targetAudience: string[];
  type: string;

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
    this.timeRequired = data.time_required;
    this.accessMode = data.access_mode;
    this.aiResourceIdentifier = data.ai_resource_identifier;
    this.applicationArea = data.application_area;
    this.contact = data.contact;
    this.content = data.content?.plain;
    this.creator = data.creator;
    this.educationalLevel = data.educational_level;
    this.hasPart = data.has_part;
    this.inLanguage = data.in_language;
    this.industrialSector = data.industrial_sector;
    this.isPartOf = data.is_part_of;
    this.location = data.location;
    this.note = data.note;
    this.pace = data.pace;
    this.prerequisite = data.prerequisite;
    this.relevantLink = data.relevant_link;
    this.relevantResource = data.relevant_resource;
    this.relevantTo = data.relevant_to;
    this.targetAudience = data.target_audience;
    this.type = data.type;
  }
}
