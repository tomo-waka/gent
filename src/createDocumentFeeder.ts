import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import { buildDocumentFromJsonTemplate } from "./buildDocumentFromJsonTemplate.js";
import { buildDocumentFromTextTemplate } from "./buildDocumentFromTextTemplate.js";
import type { CommandManager } from "./command/index.js";
import {
  type WeightedItem,
  WeightedItemFeeder,
} from "./common/weightedItemFeeder.js";
import type {
  DocumentContent,
  DocumentOptions,
  SharedDocumentOptions,
} from "./document/index.js";
import type { ProgramOptions, TemplateOptions } from "./types.js";
import { assertNever } from "./utils.js";

export async function createDocumentFeeder(
  templateOptionsArray: readonly TemplateOptions[],
  programOptions: ProgramOptions,
  commandManager: CommandManager,
): Promise<WeightedItemFeeder<DocumentContent>> {
  const { from, to, count } = programOptions;
  const sharedDocumentOptions: SharedDocumentOptions = {
    from: from,
    to: to,
    total: count,
  };

  const documentFeeder = new WeightedItemFeeder<DocumentContent>();

  const weightedDocuments = await Promise.all<
    WeightedItem<DocumentContent> | undefined
  >(
    templateOptionsArray.map<
      Promise<WeightedItem<DocumentContent> | undefined>
    >(async (templateOptions) =>
      createWeightedDocument(
        templateOptions,
        sharedDocumentOptions,
        commandManager,
      ),
    ),
  );
  weightedDocuments.forEach((weightedDocument) => {
    if (weightedDocument === undefined) {
      return;
    }
    documentFeeder.addWeightedItem(weightedDocument);
  });

  return documentFeeder;
}

async function createWeightedDocument(
  templateOptions: TemplateOptions,
  sharedDocumentOptions: SharedDocumentOptions,
  commandManager: CommandManager,
): Promise<WeightedItem<DocumentContent> | undefined> {
  const { mode, path, weight } = templateOptions;

  const documentOptions: DocumentOptions = {
    shared: sharedDocumentOptions,
    path: path,
  };

  try {
    await fsPromises.access(path, fs.constants.R_OK);
  } catch (error) {
    console.error(`cannot access template file. ${path}`);
    console.log(error);
    return undefined;
  }

  let templateString: string | undefined;
  try {
    templateString = await fsPromises.readFile(path, {
      encoding: "utf8",
    });
  } catch (error) {
    console.log(error);
    return undefined;
  }

  let documentContent: DocumentContent;
  if (mode === "text") {
    documentContent = buildDocumentFromTextTemplate(
      templateString,
      commandManager,
      documentOptions,
    );
  } else if (mode === "json") {
    documentContent = buildDocumentFromJsonTemplate(
      templateString,
      commandManager,
      documentOptions,
    );
  } else {
    assertNever(mode);
  }

  const weightDocument: WeightedItem<DocumentContent> = {
    content: documentContent,
    weight: weight,
  };

  return weightDocument;
}
