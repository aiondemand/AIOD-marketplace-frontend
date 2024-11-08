export class CpuModel {
  architecture: string;
  clock_speed_ghz: number;
  cpu_family: string;
  model_name: string;
  num_cpu_cores: number;
  vendor: string;

  constructor(data: any) {
    this.architecture = data?.architecture??'';
    this.clock_speed_ghz = data?.clock_speed??0;
    this.cpu_family = data?.cpu_family??'';
    this.model_name = data?.model_name??'';
    this.num_cpu_cores = data?.num_cpu_cores??0;
    this.vendor = data?.vendor??'';
  }
}
