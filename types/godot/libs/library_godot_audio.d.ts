/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
/**
 * @typedef { "disabled" | "forward" | "backward" | "pingpong" } LoopMode
 */
/**
 * @typedef {{
 *   id: string
 *   audioBuffer: AudioBuffer
 * }} SampleParams
 * @typedef {{
 *   numberOfChannels?: number
 *   sampleRate?: number
 *   loopMode?: LoopMode
 *   loopBegin?: number
 *   loopEnd?: number
 * }} SampleOptions
 */
/**
 * Represents a sample, memory-wise.
 * @class
 */
declare class Sample {
    /**
     * Returns a `Sample`.
     * @param {string} id Id of the `Sample` to get.
     * @returns {Sample}
     * @throws {ReferenceError} When no `Sample` is found
     */
    static getSample(id: string): Sample;
    /**
     * Returns a `Sample` or `null`, if it doesn't exist.
     * @param {string} id Id of the `Sample` to get.
     * @returns {Sample?}
     */
    static getSampleOrNull(id: string): Sample | null;
    /**
     * Creates a `Sample` based on the params. Will register it to the
     * `GodotAudio.samples` registry.
     * @param {SampleParams} params Base params
     * @param {SampleOptions | undefined} options Optional params.
     * @returns {Sample}
     */
    static create(params: SampleParams, options?: SampleOptions | undefined): Sample;
    /**
     * Deletes a `Sample` based on the id.
     * @param {string} id `Sample` id to delete
     * @returns {void}
     */
    static delete(id: string): void;
    /**
     * `Sample` constructor.
     * @param {SampleParams} params Base params
     * @param {SampleOptions | undefined} options Optional params.
     */
    constructor(params: SampleParams, options?: SampleOptions | undefined);
    /** @type {string} */
    id: string;
    /** @type {AudioBuffer} */
    _audioBuffer: AudioBuffer;
    /** @type {number} */
    numberOfChannels: number;
    /** @type {number} */
    sampleRate: number;
    /** @type {LoopMode} */
    loopMode: LoopMode;
    /** @type {number} */
    loopBegin: number;
    /** @type {number} */
    loopEnd: number;
    /**
     * Gets the audio buffer of the sample.
     * @returns {AudioBuffer}
     */
    getAudioBuffer(): AudioBuffer;
    /**
     * Sets the audio buffer of the sample.
     * @param {AudioBuffer} val The audio buffer to set.
     * @returns {void}
     */
    setAudioBuffer(val: AudioBuffer): void;
    /**
     * Clears the current sample.
     * @returns {void}
     */
    clear(): void;
    /**
     * Returns a duplicate of the stored audio buffer.
     * @returns {AudioBuffer}
     */
    _duplicateAudioBuffer(): AudioBuffer;
}
/**
 * Represents a `SampleNode` linked to a `Bus`.
 * @class
 */
declare class SampleNodeBus {
    /**
     * Creates a new `SampleNodeBus`.
     * @param {Bus} bus The bus related to the new `SampleNodeBus`.
     * @returns {SampleNodeBus}
     */
    static create(bus: Bus): SampleNodeBus;
    /**
     * `SampleNodeBus` constructor.
     * @param {Bus} bus The bus related to the new `SampleNodeBus`.
     */
    constructor(bus: Bus);
    /** @type {Bus} */
    _bus: Bus;
    /** @type {ChannelSplitterNode} */
    _channelSplitter: ChannelSplitterNode;
    /** @type {GainNode} */
    _l: GainNode;
    /** @type {GainNode} */
    _r: GainNode;
    /** @type {GainNode} */
    _sl: GainNode;
    /** @type {GainNode} */
    _sr: GainNode;
    /** @type {GainNode} */
    _c: GainNode;
    /** @type {GainNode} */
    _lfe: GainNode;
    /** @type {ChannelMergerNode} */
    _channelMerger: ChannelMergerNode;
    /**
     * Returns the input node.
     * @returns {AudioNode}
     */
    getInputNode(): AudioNode;
    /**
     * Returns the output node.
     * @returns {AudioNode}
     */
    getOutputNode(): AudioNode;
    /**
     * Sets the volume for each (split) channel.
     * @param {Float32Array} volume Volume array from the engine for each channel.
     * @returns {void}
     */
    setVolume(volume: Float32Array): void;
    /**
     * Clears the current `SampleNodeBus` instance.
     * @returns {void}
     */
    clear(): void;
}
/**
 * @typedef {{
 *   id: string
 *   streamObjectId: string
 *   busIndex: number
 * }} SampleNodeParams
 * @typedef {{
 *   offset?: number
 *   playbackRate?: number
 *   startTime?: number
 *   pitchScale?: number
 *   loopMode?: LoopMode
 *   volume?: Float32Array
 *   start?: boolean
 * }} SampleNodeOptions
 */
/**
 * Represents an `AudioNode` of a `Sample`.
 * @class
 */
declare class SampleNode {
    /**
     * Returns a `SampleNode`.
     * @param {string} id Id of the `SampleNode`.
     * @returns {SampleNode}
     * @throws {ReferenceError} When no `SampleNode` is not found
     */
    static getSampleNode(id: string): SampleNode;
    /**
     * Returns a `SampleNode`, returns null if not found.
     * @param {string} id Id of the SampleNode.
     * @returns {SampleNode?}
     */
    static getSampleNodeOrNull(id: string): SampleNode | null;
    /**
     * Stops a `SampleNode` by id.
     * @param {string} id Id of the `SampleNode` to stop.
     * @returns {void}
     */
    static stopSampleNode(id: string): void;
    /**
     * Pauses the `SampleNode` by id.
     * @param {string} id Id of the `SampleNode` to pause.
     * @param {boolean} enable State of the pause
     * @returns {void}
     */
    static pauseSampleNode(id: string, enable: boolean): void;
    /**
     * Creates a `SampleNode` based on the params. Will register the `SampleNode` to
     * the `GodotAudio.sampleNodes` regisery.
     * @param {SampleNodeParams} params Base params.
     * @param {SampleNodeOptions | undefined} options Optional params.
     * @returns {SampleNode}
     */
    static create(params: SampleNodeParams, options?: SampleNodeOptions | undefined): SampleNode;
    /**
     * Deletes a `SampleNode` based on the id.
     * @param {string} id Id of the `SampleNode` to delete.
     * @returns {void}
     */
    static delete(id: string): void;
    /**
     * @param {SampleNodeParams} params Base params
     * @param {SampleNodeOptions | undefined} options Optional params.
     */
    constructor(params: SampleNodeParams, options?: SampleNodeOptions | undefined);
    /** @type {string} */
    id: string;
    /** @type {string} */
    streamObjectId: string;
    /** @type {number} */
    offset: number;
    /** @type {number} */
    _playbackPosition: number;
    /** @type {number} */
    startTime: number;
    /** @type {boolean} */
    isPaused: boolean;
    /** @type {boolean} */
    isStarted: boolean;
    /** @type {boolean} */
    isCanceled: boolean;
    /** @type {number} */
    pauseTime: number;
    /** @type {number} */
    _playbackRate: number;
    /** @type {LoopMode} */
    loopMode: LoopMode;
    /** @type {number} */
    _pitchScale: number;
    /** @type {number} */
    _sourceStartTime: number;
    /** @type {Map<Bus, SampleNodeBus>} */
    _sampleNodeBuses: Map<Bus, SampleNodeBus>;
    /** @type {AudioBufferSourceNode | null} */
    _source: AudioBufferSourceNode | null;
    _onended: (_: any) => void;
    /** @type {AudioWorkletNode | null} */
    _positionWorklet: AudioWorkletNode | null;
    /**
     * Gets the playback rate.
     * @returns {number}
     */
    getPlaybackRate(): number;
    /**
     * Gets the playback position.
     * @returns {number}
     */
    getPlaybackPosition(): number;
    /**
     * Sets the playback rate.
     * @param {number} val Value to set.
     * @returns {void}
     */
    setPlaybackRate(val: number): void;
    /**
     * Gets the pitch scale.
     * @returns {number}
     */
    getPitchScale(): number;
    /**
     * Sets the pitch scale.
     * @param {number} val Value to set.
     * @returns {void}
     */
    setPitchScale(val: number): void;
    /**
     * Returns the linked `Sample`.
     * @returns {Sample}
     */
    getSample(): Sample;
    /**
     * Returns the output node.
     * @returns {AudioNode}
     */
    getOutputNode(): AudioNode;
    /**
     * Starts the `SampleNode`.
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the `SampleNode`.
     * @returns {void}
     */
    stop(): void;
    /**
     * Restarts the `SampleNode`.
     */
    restart(): void;
    /**
     * Pauses the `SampleNode`.
     * @param {boolean} [enable=true] State of the pause.
     * @returns {void}
     */
    pause(enable?: boolean): void;
    /**
     * Connects an AudioNode to the output node of this `SampleNode`.
     * @param {AudioNode} node AudioNode to connect.
     * @returns {void}
     */
    connect(node: AudioNode): void;
    /**
     * Sets the volumes of the `SampleNode` for each buses passed in parameters.
     * @param {Array<Bus>} buses
     * @param {Float32Array} volumes
     */
    setVolumes(buses: Array<Bus>, volumes: Float32Array): void;
    /**
     * Returns the SampleNodeBus based on the bus in parameters.
     * @param {Bus} bus Bus to get the SampleNodeBus from.
     * @returns {SampleNodeBus}
     */
    getSampleNodeBus(bus: Bus): SampleNodeBus;
    /**
     * Sets up and connects the source to the GodotPositionReportingProcessor
     * If the worklet module is not loaded in, it will be added
     */
    connectPositionWorklet(start: any): Promise<void>;
    /**
     * Get a AudioWorkletProcessor
     * @returns {AudioWorkletNode}
     */
    getPositionWorklet(): AudioWorkletNode;
    /**
     * Clears the `SampleNode`.
     * @returns {void}
     */
    clear(): void;
    /**
     * Resets the source start time
     * @returns {void}
     */
    _resetSourceStartTime(): void;
    /**
     * Syncs the `AudioNode` playback rate based on the `SampleNode` playback rate and pitch scale.
     * @returns {void}
     */
    _syncPlaybackRate(): void;
    /**
     * Restarts the `SampleNode`.
     * Honors `isPaused` and `pauseTime`.
     * @returns {void}
     */
    _restart(): void;
    /**
     * Pauses the `SampleNode`.
     * @returns {void}
     */
    _pause(): void;
    /**
     * Unpauses the `SampleNode`.
     * @returns {void}
     */
    _unpause(): void;
    /**
     * Adds an "ended" listener to the source node to repeat it if necessary.
     * @returns {void}
     */
    _addEndedListener(): void;
}
/**
 * Collection of nodes to represents a Godot Engine audio bus.
 * @class
 */
declare class Bus {
    /**
     * Returns the number of registered buses.
     * @returns {number}
     */
    static getCount(): number;
    /**
     * Sets the number of registered buses.
     * Will delete buses if lower than the current number.
     * @param {number} val Count of registered buses.
     * @returns {void}
     */
    static setCount(val: number): void;
    /**
     * Returns a `Bus` based on it's index number.
     * @param {number} index
     * @returns {Bus}
     * @throws {ReferenceError} If the index value is outside the registry.
     */
    static getBus(index: number): Bus;
    /**
     * Returns a `Bus` based on it's index number. Returns null if it doesn't exist.
     * @param {number} index
     * @returns {Bus?}
     */
    static getBusOrNull(index: number): Bus | null;
    /**
     * Move a bus from an index to another.
     * @param {number} fromIndex From index
     * @param {number} toIndex To index
     * @returns {void}
     */
    static move(fromIndex: number, toIndex: number): void;
    /**
     * Adds a new bus at the specified index.
     * @param {number} index Index to add a new bus.
     * @returns {void}
     */
    static addAt(index: number): void;
    /**
     * Creates a `Bus` and registers it.
     * @returns {Bus}
     */
    static create(): Bus;
    /** @type {Set<SampleNode>} */
    _sampleNodes: Set<SampleNode>;
    /** @type {boolean} */
    isSolo: boolean;
    /** @type {Bus?} */
    _send: Bus | null;
    /** @type {GainNode} */
    _gainNode: GainNode;
    /** @type {GainNode} */
    _soloNode: GainNode;
    /** @type {GainNode} */
    _muteNode: GainNode;
    /**
     * Returns the current id of the bus (its index).
     * @returns {number}
     */
    getId(): number;
    /**
     * Returns the bus volume db value.
     * @returns {number}
     */
    getVolumeDb(): number;
    /**
     * Sets the bus volume db value.
     * @param {number} val Value to set
     * @returns {void}
     */
    setVolumeDb(val: number): void;
    /**
     * Returns the "send" bus.
     * If null, this bus sends its contents directly to the output.
     * If not null, this bus sends its contents to another bus.
     * @returns {Bus?}
     */
    getSend(): Bus | null;
    /**
     * Sets the "send" bus.
     * If null, this bus sends its contents directly to the output.
     * If not null, this bus sends its contents to another bus.
     *
     * **Note:** if null, `getId()` must be equal to 0. Otherwise, it will throw.
     * @param {Bus?} val
     * @returns {void}
     * @throws {Error} When val is `null` and `getId()` isn't equal to 0
     */
    setSend(val: Bus | null): void;
    /**
     * Returns the input node of the bus.
     * @returns {AudioNode}
     */
    getInputNode(): AudioNode;
    /**
     * Returns the output node of the bus.
     * @returns {AudioNode}
     */
    getOutputNode(): AudioNode;
    /**
     * Sets the mute status of the bus.
     * @param {boolean} enable
     */
    mute(enable: boolean): void;
    /**
     * Sets the solo status of the bus.
     * @param {boolean} enable
     */
    solo(enable: boolean): void;
    /**
     * Wrapper to simply add a sample node to the bus.
     * @param {SampleNode} sampleNode `SampleNode` to remove
     * @returns {void}
     */
    addSampleNode(sampleNode: SampleNode): void;
    /**
     * Wrapper to simply remove a sample node from the bus.
     * @param {SampleNode} sampleNode `SampleNode` to remove
     * @returns {void}
     */
    removeSampleNode(sampleNode: SampleNode): void;
    /**
     * Wrapper to simply connect to another bus.
     * @param {Bus} bus
     * @returns {void}
     */
    connect(bus: Bus): void;
    /**
     * Clears the current bus.
     * @returns {void}
     */
    clear(): void;
    _syncSampleNodes(): void;
    /**
     * Process to enable solo.
     * @returns {void}
     */
    _enableSolo(): void;
    /**
     * Process to disable solo.
     * @returns {void}
     */
    _disableSolo(): void;
}
declare namespace _GodotAudio {
    let $GodotAudio__deps: string[];
    namespace $GodotAudio {
        export let MAX_VOLUME_CHANNELS: number;
        export let GodotChannel: Readonly<{
            CHANNEL_L: 0;
            CHANNEL_R: 1;
            CHANNEL_C: 3;
            CHANNEL_LFE: 4;
            CHANNEL_RL: 5;
            CHANNEL_RR: 6;
            CHANNEL_SL: 7;
            CHANNEL_SR: 8;
        }>;
        export let WebChannel: Readonly<{
            CHANNEL_L: 0;
            CHANNEL_R: 1;
            CHANNEL_SL: 2;
            CHANNEL_SR: 3;
            CHANNEL_C: 4;
            CHANNEL_LFE: 5;
        }>;
        export let samples: Map<string, Sample>;
        export { Sample };
        export { SampleNodeBus };
        export let sampleNodes: Map<string, SampleNode>;
        export { SampleNode };
        export function deleteSampleNode(pSampleNodeId: any): void;
        export let buses: Array<Bus>;
        export let busSolo: Bus | null;
        export { Bus };
        export let sampleFinishedCallback: (playbackObjectIdPtr: number) => void | null;
        export let ctx: AudioContext;
        export let input: any;
        export let driver: any;
        export let interval: number;
        export let audioPositionWorkletPromise: Promise<any>;
        export let audioPositionWorkletNodes: Array<AudioWorkletNode>;
        export function linear_to_db(linear: number): number;
        export function db_to_linear(db: number): number;
        export function init(mix_rate: any, latency: any, onstatechange: any, onlatencyupdate: any): any;
        export function create_input(callback: any): 1 | 0;
        export function close_async(resolve: any, reject: any): void;
        export function start_sample(playbackObjectId: string, streamObjectId: string, busIndex: number, startOptions: SampleNodeOptions | undefined): void;
        export function stop_sample(playbackObjectId: string): void;
        export function sample_set_pause(playbackObjectId: string, pause: boolean): void;
        export function update_sample_pitch_scale(playbackObjectId: string, pitchScale: number): void;
        export function sample_set_volumes_linear(playbackObjectId: string, busIndexes: Array<number>, volumes: Float32Array): void;
        export function set_sample_bus_count(count: number): void;
        export function remove_sample_bus(index: number): void;
        export function add_sample_bus(atPos: number): void;
        export function move_sample_bus(busIndex: number, toPos: number): void;
        export function set_sample_bus_send(busIndex: number, sendIndex: number): void;
        export function set_sample_bus_volume_db(busIndex: number, volumeDb: number): void;
        export function set_sample_bus_solo(busIndex: number, enable: boolean): void;
        export function set_sample_bus_mute(busIndex: number, enable: boolean): void;
    }
    let godot_audio_is_available__sig: string;
    let godot_audio_is_available__proxy: string;
    function godot_audio_is_available(): 1 | 0;
    let godot_audio_has_worklet__proxy: string;
    let godot_audio_has_worklet__sig: string;
    function godot_audio_has_worklet(): 1 | 0;
    let godot_audio_has_script_processor__proxy: string;
    let godot_audio_has_script_processor__sig: string;
    function godot_audio_has_script_processor(): 1 | 0;
    let godot_audio_init__proxy: string;
    let godot_audio_init__sig: string;
    function godot_audio_init(p_mix_rate: any, p_latency: any, p_state_change: any, p_latency_update: any): any;
    let godot_audio_resume__proxy: string;
    let godot_audio_resume__sig: string;
    function godot_audio_resume(): void;
    let godot_audio_input_start__proxy: string;
    let godot_audio_input_start__sig: string;
    function godot_audio_input_start(): any;
    let godot_audio_input_stop__proxy: string;
    let godot_audio_input_stop__sig: string;
    function godot_audio_input_stop(): void;
    let godot_audio_sample_stream_is_registered__proxy: string;
    let godot_audio_sample_stream_is_registered__sig: string;
    function godot_audio_sample_stream_is_registered(streamObjectIdStrPtr: number): number;
    let godot_audio_sample_register_stream__proxy: string;
    let godot_audio_sample_register_stream__sig: string;
    function godot_audio_sample_register_stream(streamObjectIdStrPtr: number, framesPtr: number, framesTotal: number, loopModeStrPtr: number, loopBegin: number, loopEnd: number): void;
    let godot_audio_sample_unregister_stream__proxy: string;
    let godot_audio_sample_unregister_stream__sig: string;
    function godot_audio_sample_unregister_stream(streamObjectIdStrPtr: number): void;
    let godot_audio_sample_start__proxy: string;
    let godot_audio_sample_start__sig: string;
    function godot_audio_sample_start(playbackObjectIdStrPtr: number, streamObjectIdStrPtr: number, busIndex: number, offset: number, pitchScale: number, volumePtr: number): void;
    let godot_audio_sample_stop__proxy: string;
    let godot_audio_sample_stop__sig: string;
    function godot_audio_sample_stop(playbackObjectIdStrPtr: number): void;
    let godot_audio_sample_set_pause__proxy: string;
    let godot_audio_sample_set_pause__sig: string;
    function godot_audio_sample_set_pause(playbackObjectIdStrPtr: number, pause: number): void;
    let godot_audio_sample_is_active__proxy: string;
    let godot_audio_sample_is_active__sig: string;
    function godot_audio_sample_is_active(playbackObjectIdStrPtr: number): number;
    let godot_audio_get_sample_playback_position__proxy: string;
    let godot_audio_get_sample_playback_position__sig: string;
    function godot_audio_get_sample_playback_position(playbackObjectIdStrPtr: number): number;
    let godot_audio_sample_update_pitch_scale__proxy: string;
    let godot_audio_sample_update_pitch_scale__sig: string;
    function godot_audio_sample_update_pitch_scale(playbackObjectIdStrPtr: number, pitchScale: number): void;
    let godot_audio_sample_set_volumes_linear__proxy: string;
    let godot_audio_sample_set_volumes_linear__sig: string;
    function godot_audio_sample_set_volumes_linear(playbackObjectIdStrPtr: number, busesPtr: number, busesSize: number, volumesPtr: number, volumesSize: number): void;
    let godot_audio_sample_bus_set_count__proxy: string;
    let godot_audio_sample_bus_set_count__sig: string;
    function godot_audio_sample_bus_set_count(count: number): void;
    let godot_audio_sample_bus_remove__proxy: string;
    let godot_audio_sample_bus_remove__sig: string;
    function godot_audio_sample_bus_remove(index: number): void;
    let godot_audio_sample_bus_add__proxy: string;
    let godot_audio_sample_bus_add__sig: string;
    function godot_audio_sample_bus_add(atPos: number): void;
    let godot_audio_sample_bus_move__proxy: string;
    let godot_audio_sample_bus_move__sig: string;
    function godot_audio_sample_bus_move(fromPos: number, toPos: number): void;
    let godot_audio_sample_bus_set_send__proxy: string;
    let godot_audio_sample_bus_set_send__sig: string;
    function godot_audio_sample_bus_set_send(bus: number, sendIndex: number): void;
    let godot_audio_sample_bus_set_volume_db__proxy: string;
    let godot_audio_sample_bus_set_volume_db__sig: string;
    function godot_audio_sample_bus_set_volume_db(bus: number, volumeDb: number): void;
    let godot_audio_sample_bus_set_solo__proxy: string;
    let godot_audio_sample_bus_set_solo__sig: string;
    function godot_audio_sample_bus_set_solo(bus: number, enable: number): void;
    let godot_audio_sample_bus_set_mute__proxy: string;
    let godot_audio_sample_bus_set_mute__sig: string;
    function godot_audio_sample_bus_set_mute(bus: number, enable: number): void;
    let godot_audio_sample_set_finished_callback__proxy: string;
    let godot_audio_sample_set_finished_callback__sig: string;
    function godot_audio_sample_set_finished_callback(callbackPtr: number): void;
}
declare namespace GodotAudioWorklet {
    let $GodotAudioWorklet__deps: string[];
    namespace $GodotAudioWorklet {
        let promise: any;
        let worklet: any;
        let ring_buffer: any;
        function create(channels: any): void;
        function start(in_buf: any, out_buf: any, state: any): void;
        function start_no_threads(p_out_buf: any, p_out_size: any, out_callback: any, p_in_buf: any, p_in_size: any, in_callback: any): void;
        function get_node(): any;
        function close(): Promise<any>;
    }
    let godot_audio_worklet_create__proxy: string;
    let godot_audio_worklet_create__sig: string;
    function godot_audio_worklet_create(channels: any): 1 | 0;
    let godot_audio_worklet_start__proxy: string;
    let godot_audio_worklet_start__sig: string;
    function godot_audio_worklet_start(p_in_buf: any, p_in_size: any, p_out_buf: any, p_out_size: any, p_state: any): void;
    let godot_audio_worklet_start_no_threads__proxy: string;
    let godot_audio_worklet_start_no_threads__sig: string;
    function godot_audio_worklet_start_no_threads(p_out_buf: any, p_out_size: any, p_out_callback: any, p_in_buf: any, p_in_size: any, p_in_callback: any): void;
    let godot_audio_worklet_state_wait__sig: string;
    function godot_audio_worklet_state_wait(p_state: any, p_idx: any, p_expected: any, p_timeout: any): bigint;
    let godot_audio_worklet_state_add__sig: string;
    function godot_audio_worklet_state_add(p_state: any, p_idx: any, p_value: any): bigint;
    let godot_audio_worklet_state_get__sig: string;
    function godot_audio_worklet_state_get(p_state: any, p_idx: any): bigint;
}
declare namespace GodotAudioScript {
    let $GodotAudioScript__deps: string[];
    namespace $GodotAudioScript {
        export let script: any;
        export function create_1(buffer_length: any, channel_count: any): any;
        export { create_1 as create };
        export function start_1(p_in_buf: any, p_in_size: any, p_out_buf: any, p_out_size: any, onprocess: any): void;
        export { start_1 as start };
        export function get_node_1(): any;
        export { get_node_1 as get_node };
        export function close_1(): Promise<any>;
        export { close_1 as close };
    }
    let godot_audio_script_create__proxy: string;
    let godot_audio_script_create__sig: string;
    function godot_audio_script_create(buffer_length: any, channel_count: any): 1 | 0;
    let godot_audio_script_start__proxy: string;
    let godot_audio_script_start__sig: string;
    function godot_audio_script_start(p_in_buf: any, p_in_size: any, p_out_buf: any, p_out_size: any, p_cb: any): void;
}
type LoopMode = "disabled" | "forward" | "backward" | "pingpong";
type SampleParams = {
    id: string;
    audioBuffer: AudioBuffer;
};
type SampleOptions = {
    numberOfChannels?: number;
    sampleRate?: number;
    loopMode?: LoopMode;
    loopBegin?: number;
    loopEnd?: number;
};
type SampleNodeParams = {
    id: string;
    streamObjectId: string;
    busIndex: number;
};
type SampleNodeOptions = {
    offset?: number;
    playbackRate?: number;
    startTime?: number;
    pitchScale?: number;
    loopMode?: LoopMode;
    volume?: Float32Array;
    start?: boolean;
};
