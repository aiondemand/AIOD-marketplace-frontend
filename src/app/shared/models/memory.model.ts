export class MemoryModel {
  amount_gb: number;
  rdma: string;
  read_bandwidth: number;
  type: string;
  write_bandwidth: number;

  constructor(data: any) {
    this.amount_gb = data?.amount_gb??0;
    this.rdma = data?.rdma??'';
    this.read_bandwidth = data?.read_bandwidth??0;
    this.type = data?.type??'';
    this.write_bandwidth = data?.read_bandwidth??0;
  }
}