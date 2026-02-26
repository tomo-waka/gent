import { generateCstDts } from "chevrotain";
import type { FileHandle } from "node:fs/promises";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import { fileURLToPath } from "url";
import { commandParser } from "../src/command/commandParser/commandParser.js";
import { templateParser } from "../src/template/templateParser/templateParser.js";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

const templateDtsString = generateCstDts(templateParser.getGAstProductions());
const templateDtsPath = nodePath.resolve(
  __dirname,
  "../generated/template/templateParser/templateParser_cst.d.ts",
);

const commandDtsString = generateCstDts(commandParser.getGAstProductions());
const commandDtsPath = nodePath.resolve(
  __dirname,
  "../generated/command/commandParser/commandParser_cst.d.ts",
);

type Tuple = [templateDtsString: string, templateDtsPath: string];

const tuples: Tuple[] = [
  [templateDtsString, templateDtsPath],
  [commandDtsString, commandDtsPath],
];

async function fileOut(): Promise<void> {
  for (const tuple of tuples) {
    const [dtsString, dtsPath] = tuple;
    let dtsFile: FileHandle | undefined;
    try {
      dtsFile = await fsPromises.open(dtsPath, "w");
      await dtsFile.writeFile(dtsString);
    } catch (error) {
      console.error("Error occurred during writing output.", error);
    } finally {
      if (dtsFile !== undefined) {
        await dtsFile.close();
      }
    }
  }
}

await fileOut();
