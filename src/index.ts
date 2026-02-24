console.log("[patchwork] module loaded");

import { getBranchFiles } from "./automerge_getter";

declare global {
  interface Window {
    Engine: any;
  }
}

const loading = document.getElementById("loading")!;
const statusText = document.getElementById("status-text")!;
const errorText = document.getElementById("error-text")!;
const progressBarInner = document.getElementById("progress-bar-inner")!;

function setStatus(msg: string) {
  statusText.textContent = msg;
}

const progressBar = document.getElementById("progress-bar")!;

function setProgress(fraction: number) {
  progressBar.classList.remove("indeterminate");
  progressBarInner.style.width = `${Math.round(fraction * 100)}%`;
}

function setIndeterminate() {
  progressBar.classList.add("indeterminate");
}

async function showError(msg: string) {
  statusText.style.display = "none";
  document.getElementById("progress-bar")!.style.display = "none";
  errorText.style.display = "block";
  errorText.textContent = msg;

  let serverReachable = false;
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch("/api/", { signal: controller.signal });
    serverReachable = res.ok;
  } catch {}

  if (serverReachable) {
    errorText.innerHTML = `
      ${msg}
      <ul>
        <li>The project might not be synced yet</li>
        <li>The project id might be incorrect</li>
        <li>The sync server is reachable</li>
      </ul>
    `;
  } else {
    errorText.innerHTML = `
      ${msg}
      <ul>
        <li>The sync server is not reachable.</li>
      </ul>
    `;
  }
}

const projectId = new URLSearchParams(window.location.search).get("project");
console.log("[patchwork] project id from URL:", projectId);
if (!projectId) {
  showError("Missing ?project= parameter in URL");
  throw new Error("Missing ?project= parameter");
}

const PROJECT_PATH = "/home/web_user/project";
const PERSISTENT_PATHS = ["/home/web_user"];
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const concurrency = clamp(navigator.hardwareConcurrency ?? 1, 12, 24);

async function launch() {
  console.time("total");

  console.time("fetch-project-files");
  setStatus("Downloading project files");
  const files = await getBranchFiles(projectId!, undefined, (current, total) => {
    setProgress(current / total);
  });
  console.timeEnd("fetch-project-files");
  console.log(`Fetched ${files.size} files`);

  // Step 1: import project via editor pass (loading overlay hides the canvas)
  setStatus("Importing project");
  setIndeterminate();
  console.time("import-pass");

  let canvas = document.getElementById("canvas") as HTMLCanvasElement;

  function replaceCanvas(): HTMLCanvasElement {
    const fresh = document.createElement("canvas");
    fresh.id = canvas.id;
    fresh.tabIndex = canvas.tabIndex;
    canvas.parentNode!.replaceChild(fresh, canvas);
    canvas = fresh;
    return fresh;
  }

  await new Promise<void>((resolve) => {
    const importEngine = new window.Engine({
      canvas,
      canvasResizePolicy: 0,
      unloadAfterInit: false,
      persistentPaths: PERSISTENT_PATHS,
      emscriptenPoolSize: concurrency,
      godotPoolSize: Math.floor(concurrency / 3),
      onExit: () => {
        replaceCanvas();
        resolve();
      },
    });

    importEngine.init("godot.editor").then(() => {
      for (const [filename, content] of files.entries()) {
        importEngine.copyToFS(`${PROJECT_PATH}/${filename.replace("res://", "")}`, content);
      }
      setStatus("Importing project");
      importEngine.start({
        args: ["--path", PROJECT_PATH, "--rendering-driver", "opengl3", "-e", "--quit"],
        persistentDrops: false,
      });
    });
  });

  console.timeEnd("import-pass");

  // Step 2: run the game on a fresh canvas
  setStatus("Starting game");
  setIndeterminate();
  console.time("game-start");

  const game = new window.Engine({
    canvas,
    canvasResizePolicy: 2,
    unloadAfterInit: false,
    persistentPaths: PERSISTENT_PATHS,
    emscriptenPoolSize: concurrency,
    godotPoolSize: Math.floor(concurrency / 3),
  });

  await game.init("godot.editor");
  canvas.style.opacity = "1";
  loading.style.display = "none";

  await game.start({
    args: ["--path", PROJECT_PATH, "--rendering-driver", "opengl3"],
    canvas,
  });

  console.timeEnd("game-start");
  console.timeEnd("total");
  canvas.focus();
}

launch().catch((err) => {
  console.error(err);
  showError(err instanceof Error ? err.message : "An error occurred");
});
