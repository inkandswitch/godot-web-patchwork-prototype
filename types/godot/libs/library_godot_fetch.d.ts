declare namespace GodotFetch {
    let $GodotFetch__deps: string[];
    namespace $GodotFetch {
        function onread(id: any, result: any): void;
        function onresponse(id: any, response: any): void;
        function onerror(id: any, err: any): void;
        function create(method: any, url: any, headers: any, body: any): any;
        function free(id: any): void;
        function read(id: any): void;
    }
    let godot_js_fetch_create__proxy: string;
    let godot_js_fetch_create__sig: string;
    function godot_js_fetch_create(p_method: any, p_url: any, p_headers: any, p_headers_size: any, p_body: any, p_body_size: any): any;
    let godot_js_fetch_state_get__proxy: string;
    let godot_js_fetch_state_get__sig: string;
    function godot_js_fetch_state_get(p_id: any): 1 | 0 | 2 | -1;
    let godot_js_fetch_http_status_get__proxy: string;
    let godot_js_fetch_http_status_get__sig: string;
    function godot_js_fetch_http_status_get(p_id: any): any;
    let godot_js_fetch_read_headers__proxy: string;
    let godot_js_fetch_read_headers__sig: string;
    function godot_js_fetch_read_headers(p_id: any, p_parse_cb: any, p_ref: any): 1 | 0;
    let godot_js_fetch_read_chunk__proxy: string;
    let godot_js_fetch_read_chunk__sig: string;
    function godot_js_fetch_read_chunk(p_id: any, p_buf: any, p_buf_size: any): number;
    let godot_js_fetch_is_chunked__proxy: string;
    let godot_js_fetch_is_chunked__sig: string;
    function godot_js_fetch_is_chunked(p_id: any): 1 | 0 | -1;
    let godot_js_fetch_free__proxy: string;
    let godot_js_fetch_free__sig: string;
    function godot_js_fetch_free(id: any): void;
}
