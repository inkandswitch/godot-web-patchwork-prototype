declare function Preloader(): void;
declare class Preloader {
    animateProgress: () => void;
    setProgressFunc: (callback: any) => void;
    loadPromise: (file: any, fileSize: any, raw?: boolean) => any;
    preloadedFiles: any[];
    preload: (pathOrBuffer: any, destPath: any, fileSize: any) => any;
}
