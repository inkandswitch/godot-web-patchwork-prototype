declare namespace GodotRuntime {
    namespace $GodotRuntime {
        function get_func(ptr: any): any;
        function error(...args: any[]): void;
        function print(...args: any[]): void;
        function malloc(p_size: any): any;
        function free(p_ptr: any): void;
        function getHeapValue(p_ptr: any, p_type: any): any;
        function setHeapValue(p_ptr: any, p_value: any, p_type: any): void;
        function heapSub(p_heap: any, p_ptr: any, p_len: any): any;
        function heapSlice(p_heap: any, p_ptr: any, p_len: any): any;
        function heapCopy(p_dst: any, p_src: any, p_ptr: any): any;
        function parseString(p_ptr: any): any;
        function parseStringArray(p_ptr: any, p_size: any): any[];
        function strlen(p_str: any): any;
        function allocString(p_str: any): any;
        function allocStringArray(p_strings: any): any;
        function freeStringArray(p_ptr: any, p_len: any): void;
        function stringToHeap(p_str: any, p_ptr: any, p_len: any): any;
    }
}
