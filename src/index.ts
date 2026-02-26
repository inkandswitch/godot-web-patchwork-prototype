console.log("[patchwork] module loaded");

import { getProjectMetadata, getBranchFiles } from "./automerge_getter";

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
  const prompt = document.getElementById("project-prompt")!;
  prompt.style.display = "flex";
  document.getElementById("project-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("project-input") as HTMLInputElement;
    const id = input.value.trim();
    if (id) {
      const p = new URLSearchParams(window.location.search);
      p.set("project", id);
      window.location.search = p.toString();
    }
  });
  throw new Error("No project ID");
}

const PROJECT_PATH = "/home/web_user/project";
const PERSISTENT_PATHS = ["/home/web_user"];
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const concurrency = clamp(navigator.hardwareConcurrency ?? 1, 12, 24);

function importCacheKey(projectId: string, branchId: string) {
  return `patchwork:imported:${projectId}:${branchId}`;
}

const params = new URLSearchParams(window.location.search);
const branchSelect = document.getElementById("branch-select") as HTMLSelectElement;
const topBar = document.getElementById("top-bar")!;
const emptyState = document.getElementById("empty-state")!;
const branchList = document.getElementById("branch-list")!;

function sortedBranches(metadata: any) {
  const branches = Object.values(metadata.branches) as any[];
  branches.sort((a: any, b: any) => {
    if (a.id === metadata.main_doc_id) return -1;
    if (b.id === metadata.main_doc_id) return 1;
    return a.name.localeCompare(b.name);
  });
  return branches;
}

function showBranchList(metadata: any) {
  const branches = sortedBranches(metadata);
  for (const branch of branches) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const branchParams = new URLSearchParams(params);
    branchParams.set("branch", branch.id);
    a.href = "?" + branchParams.toString();
    a.textContent = branch.name;
    if (branch.created_by) {
      const span = document.createElement("span");
      span.className = "branch-author";
      span.textContent = `by ${branch.created_by}`;
      a.appendChild(span);
    }
    li.appendChild(a);
    branchList.appendChild(li);
  }
}

function setupBranchPicker(metadata: any, activeBranchId: string) {
  const branches = sortedBranches(metadata);

  for (const branch of branches) {
    const option = document.createElement("option");
    option.value = branch.id;
    option.textContent = branch.created_by
      ? `${branch.name} (${branch.created_by})`
      : branch.name;
    if (branch.id === activeBranchId) option.selected = true;
    branchSelect.appendChild(option);
  }

  branchSelect.addEventListener("change", () => {
    params.set("branch", branchSelect.value);
    window.location.search = params.toString();
  });
}

async function launch() {
  console.time("total");

  if (params.has("branch")) {
    loading.style.display = "flex";
    setStatus("Loading project…");
    setIndeterminate();
  }

  const metadata = await getProjectMetadata(projectId!);

  const branchId = params.get("branch") || null;

  if (!branchId) {
    showBranchList(metadata);
    emptyState.style.display = "flex";
    return;
  }

  setupBranchPicker(metadata, branchId);
  topBar.style.display = "flex";

  const cacheKey = importCacheKey(projectId!, branchId);
  const alreadyImported = localStorage.getItem(cacheKey) === "1";

  let canvas = document.getElementById("canvas") as HTMLCanvasElement;

  function replaceCanvas(): HTMLCanvasElement {
    const fresh = document.createElement("canvas");
    fresh.id = canvas.id;
    fresh.tabIndex = canvas.tabIndex;
    canvas.parentNode!.replaceChild(fresh, canvas);
    canvas = fresh;
    return fresh;
  }

  if (!alreadyImported) {
    loading.style.display = "flex";
    setStatus("Downloading project files");
    setIndeterminate();

    console.time("fetch-project-files");
    const files = await getBranchFiles(branchId, (current, total) => {
      setProgress(current / total);
    });
    console.timeEnd("fetch-project-files");
    console.log(`Fetched ${files.size} files`);

    // Import pass: run editor with -e --quit to process assets
    setStatus("Importing project");
    setIndeterminate();
    console.time("import-pass");

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
        importEngine.start({
          args: ["--path", PROJECT_PATH, "--rendering-driver", "opengl3", "-e", "--quit"],
          persistentDrops: false,
        });
      });
    });

    console.timeEnd("import-pass");

    // Mark as imported and reload so IndexedDB data is cleanly available
    localStorage.setItem(cacheKey, "1");
    console.log("[patchwork] import complete, reloading…");
    window.location.reload();
    return;
  }

  // Already imported — go straight to the game
  loading.style.display = "flex";
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

  // Clear the import cache so a manual reload will re-import
  localStorage.removeItem(cacheKey);

  console.timeEnd("game-start");
  console.timeEnd("total");
  canvas.focus();
}

launch().catch((err) => {
  console.error(err);
  showError(err instanceof Error ? err.message : "An error occurred");
});
