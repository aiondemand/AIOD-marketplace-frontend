export class CpuModel {
  architecture: string;
  cpu_family: string;
  num_cpu_cores: number;
  vendor: string;

  constructor(data: any) {
    this.architecture = data?.architecture??'';
    this.cpu_family = data?.cpu_family??'';
    this.num_cpu_cores = data?.num_cpu_cores??0;
    this.vendor = data?.vendor??'';
  }
}
