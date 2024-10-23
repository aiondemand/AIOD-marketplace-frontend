export class MemoryModel {
  amount_gb: number;
  rdma: string;
  type: string;

  constructor(data: any) {
    this.amount_gb = data?.amount_gb??0;
    this.rdma = data?.rdma??'';
    this.type = data?.type??'';
  }
}