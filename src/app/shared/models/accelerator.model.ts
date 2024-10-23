export class AcceleratorModel {
  architecture: string;
  cores: number;
  memory: number;
  type: string;
  vendor: string;

  constructor(data: any) {
    this.architecture = data?.architecture??'';
    this.cores = data?.cores??0;
    this.memory = data?.memory??0;
    this.type = data?.type??'';
    this.vendor = data?.vendor??'';
  }
}