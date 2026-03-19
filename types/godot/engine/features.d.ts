declare namespace Features {
    function isWebGLAvailable(majorVersion?: number | undefined): boolean;
    function isFetchAvailable(): boolean;
    function isSecureContext(): boolean;
    function isCrossOriginIsolated(): boolean;
    function isSharedArrayBufferAvailable(): boolean;
    function isAudioWorkletAvailable(): boolean;
    function getMissingFeatures(supportedFeatures?: {
        threads: (boolean | undefined);
    }): Array<string>;
}
