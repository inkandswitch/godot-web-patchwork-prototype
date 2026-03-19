declare namespace GodotIME {
    let $GodotIME__deps: string[];
    let $GodotIME__postset: string;
    namespace $GodotIME {
        let ime: any;
        let active: boolean;
        let focusTimerIntervalId: number;
        function getModifiers(evt: any): any;
        function ime_active(active: any): void;
        function ime_position(x: any, y: any): void;
        function init(ime_cb: any, key_cb: any, code: any, key: any): void;
        function clear(): void;
    }
}
declare namespace GodotInputGamepads {
    let $GodotInputGamepads__deps: string[];
    namespace $GodotInputGamepads {
        export let samples: any[];
        export function get_pads(): Gamepad[];
        export function get_samples(): any;
        export function get_sample(index: any): any;
        export function sample(): void;
        export function init_1(onchange: any): void;
        export { init_1 as init };
        export function get_guid(pad: any): any;
    }
}
declare namespace GodotInputDragDrop {
    let $GodotInputDragDrop__deps: string[];
    namespace $GodotInputDragDrop {
        let promises: any[];
        let pending_files: any[];
        function add_entry(entry: any): void;
        function add_dir(entry: any): void;
        function add_file(entry: any): void;
        function process(resolve: any, reject: any): void;
        function _process_event(ev: any, callback: any): void;
        function remove_drop(files: any, drop_path: any): void;
        function handler(callback: any): (ev: any) => void;
    }
}
declare namespace GodotInput {
    let $GodotInput__deps: string[];
    namespace $GodotInput {
        export let inputKeyCallback: any;
        export let setInputKeyData: any;
        export function getModifiers_1(evt: any): any;
        export { getModifiers_1 as getModifiers };
        export function computePosition(evt: any, rect: any): number[];
        export function onKeyEvent(pIsPressed: any, pEvent: any): void;
    }
    let godot_js_input_mouse_move_cb__proxy: string;
    let godot_js_input_mouse_move_cb__sig: string;
    function godot_js_input_mouse_move_cb(callback: any): void;
    let godot_js_input_mouse_wheel_cb__proxy: string;
    let godot_js_input_mouse_wheel_cb__sig: string;
    function godot_js_input_mouse_wheel_cb(callback: any): void;
    let godot_js_input_mouse_button_cb__proxy: string;
    let godot_js_input_mouse_button_cb__sig: string;
    function godot_js_input_mouse_button_cb(callback: any): void;
    let godot_js_input_touch_cb__proxy: string;
    let godot_js_input_touch_cb__sig: string;
    function godot_js_input_touch_cb(callback: any, ids: any, coords: any): void;
    let godot_js_input_key_cb__proxy: string;
    let godot_js_input_key_cb__sig: string;
    function godot_js_input_key_cb(pCallback: any, pCodePtr: any, pKeyPtr: any): void;
    let godot_js_set_ime_active__proxy: string;
    let godot_js_set_ime_active__sig: string;
    function godot_js_set_ime_active(p_active: any): void;
    let godot_js_set_ime_position__proxy: string;
    let godot_js_set_ime_position__sig: string;
    function godot_js_set_ime_position(p_x: any, p_y: any): void;
    let godot_js_set_ime_cb__proxy: string;
    let godot_js_set_ime_cb__sig: string;
    function godot_js_set_ime_cb(p_ime_cb: any, p_key_cb: any, code: any, key: any): void;
    let godot_js_is_ime_focused__proxy: string;
    let godot_js_is_ime_focused__sig: string;
    function godot_js_is_ime_focused(): any;
    let godot_js_input_gamepad_cb__proxy: string;
    let godot_js_input_gamepad_cb__sig: string;
    function godot_js_input_gamepad_cb(change_cb: any): void;
    let godot_js_input_gamepad_sample_count__proxy: string;
    let godot_js_input_gamepad_sample_count__sig: string;
    function godot_js_input_gamepad_sample_count(): any;
    let godot_js_input_gamepad_sample__proxy: string;
    let godot_js_input_gamepad_sample__sig: string;
    function godot_js_input_gamepad_sample(): number;
    let godot_js_input_gamepad_sample_get__proxy: string;
    let godot_js_input_gamepad_sample_get__sig: string;
    function godot_js_input_gamepad_sample_get(p_index: any, r_btns: any, r_btns_num: any, r_axes: any, r_axes_num: any, r_standard: any): 1 | 0;
    let godot_js_input_drop_files_cb__proxy: string;
    let godot_js_input_drop_files_cb__sig: string;
    function godot_js_input_drop_files_cb(callback: any): void;
    let godot_js_input_paste_cb__proxy: string;
    let godot_js_input_paste_cb__sig: string;
    function godot_js_input_paste_cb(callback: any): void;
    let godot_js_input_vibrate_handheld__proxy: string;
    let godot_js_input_vibrate_handheld__sig: string;
    function godot_js_input_vibrate_handheld(p_duration_ms: any): void;
}
