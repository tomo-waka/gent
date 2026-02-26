import {
  compile,
  type Options,
  type JSONSchema,
} from "json-schema-to-typescript";
import * as fsPromises from "node:fs/promises";
import * as nodePath from "node:path";
import { fileURLToPath } from "url";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

const schemaDir = nodePath.resolve(__dirname, "../schema");
const outputDir = nodePath.resolve(__dirname, "../generated/schema");

const compileOptions: Partial<Options> = {
  bannerComment:
    "/* eslint-disable */\n// Generated from JSON Schema. Do not edit manually.",
  style: {
    bracketSpacing: true,
    printWidth: 100,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "all",
    useTabs: false,
  },
  unknownAny: false,
  unreachableDefinitions: false,
};

async function compileSchemaFile(
  schemaPath: string,
  outputPath: string,
  typeName: string,
): Promise<void> {
  try {
    const schemaContent = await fsPromises.readFile(schemaPath, "utf8");
    const schema = JSON.parse(schemaContent) as JSONSchema;

    const compiled = await compile(schema, typeName, {
      ...compileOptions,
      cwd: nodePath.dirname(schemaPath),
    });

    await fsPromises.mkdir(nodePath.dirname(outputPath), { recursive: true });
    await fsPromises.writeFile(outputPath, compiled);

    console.log(`✓ Generated ${nodePath.relative(process.cwd(), outputPath)}`);
  } catch (error) {
    console.error(`Error compiling ${schemaPath}:`, error);
    throw error;
  }
}

async function main() {
  const tasks = [
    {
      schemaPath: nodePath.join(schemaDir, "generation-profile.schema.json"),
      outputPath: nodePath.join(outputDir, "generationProfileJson.ts"),
      typeName: "GenerationProfileJson",
    },
    {
      schemaPath: nodePath.join(schemaDir, "common.schema.json"),
      outputPath: nodePath.join(outputDir, "common.ts"),
      typeName: "Common",
    },
    {
      schemaPath: nodePath.join(schemaDir, "output/file-output.schema.json"),
      outputPath: nodePath.join(outputDir, "output/fileOutput.ts"),
      typeName: "FileOutputOptions",
    },
    {
      schemaPath: nodePath.join(schemaDir, "output/udp-output.schema.json"),
      outputPath: nodePath.join(outputDir, "output/udpOutput.ts"),
      typeName: "UdpOutputOptions",
    },
    {
      schemaPath: nodePath.join(schemaDir, "output/tcp-output.schema.json"),
      outputPath: nodePath.join(outputDir, "output/tcpOutput.ts"),
      typeName: "TcpOutputOptions",
    },
    {
      schemaPath: nodePath.join(schemaDir, "output/tls-output.schema.json"),
      outputPath: nodePath.join(outputDir, "output/tlsOutput.ts"),
      typeName: "TlsOutputOptions",
    },
  ];

  for (const task of tasks) {
    await compileSchemaFile(task.schemaPath, task.outputPath, task.typeName);
  }

  console.log("Schema type generation completed.");
}

main().catch((error: unknown) => {
  console.error("Failed to generate schema types:", error);
  process.exit(1);
});
