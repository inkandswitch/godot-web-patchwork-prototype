/**
 * An object used to configure the Engine instance based on godot export options, and to override those in custom HTML
 * templates if needed.
 *
 * @header Engine configuration
 * @summary The Engine configuration object. This is just a typedef, create it like a regular object, e.g.:
 *
 * ``const MyConfig = { executable: 'godot', unloadAfterInit: false }``
 *
 * @typedef {Object} EngineConfig
 */
interface EngineConfig {
	/**
	 * Whether to unload the engine automatically after the instance is initialized.
	 *
	 * @memberof EngineConfig
	 * @default
	 * @type {boolean}
	 */
	unloadAfterInit?: boolean;

	/**
	 * The HTML DOM Canvas object to use.
	 *
	 * By default, the first canvas element in the document will be used is none is specified.
	 *
	 * @memberof EngineConfig
	 * @default
	 * @type {?HTMLCanvasElement}
	 */
	canvas?: HTMLCanvasElement | null;

	/**
	 * The name of the WASM file without the extension. (Set by Godot Editor export process).
	 *
	 * @memberof EngineConfig
	 * @default
	 * @type {string}
	 */
	executable?: string;

	/**
	 * An alternative name for the game pck to load. The executable name is used otherwise.
	 *
	 * @memberof EngineConfig
	 * @default
	 * @type {?string}
	 */
	mainPack?: string | null;

	/**
	 * Specify a language code to select the proper localization for the game.
	 *
	 * The browser locale will be used if none is specified. See complete list of
	 * :ref:`supported locales <doc_locales>`.
	 *
	 * @memberof EngineConfig
	 * @type {?string}
	 * @default
	 */
	locale?: string | null;

	/**
	 * The canvas resize policy determines how the canvas should be resized by Godot.
	 *
	 * ``0`` means Godot won't do any resizing. This is useful if you want to control the canvas size from
	 * javascript code in your template.
	 *
	 * ``1`` means Godot will resize the canvas on start, and when changing window size via engine functions.
	 *
	 * ``2`` means Godot will adapt the canvas size to match the whole browser window.
	 *
	 * @memberof EngineConfig
	 * @type {number}
	 * @default
	 */
	canvasResizePolicy?: number;

	/**
	 * The arguments to be passed as command line arguments on startup.
	 *
	 * See :ref:`command line tutorial <doc_command_line_tutorial>`.
	 *
	 * **Note**: :js:meth:`startGame <Engine.prototype.startGame>` will always add the ``--main-pack`` argument.
	 *
	 * @memberof EngineConfig
	 * @type {Array<string>}
	 * @default
	 */
	args?: string[];

	/**
	 * When enabled, the game canvas will automatically grab the focus when the engine starts.
	 *
	 * @memberof EngineConfig
	 * @type {boolean}
	 * @default
	 */
	focusCanvas?: boolean;

	/**
	 * When enabled, this will turn on experimental virtual keyboard support on mobile.
	 *
	 * @memberof EngineConfig
	 * @type {boolean}
	 * @default
	 */
	experimentalVK?: boolean;

	/**
	 * The progressive web app service worker to install.
	 * @memberof EngineConfig
	 * @default
	 * @type {string}
	 */
	serviceWorker?: string;

	/**
	 * @ignore
	 * @type {Array.<string>}
	 */
	persistentPaths?: string[];

	/**
	 * @ignore
	 * @type {boolean}
	 */
	persistentDrops?: boolean;

	/**
	 * @ignore
	 * @type {Array.<string>}
	 */
	gdextensionLibs?: string[];

	/**
	 * @ignore
	 * @type {Array.<string>}
	 */
	fileSizes?: Record<string, number>;

	/**
	 * @ignore
	 * @type {number}
	 */
	emscriptenPoolSize?: number;

	/**
	 * @ignore
	 * @type {number}
	 */
	godotPoolSize?: number;

	/**
	 * A callback function for handling Godot's ``OS.execute`` calls.
	 *
	 * This is for example used in the Web Editor template to switch between project manager and editor, and for running the game.
	 *
	 * @callback EngineConfig.onExecute
	 * @param {string} path The path that Godot's wants executed.
	 * @param {Array.<string>} args The arguments of the "command" to execute.
	 */
	onExecute?: ((path: string, args: string[]) => void) | null;

	/**
	 * A callback function for being notified when the Godot instance quits.
	 *
	 * **Note**: This function will not be called if the engine crashes or become unresponsive.
	 *
	 * @callback EngineConfig.onExit
	 * @param {number} status_code The status code returned by Godot on exit.
	 */
	onExit?: ((status_code: number) => void) | null;

	/**
	 * A callback function for displaying download progress.
	 *
	 * The function is called once per frame while downloading files, so the usage of ``requestAnimationFrame()``
	 * is not necessary.
	 *
	 * If the callback function receives a total amount of bytes as 0, this means that it is impossible to calculate.
	 * Possible reasons include:
	 *
	 * -  Files are delivered with server-side chunked compression
	 * -  Files are delivered with server-side compression on Chromium
	 * -  Not all file downloads have started yet (usually on servers without multi-threading)
	 *
	 * @callback EngineConfig.onProgress
	 * @param {number} current The current amount of downloaded bytes so far.
	 * @param {number} total The total amount of bytes to be downloaded.
	 */
	onProgress?: ((current: number, total: number) => void) | null;

	/**
	 * A callback function for handling the standard output stream. This method should usually only be used in debug pages.
	 *
	 * By default, ``console.log()`` is used.
	 *
	 * @callback EngineConfig.onPrint
	 * @param {...*} [var_args] A variadic number of arguments to be printed.
	 */
	onPrint?: ((...var_args: unknown[]) => void) | null;

	/**
	 * A callback function for handling the standard error stream. This method should usually only be used in debug pages.
	 *
	 * By default, ``console.error()`` is used.
	 *
	 * @callback EngineConfig.onPrintError
	 * @param {...*} [var_args] A variadic number of arguments to be printed as errors.
	 */
	onPrintError?: ((...var_args: unknown[]) => void) | null;
}

/**
 * @struct
 * @constructor
 * @ignore
 */
interface InternalConfig extends EngineConfig {
	/**
	 * @ignore
	 * @param {EngineConfig} opts
	 */
	update(opts?: EngineConfig): void;

	/**
	 * @ignore
	 * @param {string} loadPath
	 * @param {Response} response
	 */
	getModuleConfig(loadPath: string, response: Response): Record<string, unknown>;

	/**
	 * @ignore
	 * @param {function()} cleanup
	 */
	getGodotConfig(cleanup: () => void): Record<string, unknown>;
}

declare const EngineConfig: EngineConfig;
declare const InternalConfig: {
	new(initConfig?: EngineConfig): InternalConfig;
	(initConfig?: EngineConfig): InternalConfig;
};
