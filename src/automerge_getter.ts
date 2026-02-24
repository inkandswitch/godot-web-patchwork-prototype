import { serializeGodotSceneAsUint8Array } from "./godot_serializer";
// import zip library
import JSZip from "jszip";
// const SERVER_URL = "104.131.179.247:8080"
const SERVER_URL = "24.199.97.236:3000";

const DOC_FETCH_URL = `http://${SERVER_URL}/doc/[docId]`;

export async function getDoc(docId: string): Promise<any> {
  try {
    var doc = await fetch(DOC_FETCH_URL.replace("[docId]", docId));
    var docJson = await doc.json();
  } catch (e) {
    console.error("Error getting doc: ", docId);
    console.error(e);
    return null;
  }
  return docJson;
}

// returns a map of file name to content
export async function getBranchFiles(projectId: string, branchId?: string): Promise<Map<string, Uint8Array>> {
  var map = new Map<string, Uint8Array>();
  // get the branch metadata doc from the server
  // looks like this:
  //{"branches":{"3oXy4H2P4UPQ4BkB8eCK1Rbe3Rke":{"fork_info":null,"id":"3oXy4H2P4UPQ4BkB8eCK1Rbe3Rke","merge_info":null,"name":"main"}},"main_doc_id":"3oXy4H2P4UPQ4BkB8eCK1Rbe3Rke"}
  // we need to get the main_doc_id
  // then we need to get the main doc id from the server
  // looks like this:
  /**
     ```
     {
        "files": {
            "res://LICENSE": {
                "content": "MIT License\n\nCopyright (c) 2024 Endless OS Foundation\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"
            },
            "res://README.md": {
                "content": "# Moddable Platformer\n\nThis mini moddable game project by [Endless OS\nFoundation](https://endlessos.org) is intended to help ease the learning curve\ninto Godot.\n\nThis sample project allows learners to engage with game creation concepts,\napplying various modifications to the game itself, all without reading or\nwriting any code.\n\nThe `doc/MODS.md` file details the mods that have been made available.\n\n## Contributing\n\nWe encourage contributions that continue to address the intended audience and\ndesign of of this project. You can communicate with us through the [Endless\nStudios](https://endlessstudios.com/studio/games/Moddable-Platformer) community\nplatform and submit pull requests via\n[GitHub](https://github.com/endlessm/moddable-platformer).\n\n### Development environment\n\nPlease use [pre-commit](https://pre-commit.com) to check for correct formatting\nand other issues before creating commits. To do this automatically, you can add\nit as a git hook:\n\n```\n# If you don't have pre-commit already:\npip install pre-commit\n\n# Setup git hook:\npre-commit install\n```\n\nNow `pre-commit` will run automatically on `git commit`!\n"
            },
            "res://assets/background-layer-1.png": {
                "url": "automerge:3V6nGzHfKmcY8J6z9ZEtVmojCJaH"
            },
            "res://components/coin/coin.tscn": {
                "structured_content": {
                  ...
                }
            },
            "res://components/player/player.tscn": {
                "structured_content": {
                  ...
                }
            },
        }
    }
    ```
    // for files with a `content` field, just decode the string to a uint8array and copy the content to the map
    // for files with a `url` field, get the file from the server, then copy the "content" field to the map (content field is already a uint8array)
    // for files with a `structured_content` field, we need to call serializeGodotSceneAsUint8Array
  
    // return the map
     */

  // get the branch metadata doc

  var branchMetadata = await getDoc(projectId);

  branchId = branchId ?? branchMetadata.main_doc_id;

  var mainDoc = await getDoc(branchId!);

  for (const entry of Object.entries(mainDoc.files)) {
    const filename: string = entry[0];
    const fileData: any = entry[1];

    if (fileData.content) {
      map.set(filename, new TextEncoder().encode(fileData.content));
    } else if (fileData.url) {
      var subDocId: string = fileData.url.split(":")[1];
      var subDoc = await getDoc(subDocId);
      // content is an Array, we need to convert it to a uint8array
      var content: Uint8Array = new Uint8Array(subDoc.content);
      map.set(filename, content);
    } else if (fileData.structured_content) {
      var content: Uint8Array = serializeGodotSceneAsUint8Array(fileData.structured_content);
      map.set(filename, content);
    }
  }
  return map;
}

export async function getBranchFilesAsZip(projectId: string, branchId?: string): Promise<ArrayBuffer> {
  var zip = new JSZip();
  var map = await getBranchFiles(projectId, branchId);
  for (const [filename, content] of map.entries()) {
    zip.file(filename.replace("res://", ""), content);
  }
  return (await zip.generateAsync({ type: "blob" })).arrayBuffer();
}

// function test() {
//   to2i9YGkdhXy3Li4K7FoUSQ9Yzv
//   getBranchFiles("to2i9YGkdhXy3Li4K7FoUSQ9Yzv").then((map) => {
//     console.log(map);
//   });
// }

// test();
