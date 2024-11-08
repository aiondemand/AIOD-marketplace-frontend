import { AiodEntry } from "../interfaces/aiod-entry.interface";
import { AcceleratorModel } from "./accelerator.model";
import { AssetCategory } from "./asset-category.model";
import { AssetModel } from "./asset.model";
import { CpuModel } from "./cpu.model";
import { MemoryModel } from "./memory.model";
import { StorageModel } from "./storage.model";

export class ComputationalAssetModel extends AssetModel {
    accelerator?: AcceleratorModel[];
    cpu?: CpuModel[];
    kernel?: string;
    memory?: MemoryModel[];
    os?: string;
    storage?: StorageModel[];
    type?: string;

    // ToDo: Properties that should be defined in AssetModel
    aiResourceIdentifier: number;
    applicationArea?: string[];
    contact?: any[];
    // aiodEntry: AiodEntry;
    // location?: any[];
    // note: any[];
    // creator?: string[];
    // hasPart?: any[];
    // isPartOf?: any[];
    // relevantLink: string[];
    // relevantResource: any[];
    // relevantTo: any[];

    constructor(data: any) {
      super(data, AssetCategory.ComputationalAsset);
      // this.aiodEntry = {
      //   // platform: data.aiod_entry.platform,
      //   // platformIdentifier: data.aiod_entry.platform_identifier,
      //   dateModified: data.aiod_entry.date_modified,
      //   dateCreated: data.aiod_entry.date_created,
      //   editor: data.aiod_entry.editor,
      //   status: data.aiod_entry.status,
      // };

      // ToDo: move this to parent class constructor
      this.aiResourceIdentifier = data.ai_resource_identifier;
      this.applicationArea = data.application_area;
      this.contact = data.contact;
      // this.location = data.location;
      // this.creator = data.creator;
      // this.hasPart = data.has_part;
      // this.isPartOf = data.is_part_of;
      // this.note = data.note;
      // this.relevantLink = data.relevant_link;
      // this.relevantResource = data.relevant_resource;
      // this.relevantTo = data.relevant_to;

      if (data) this.parseToData(data);
    }

    private parseToData(data: any): void {
      if (data.accelerator && data.accelerator.length > 0) {
        this.accelerator = data.accelerator.map((item: any) => new AcceleratorModel(item))
      } else {
        this.accelerator = []
      }

      if (data.cpu && data.cpu.length > 0) {
        this.cpu = data.cpu.map((item: any) => new CpuModel(item))
      } else {
        this.cpu = []
      }

      this.kernel = data.kernel;

      if (data.memory && data.memory.length > 0) {
        this.memory = data.memory.map((item: any) => new MemoryModel(item))
      } else {
        this.memory = []
      }
      this.os = data.os;
      if (data.storage && data.storage.length > 0) {
        this.storage = data.storage.map((item: any) => new StorageModel(item))
      } else {
        this.storage = []
      }
      this.type = data.type;
    }
}