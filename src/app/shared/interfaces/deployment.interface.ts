export interface Deployment {
    job_ID: string;
    status: string;
    owner: string;
    title: string;
    description?: string;
    docker_image: string;
    submit_time: string;
    resources?: {
        cpu_num: number;
        gpu_num: number;
        memoryMB: number;
        diskMB: number;
    };
    endpoints?: object;
    main_endpoint: string;
    alloc_ID?: string;
    error_msg?: string;
}

export interface statusReturn {
    status: string;
    error_msg?: string;
    job_id?: string;
}
