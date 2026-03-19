/**
 * Projects exported for the Web expose the :js:class:`Engine` class to the JavaScript environment, that allows
 * fine control over the engine's start-up process.
 *
 * This API is built in an asynchronous manner and requires basic understanding
 * of `Promises <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises>`__.
 *
 * @module Engine
 * @header Web export JavaScript reference
 */

interface EngineSupportedFeatures {
	threads?: boolean;
}

/**
 * @classdesc The ``Engine`` class provides methods for loading and starting exported projects on the Web. For default export
 * settings, this is already part of the exported HTML page. To understand practical use of the ``Engine`` class,
 * see :ref:`Custom HTML page for Web export <doc_customizing_html5_shell>`.
 *
 * @description Create a new Engine instance with the given configuration.
 *
 * @global
 * @constructor
 * @param {EngineConfig} initConfig The initial config for this instance.
 */
interface EngineInstance {
	/**
	 * Initialize the engine instance. Optionally, pass the base path to the engine to load it,
	 * if it hasn't been loaded yet. See :js:meth:`Engine.load`.
	 *
	 * @param {string=} basePath Base path of the engine to load.
	 * @return {Promise} A ``Promise`` that resolves once the engine is loaded and initialized.
	 */
	init(basePath?: string): Promise<void>;

	/**
	 * Load a file so it is available in the instance's file system once it runs. Must be called **before** starting the
	 * instance.
	 *
	 * If not provided, the ``path`` is derived from the URL of the loaded file.
	 *
	 * @param {string|ArrayBuffer} file The file to preload.
	 *
	 * If a ``string`` the file will be loaded from that path.
	 *
	 * If an ``ArrayBuffer`` or a view on one, the buffer will used as the content of the file.
	 *
	 * @param {string=} path Path by which the file will be accessible. Required, if ``file`` is not a string.
	 *
	 * @returns {Promise} A Promise that resolves once the file is loaded.
	 */
	preloadFile(file: string | ArrayBuffer | ArrayBufferView, path?: string): Promise<void>;

	/**
	 * Start the engine instance using the given override configuration (if any).
	 * :js:meth:`startGame <Engine.prototype.startGame>` can be used in typical cases instead.
	 *
	 * This will initialize the instance if it is not initialized. For manual initialization, see :js:meth:`init <Engine.prototype.init>`.
	 * The engine must be loaded beforehand.
	 *
	 * Fails if a canvas cannot be found on the page, or not specified in the configuration.
	 *
	 * @param {EngineConfig} override An optional configuration override.
	 * @return {Promise} Promise that resolves once the engine started.
	 */
	start(override?: EngineConfig): Promise<void>;

	/**
	 * Start the game instance using the given configuration override (if any).
	 *
	 * This will initialize the instance if it is not initialized. For manual initialization, see :js:meth:`init <Engine.prototype.init>`.
	 *
	 * This will load the engine if it is not loaded, and preload the main pck.
	 *
	 * This method expects the initial config (or the override) to have both the :js:attr:`executable` and :js:attr:`mainPack`
	 * properties set (normally done by the editor during export).
	 *
	 * @param {EngineConfig} override An optional configuration override.
	 * @return {Promise} Promise that resolves once the game started.
	 */
	startGame(override?: EngineConfig): Promise<void>;

	/**
	 * Create a file at the specified ``path`` with the passed as ``buffer`` in the instance's file system.
	 *
	 * @param {string} path The location where the file will be created.
	 * @param {ArrayBuffer} buffer The content of the file.
	 */
	copyToFS(path: string, buffer: ArrayBuffer): void;

	/**
	 * Request that the current instance quit.
	 *
	 * This is akin the user pressing the close button in the window manager, and will
	 * have no effect if the engine has crashed, or is stuck in a loop.
	 *
	 */
	requestQuit(): void;

	/**
	 * Install the progressive-web app service worker.
	 * @returns {Promise} The service worker registration promise.
	 */
	installServiceWorker(): Promise<ServiceWorkerRegistration | void>;

	/**
	 * Also expose static methods as instance methods.
	 */
	load(basePath: string, size?: number): Promise<Response>;
	unload(): void;
}

interface EngineConstructor {
	new(initConfig?: EngineConfig): EngineInstance;
	(initConfig?: EngineConfig): EngineInstance;

	/**
	 * Load the engine from the specified base path.
	 *
	 * @param {string} basePath Base path of the engine to load.
	 * @param {number=} [size=0] The file size if known.
	 * @returns {Promise} A Promise that resolves once the engine is loaded.
	 *
	 * @function Engine.load
	 */
	load(basePath: string, size?: number): Promise<Response>;

	/**
	 * Unload the engine to free memory.
	 *
	 * This method will be called automatically depending on the configuration. See :js:attr:`unloadAfterInit`.
	 *
	 * @function Engine.unload
	 */
	unload(): void;

	/**
	 * Check whether WebGL is available. Optionally, specify a particular version of WebGL to check for.
	 *
	 * @param {number=} [majorVersion=1] The major WebGL version to check for.
	 * @returns {boolean} If the given major version of WebGL is available.
	 * @function Engine.isWebGLAvailable
	 */
	isWebGLAvailable(majorVersion?: number): boolean;

	/**
	 * Check whether the Fetch API available and supports streaming responses.
	 *
	 * @returns {boolean} If the Fetch API is available and supports streaming responses.
	 * @function Engine.isFetchAvailable
	 */
	isFetchAvailable(): boolean;

	/**
	 * Check whether the engine is running in a Secure Context.
	 *
	 * @returns {boolean} If the engine is running in a Secure Context.
	 * @function Engine.isSecureContext
	 */
	isSecureContext(): boolean;

	/**
	 * Check whether the engine is cross origin isolated.
	 * This value is dependent on Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers sent by the server.
	 *
	 * @returns {boolean} If the engine is running in a Secure Context.
	 * @function Engine.isSecureContext
	 */
	isCrossOriginIsolated(): boolean;

	/**
	 * Check whether SharedBufferArray is available.
	 *
	 * Most browsers require the page to be running in a secure context, and the
	 * the server to provide specific CORS headers for SharedArrayBuffer to be available.
	 *
	 * @returns {boolean} If SharedArrayBuffer is available.
	 * @function Engine.isSharedArrayBufferAvailable
	 */
	isSharedArrayBufferAvailable(): boolean;

	/**
	 * Check whether the AudioContext supports AudioWorkletNodes.
	 *
	 * @returns {boolean} If AudioWorkletNode is available.
	 * @function Engine.isAudioWorkletAvailable
	 */
	isAudioWorkletAvailable(): boolean;

	/**
	 * Return an array of missing required features (as string).
	 *
	 * @returns {Array<string>} A list of human-readable missing features.
	 * @function Engine.getMissingFeatures
	 * @param {{threads: (boolean|undefined)}} supportedFeatures
	 */
	getMissingFeatures(supportedFeatures?: EngineSupportedFeatures): string[];
}

declare const Engine: EngineConstructor;

interface Window {
	Engine: EngineConstructor;
}
