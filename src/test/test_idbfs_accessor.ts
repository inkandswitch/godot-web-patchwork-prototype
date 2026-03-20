import "fake-indexeddb/auto";
import { openDB } from "idb";

import { createIDBFSAccessor, IDBFSAccessorError } from "../idbfs_accessor";

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
    if (actual !== expected) {
        throw new Error(`${message} (actual=${String(actual)}, expected=${String(expected)})`);
    }
}

function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
    const actualJSON = JSON.stringify(actual);
    const expectedJSON = JSON.stringify(expected);
    if (actualJSON !== expectedJSON) {
        throw new Error(`${message} (actual=${actualJSON}, expected=${expectedJSON})`);
    }
}

async function assertRejects(callback: () => Promise<unknown>, predicate: (error: unknown) => boolean, message: string): Promise<void> {
    try {
        await callback();
    } catch (error) {
        if (predicate(error)) {
            return;
        }
        throw new Error(`${message}: callback rejected with unexpected error ${String(error)}`);
    }
    throw new Error(`${message}: callback resolved unexpectedly`);
}

async function run(): Promise<void> {
    const dbName = `idbfs-accessor-test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let openCalls = 0;

    const originalOpen = indexedDB.open.bind(indexedDB);
    indexedDB.open = (...args: Parameters<IDBFactory["open"]>) => {
        openCalls += 1;
        return originalOpen(...args);
    };

    const seedDb = await openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("FILE_DATA")) {
                db.createObjectStore("FILE_DATA");
            }
        },
    });
    seedDb.close();
    openCalls = 0;

    const accessor = createIDBFSAccessor(dbName);

    assertEqual(openCalls, 0, "Accessor creation should not eagerly open IndexedDB");

    const initialPaths = await accessor.listPaths();
    assertDeepEqual(initialPaths, [], "Empty DB should return no paths");
    assertEqual(openCalls, 1, "First DB operation should open IndexedDB exactly once");

    const bytes = new Uint8Array([1, 2, 3, 4]);
    await accessor.put("/home/web_user/example.bin", {
        timestamp: "2026-03-20T19:39:46.208Z",
        mode: 33188,
        contents: bytes.buffer,
    });

    const roundtrip = await accessor.get("/home/web_user/example.bin");
    assert(roundtrip !== null, "Written record should be readable");
    assert(roundtrip.timestamp instanceof Date, "Timestamp should normalize to Date");
    assertEqual(roundtrip.mode, 33188, "Mode should be preserved");
    assertDeepEqual(Array.from(new Uint8Array(roundtrip.contents ?? new ArrayBuffer(0))), Array.from(bytes), "Binary contents should roundtrip");

    assertEqual(await accessor.exists("/home/web_user/example.bin"), true, "exists() should return true for known path");
    assertEqual(await accessor.exists("/home/web_user/missing.bin"), false, "exists() should return false for missing path");

    await accessor.putMany({
        "/home/web_user/b.txt": {
            timestamp: Date.now(),
            mode: 33188,
            contents: new Uint8Array([10]).buffer,
        },
        "/home/web_user/a.txt": {
            timestamp: new Date(),
            mode: 33188,
            contents: new Uint8Array([20]).buffer,
        },
    });

    const sortedPaths = await accessor.listPaths();
    assertDeepEqual(
        sortedPaths,
        [
            "/home/web_user/a.txt",
            "/home/web_user/b.txt",
            "/home/web_user/example.bin",
        ],
        "listPaths should return sorted path keys",
    );

    const visited: string[] = [];
    await accessor.forEachEntry(async (path, entry) => {
        visited.push(path);
        assert(entry.timestamp instanceof Date, "Iterator should receive normalized Date timestamps");
    });
    assertDeepEqual(visited.sort((a, b) => a.localeCompare(b)), sortedPaths, "forEachEntry should visit all paths");

    await assertRejects(
        async () =>
            accessor.putMany({
                "/home/web_user/ok-then-rollback.bin": {
                    timestamp: new Date(),
                    mode: 33188,
                    contents: new Uint8Array([9]).buffer,
                },
                "/home/web_user/bad.bin": {
                    timestamp: new Date(),
                    mode: Number.NaN,
                    contents: new Uint8Array([8]).buffer,
                },
            }),
        (error: unknown) => error instanceof IDBFSAccessorError,
        "putMany should reject invalid records"
    );
    assertEqual(
        await accessor.exists("/home/web_user/ok-then-rollback.bin"),
        false,
        "Failed putMany should rollback transaction"
    );

    const beforeTouch = await accessor.get("/home/web_user/example.bin");
    assert(beforeTouch !== null, "Record should exist before touch");
    await accessor.touch("/home/web_user/example.bin", "2026-03-21T00:00:00.000Z");
    const afterTouch = await accessor.get("/home/web_user/example.bin");
    assert(afterTouch !== null, "Record should exist after touch");
    assertEqual(afterTouch.timestamp.toISOString(), "2026-03-21T00:00:00.000Z", "touch() should update timestamp");

    await accessor.delete("/home/web_user/example.bin");
    assertEqual(await accessor.get("/home/web_user/example.bin"), null, "delete() should remove path");

    await accessor.deleteMany(["/home/web_user/a.txt", "/home/web_user/b.txt"]);
    assertDeepEqual(await accessor.listPaths(), [], "deleteMany() should remove all provided paths");

    const rawDb = await openDB(dbName, 21);
    const tx = rawDb.transaction("FILE_DATA", "readwrite");
    await tx.store.put({ timestamp: "not-a-date", mode: 33188 }, "/home/web_user/invalid.ts");
    await tx.done;
    rawDb.close();

    await assertRejects(
        async () => accessor.get("/home/web_user/invalid.ts"),
        (error: unknown) => error instanceof IDBFSAccessorError,
        "Invalid persisted timestamps should raise accessor errors"
    );

    await accessor.clear();
    await accessor.close();

    console.log("test_idbfs_accessor: all checks passed");
}

run().catch((error) => {
    console.error(error);
    throw error;
});
