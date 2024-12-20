import type { FileHandle } from "node:fs/promises";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";

export interface DebugFileWriter {
  setBaseDirectory(directoryPath: string): void;

  writeFile(fileName: string, content: string): void;
}

class DebugFileWriterImpl implements DebugFileWriter {
  private baseDirectoryPath: string | undefined;

  public setBaseDirectory(directoryPath: string): void {
    this.baseDirectoryPath = directoryPath;
  }

  public writeFile(fileName: string, content: string): void {
    const baseDirectoryPath = this.baseDirectoryPath;
    if (baseDirectoryPath === undefined) {
      return;
    }
    const outFilePath = nodePath.resolve(baseDirectoryPath, fileName);

    this.__writeFile(outFilePath, content).catch((error) =>
      console.error(error),
    );
  }

  private async __writeFile(filePath: string, content: string): Promise<void> {
    let outFile: FileHandle | undefined;
    try {
      outFile = await fsPromises.open(filePath, "w");
      await outFile.writeFile(content);
    } catch (error) {
      throw new Error("Error occurred during writing output.");
    } finally {
      if (outFile !== undefined) {
        await outFile.close();
      }
    }
  }
}

export const debugFileWriter: DebugFileWriter = new DebugFileWriterImpl();
