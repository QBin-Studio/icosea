#!/usr/bin/env -S deno run -A
import { parseArgs } from "@std/cli";
import { gracefulExit } from "./utility/mod.ts";
import gen_typescript from "./generators/gen_typescript.ts";
import validateAndParseToml from "./utility/toml_parser.ts";

console.time("Generation Took");
const args = parseArgs(Deno.args);
const fileLocation = args["f"] || args["file"];

if (!fileLocation) {
  gracefulExit("[Error]: Please provide icon.toml file as  parameter -f[ile]=location");
}

const loadedData = await validateAndParseToml(fileLocation);
const options = loadedData.options;

const result = await gen_typescript(loadedData);

console.log(`${result.generated} Generated to ${options.output}`);
console.timeEnd("Generation Took");
