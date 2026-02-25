import * as fsPromises from "node:fs/promises";

fsPromises
  .copyFile(process.execPath, "out/gent.exe")
  .catch((error: unknown) => {
    console.error(error);
  });
