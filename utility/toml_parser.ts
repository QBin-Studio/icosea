import { extname } from "@std/path";
import { gracefulExit } from "./mod.ts";
import { exists } from "@std/fs";
import { bold } from "@std/fmt/colors";
import { parse } from "@std/toml";

export type TomlIconDataType = {
  options: {
    height: number | `${number}px`;
    width: number | `${number}px`;
    color: string;
    func_name: string;
    name: string;
    global_className: string;
    output: string;
  };
  icons: Record<string, string>;
};

async function validateFile(path: string) {
  if (extname(path) !== ".toml") {
    throw new Error(`[Error]: Only  ${bold(".toml")} file supported as icon file`);
  }

  if (!(await exists(path))) {
    throw new Error("[Error]: Provided .toml file doesn't exist");
  }
}

export default async function validateAndParseToml(file: string) {
  await validateFile(file).catch((e) => gracefulExit(e));

  const fileData = await Deno.readTextFile(file);
  const loadedData = parse(fileData) as TomlIconDataType;

  return loadedData;
}
