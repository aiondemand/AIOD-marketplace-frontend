export class AcceleratorModel {
  architecture: string;
  cores: number;
  memory_gb: number;
  model_name: string;
  type: string;
  vendor: string;

  constructor(data: any) {
    this.architecture = data?.architecture??'';
    this.cores = data?.cores??0;
    this.memory_gb = data?.memory??0;
    this.model_name = data?.model_name??'';
    this.type = data?.type??'';
    this.vendor = data?.vendor??'';
  }
}