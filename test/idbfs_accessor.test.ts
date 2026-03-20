import { openDB } from "idb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createIDBFSAccessor, IDBFSAccessorError, type IDBFSStore } from "../src/idbfs_accessor";

async function seedFileDataStore(dbName: string): Promise<void> {
    const db = await openDB(dbName, 1, {
        upgrade(upgradeDb) {
            if (!upgradeDb.objectStoreNames.contains("FILE_DATA")) {
                upgradeDb.createObjectStore("FILE_DATA");
            }
        },
    });
    db.close();
}

describe("IDBFS accessor", () => {
    let dbName = "";
    let accessor: IDBFSStore;

    beforeEach(async () => {
        dbName = `idbfs-accessor-test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        await seedFileDataStore(dbName);
        accessor = createIDBFSAccessor(dbName);
    });

    afterEach(async () => {
        await accessor.close();
    });

    it("opens lazily and returns empty state initially", async () => {
        let openCalls = 0;
        const originalOpen = indexedDB.open.bind(indexedDB);
        indexedDB.open = (...args: Parameters<IDBFactory["open"]>) => {
            openCalls += 1;
            return originalOpen(...args);
        };

        try {
            expect(openCalls).toBe(0);
            await expect(accessor.listPaths()).resolves.toEqual([]);
            expect(openCalls).toBe(1);
        } finally {
            indexedDB.open = originalOpen;
        }
    });

    it("treats entries without contents as directories", async () => {
        const rawDb = await openDB(dbName);
        const tx = rawDb.transaction("FILE_DATA", "readwrite");
        await tx.store.put(
            {
                timestamp: "2026-03-20T19:39:30.291Z",
                mode: 16893,
            },
            "/home/web_user/.cache",
        );
        await tx.done;
        rawDb.close();

        const entry = await accessor.get("/home/web_user/.cache");
        expect(entry).not.toBeNull();
        expect(entry?.kind).toBe("directory");
        expect(entry?.contents).toBeUndefined();
        await expect(accessor.getKind("/home/web_user/.cache")).resolves.toBe("directory");
    });

    it("roundtrips binary data and normalizes timestamp to Date", async () => {
        const bytes = new Uint8Array([1, 2, 3, 4]);
        await accessor.put("/home/web_user/example.bin", {
            timestamp: "2026-03-20T19:39:46.208Z",
            mode: 33188,
            kind: "file",
            contents: bytes.buffer,
        });

        const roundtrip = await accessor.get("/home/web_user/example.bin");
        expect(roundtrip).not.toBeNull();
        expect(roundtrip?.kind).toBe("file");
        expect(roundtrip?.timestamp).toBeInstanceOf(Date);
        expect(roundtrip?.mode).toBe(33188);
        expect(Array.from(new Uint8Array(roundtrip?.contents ?? new ArrayBuffer(0)))).toEqual(Array.from(bytes));
    });

    it("writes directory entries without contents", async () => {
        await accessor.putDirectory("/home/web_user/.cache", {
            timestamp: Date.now(),
            mode: 16893,
        });

        const entry = await accessor.get("/home/web_user/.cache");
        expect(entry?.kind).toBe("directory");
        expect(entry?.contents).toBeUndefined();
    });

    it("writes file entries with explicit file kind", async () => {
        await accessor.putFile("/home/web_user/example.bin", {
            timestamp: "2026-03-20T19:39:46.208Z",
            mode: 33188,
            contents: new Uint8Array([1, 2, 3]).buffer,
        });

        const entry = await accessor.get("/home/web_user/example.bin");
        expect(entry?.kind).toBe("file");
        expect(Array.from(new Uint8Array(entry?.contents ?? new ArrayBuffer(0)))).toEqual([1, 2, 3]);
    });

    it("exposes isFile/isDirectory helpers", async () => {
        await accessor.putFile("/home/web_user/example.bin", {
            timestamp: "2026-03-20T19:39:46.208Z",
            mode: 33188,
            contents: new Uint8Array([1]).buffer,
        });
        await accessor.putDirectory("/home/web_user/.cache", {
            timestamp: "2026-03-20T19:39:30.291Z",
            mode: 16893,
        });

        await expect(accessor.isFile("/home/web_user/example.bin")).resolves.toBe(true);
        await expect(accessor.isDirectory("/home/web_user/example.bin")).resolves.toBe(false);
        await expect(accessor.isDirectory("/home/web_user/.cache")).resolves.toBe(true);
        await expect(accessor.isFile("/home/web_user/.cache")).resolves.toBe(false);
        await expect(accessor.isFile("/home/web_user/missing")).resolves.toBe(false);
        await expect(accessor.isDirectory("/home/web_user/missing")).resolves.toBe(false);
    });

    it("rejects directory entries that include contents", async () => {
        await expect(
            accessor.put("/home/web_user/.cache", {
                timestamp: Date.now(),
                mode: 16893,
                kind: "directory",
                contents: new Uint8Array([1]).buffer,
            }),
        ).rejects.toBeInstanceOf(IDBFSAccessorError);
    });

    it("rejects file entries missing contents", async () => {
        await expect(
            accessor.put("/home/web_user/file_without_data", {
                timestamp: Date.now(),
                mode: 33188,
                kind: "file",
            }),
        ).rejects.toBeInstanceOf(IDBFSAccessorError);
    });

    it("keeps listPaths stable and sorted", async () => {
        await accessor.putMany({
            "/home/web_user/b.txt": {
                timestamp: Date.now(),
                mode: 33188,
                kind: "file",
                contents: new Uint8Array([10]).buffer,
            },
            "/home/web_user/a.txt": {
                timestamp: new Date(),
                mode: 33188,
                kind: "file",
                contents: new Uint8Array([20]).buffer,
            },
        });

        await expect(accessor.listPaths()).resolves.toEqual([
            "/home/web_user/a.txt",
            "/home/web_user/b.txt",
        ]);
    });

    it("iterates lazily through all entries via cursor", async () => {
        await accessor.putMany({
            "/home/web_user/a.txt": {
                timestamp: "2026-03-20T19:39:46.208Z",
                mode: 33188,
                kind: "file",
                contents: new Uint8Array([1]).buffer,
            },
            "/home/web_user/.cache": {
                timestamp: "2026-03-20T19:39:46.208Z",
                mode: 16893,
                kind: "directory",
            },
        });

        const visited: string[] = [];
        await accessor.forEachEntry((path, entry) => {
            visited.push(path);
            expect(entry.timestamp).toBeInstanceOf(Date);
            expect(["file", "directory"]).toContain(entry.kind);
        });

        expect(visited.sort((a, b) => a.localeCompare(b))).toEqual([
            "/home/web_user/.cache",
            "/home/web_user/a.txt",
        ]);
    });

    it("rolls back putMany if any entry is invalid", async () => {
        await expect(
            accessor.putMany({
                "/home/web_user/ok-then-rollback.bin": {
                    timestamp: new Date(),
                    mode: 33188,
                    kind: "file",
                    contents: new Uint8Array([9]).buffer,
                },
                "/home/web_user/bad.bin": {
                    timestamp: new Date(),
                    mode: Number.NaN,
                    kind: "file",
                    contents: new Uint8Array([8]).buffer,
                },
            }),
        ).rejects.toBeInstanceOf(IDBFSAccessorError);

        await expect(accessor.exists("/home/web_user/ok-then-rollback.bin")).resolves.toBe(false);
    });

    it("supports delete and deleteMany", async () => {
        await accessor.putMany({
            "/home/web_user/example.bin": {
                timestamp: Date.now(),
                mode: 33188,
                kind: "file",
                contents: new Uint8Array([1]).buffer,
            },
            "/home/web_user/a.txt": {
                timestamp: Date.now(),
                mode: 33188,
                kind: "file",
                contents: new Uint8Array([2]).buffer,
            },
            "/home/web_user/.cache": {
                timestamp: Date.now(),
                mode: 16893,
                kind: "directory",
            },
        });

        await accessor.delete("/home/web_user/example.bin");
        await expect(accessor.get("/home/web_user/example.bin")).resolves.toBeNull();

        await accessor.deleteMany(["/home/web_user/a.txt", "/home/web_user/.cache"]);
        await expect(accessor.listPaths()).resolves.toEqual([]);
    });

    it("keeps directory kind on touch", async () => {
        await accessor.putDirectory("/home/web_user/.cache", {
            timestamp: "2026-03-20T19:39:30.291Z",
            mode: 16893,
        });

        await accessor.touch("/home/web_user/.cache", "2026-03-21T00:00:00.000Z");
        const entry = await accessor.get("/home/web_user/.cache");
        expect(entry?.kind).toBe("directory");
        expect(entry?.contents).toBeUndefined();
        expect(entry?.timestamp.toISOString()).toBe("2026-03-21T00:00:00.000Z");
    });

    it("rejects malformed persisted timestamp values", async () => {
        const rawDb = await openDB(dbName);
        const tx = rawDb.transaction("FILE_DATA", "readwrite");
        await tx.store.put({ timestamp: "not-a-date", mode: 33188, content: new Uint8Array([1]).buffer }, "/home/web_user/invalid.ts");
        await tx.done;
        rawDb.close();

        await expect(accessor.get("/home/web_user/invalid.ts")).rejects.toBeInstanceOf(IDBFSAccessorError);
    });
});
