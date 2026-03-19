/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
declare class RingBuffer {
    constructor(p_buffer: any, p_state: any, p_threads: any);
    buffer: any;
    avail: any;
    threads: any;
    rpos: number;
    wpos: number;
    data_left(): any;
    space_left(): number;
    read(output: any): void;
    write(p_buffer: any): void;
}
declare class GodotProcessor {
    static array_has_data(arr: any): any;
    static write_output(dest: any, source: any): void;
    static write_input(dest: any, source: any): void;
    threads: boolean;
    running: boolean;
    lock: any;
    notifier: any;
    output: RingBuffer;
    output_buffer: Float32Array<ArrayBuffer>;
    input: RingBuffer;
    input_buffer: Float32Array<ArrayBuffer>;
    process_notify(): void;
    parse_message(p_cmd: any, p_data: any): void;
    process(inputs: any, outputs: any, parameters: any): boolean;
}
