declare namespace IDHandler {
    namespace $IDHandler {
        let _last_id: number;
        let _references: {};
        function get(p_id: any): any;
        function add(p_data: any): number;
        function remove(p_id: any): void;
    }
}
declare namespace GodotConfig {
    let $GodotConfig__postset: string;
    let $GodotConfig__deps: string[];
    namespace $GodotConfig {
        let canvas: any;
        let locale: string;
        let canvas_resize_policy: number;
        let virtual_keyboard: boolean;
        let persistent_drops: boolean;
        let godot_pool_size: number;
        let on_execute: any;
        let on_exit: any;
        function init_config(p_opts: any): void;
        function locate_file(file: any): any;
        function clear(): void;
    }
    let godot_js_config_canvas_id_get__proxy: string;
    let godot_js_config_canvas_id_get__sig: string;
    function godot_js_config_canvas_id_get(p_ptr: any, p_ptr_max: any): void;
    let godot_js_config_locale_get__proxy: string;
    let godot_js_config_locale_get__sig: string;
    function godot_js_config_locale_get(p_ptr: any, p_ptr_max: any): void;
}
declare namespace GodotFS {
    let $GodotFS__deps: string[];
    let $GodotFS__postset: string;
    namespace $GodotFS {
        let ENOENT: number;
        let _idbfs: boolean;
        let _syncing: boolean;
        let _mount_points: any[];
        function is_persistent(): 1 | 0;
        function init(persistentPaths: any): Promise<any>;
        function deinit(): void;
        function sync(): Promise<any>;
        function copy_to_fs(path: any, buffer: any): void;
    }
}
declare namespace GodotOS {
    let $GodotOS__deps: string[];
    let $GodotOS__postset: string;
    namespace $GodotOS {
        function request_quit(): void;
        let _async_cbs: any[];
        let _fs_sync_promise: any;
        function atexit(p_promise_cb: any): void;
        function cleanup(exit_code: any): void;
        function finish_async(callback: any): void;
    }
    let godot_js_os_finish_async__proxy: string;
    let godot_js_os_finish_async__sig: string;
    function godot_js_os_finish_async(p_callback: any): void;
    let godot_js_os_request_quit_cb__proxy: string;
    let godot_js_os_request_quit_cb__sig: string;
    function godot_js_os_request_quit_cb(p_callback: any): void;
    let godot_js_os_fs_is_persistent__proxy: string;
    let godot_js_os_fs_is_persistent__sig: string;
    function godot_js_os_fs_is_persistent(): any;
    let godot_js_os_fs_sync__proxy: string;
    let godot_js_os_fs_sync__sig: string;
    function godot_js_os_fs_sync(callback: any): void;
    let godot_js_os_has_feature__proxy: string;
    let godot_js_os_has_feature__sig: string;
    function godot_js_os_has_feature(p_ftr: any): 1 | 0;
    let godot_js_os_execute__proxy: string;
    let godot_js_os_execute__sig: string;
    function godot_js_os_execute(p_json: any): 1 | 0;
    let godot_js_os_shell_open__proxy: string;
    let godot_js_os_shell_open__sig: string;
    function godot_js_os_shell_open(p_uri: any): void;
    let godot_js_os_hw_concurrency_get__proxy: string;
    let godot_js_os_hw_concurrency_get__sig: string;
    function godot_js_os_hw_concurrency_get(): number;
    let godot_js_os_thread_pool_size_get__proxy: string;
    let godot_js_os_thread_pool_size_get__sig: string;
    function godot_js_os_thread_pool_size_get(): any;
    let godot_js_os_download_buffer__proxy: string;
    let godot_js_os_download_buffer__sig: string;
    function godot_js_os_download_buffer(p_ptr: any, p_size: any, p_name: any, p_mime: any): void;
}
declare namespace GodotEventListeners {
    let $GodotEventListeners__deps: string[];
    let $GodotEventListeners__postset: string;
    namespace $GodotEventListeners {
        export let handlers: any[];
        export function has(target: any, event: any, method: any, capture: any): boolean;
        export function add_1(target: any, event: any, method: any, capture: any): void;
        export { add_1 as add };
        export function clear_1(): void;
        export { clear_1 as clear };
    }
}
declare namespace GodotPWA {
    let $GodotPWA__deps: string[];
    namespace $GodotPWA {
        let hasUpdate: boolean;
        function updateState(cb: any, reg: any): void;
    }
    let godot_js_pwa_cb__proxy: string;
    let godot_js_pwa_cb__sig: string;
    function godot_js_pwa_cb(p_update_cb: any): void;
    let godot_js_pwa_update__proxy: string;
    let godot_js_pwa_update__sig: string;
    function godot_js_pwa_update(): 1 | 0;
}
