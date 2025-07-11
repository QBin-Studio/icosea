import { extname } from "node:path";
import { gracefulExit } from "./mod.ts";
import { parse } from "@iarna/toml";
import chalk from "chalk";
import { exist } from "./fs.ts";
import { readFile } from "node:fs/promises";

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
		throw new Error(
			`[Error]: Only  ${chalk.bold(".toml")} file supported as icon file`,
		);
	}

	if (!(await exist(path))) {
		throw new Error("[Error]: Provided .toml file doesn't exist");
	}
}

export default async function validateAndParseToml(file: string) {
	await validateFile(file).catch((e) => gracefulExit(e));

	const fileData = await readFile(file);
	const loadedData = parse(
		new TextDecoder().decode(fileData),
	) as TomlIconDataType;

	return loadedData;
}
