export class StorageModel {
  amount: number;
  model: string;
  read_bandwidth: number;
  type: string;
  vendor: string;
  write_bandwidth: number;

  constructor(data: any) {
    this.amount = data?.amount??0;
    this.model = data?.model??'';
    this.read_bandwidth = data?.read_bandwidth??0;
    this.type = data?.type??'';
    this.vendor = data?.vendor??'';
    this.write_bandwidth = data?.write_bandwidth??0;
  }        
}