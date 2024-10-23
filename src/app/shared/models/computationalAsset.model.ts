import { AiodEntry } from "../interfaces/aiod-entry.interface";
import { AcceleratorModel } from "./accelerator.model";
import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";
import { CpuModel } from "./cpu.model";
import { MemoryModel } from "./memory.model";
import { StorageModel } from "./storage.model";

export class ComputationalAssetModel extends AssetModel {
    accelerator: AcceleratorModel[];
    aiodEntry: AiodEntry;
    aiResourceIdentifier: number;
    applicationArea: string[];
    contact: any[];
    cpu: CpuModel[];
    creator: string[];
    hasPart: any[];
    isPartOf: any[];
    kernel: string;
    location: any[];
    memory: MemoryModel[];
    note: any[];
    os: string;
    relevantLink: string[];
    relevantResource: any[];
    relevantTo: any[];
    storage: StorageModel[];

    constructor(data: any) {
        super(data, AssetCategory["Computational asset"]);

      this.accelerator = data.accelerator;
      this.aiodEntry = {
        platform: data.aiod_entry.platform,
        platformIdentifier: data.aiod_entry.platform_identifier,
        dateModified: data.aiod_entry.date_modified,
        dateCreated: data.aiod_entry.date_created,
        editor: data.aiod_entry.editor,
        status: data.aiod_entry.status,
      };
      this.aiResourceIdentifier = data.ai_resource_identifier;
      this.applicationArea = data.application_area;
      this.contact = data.contact;
      this.cpu = data.cpu;
      this.creator = data.creator;
      this.hasPart = data.has_part;
      this.isPartOf = data.is_part_of;
      this.kernel = data.kernel;
      this.location = data.location;
      this.memory = data.memory;
      this.note = data.note;
      this.os = data.os;
      this.relevantLink = data.relevant_link;
      this.relevantResource = data.relevant_resource;
      this.relevantTo = data.relevant_to;
      this.storage = data.storage;
    }
}