#!/usr/bin/env node

import gen_typescript from "../generators/gen_typescript.ts";
import validateandparsetoml from "../utility/toml_parser.ts";
import { parseArgs } from "../utility/os_args_to_config.ts";
import { gracefulExit } from "../utility/mod.ts";
import chalk from "chalk";

const starting = Date.now();

const args = parseArgs(process.argv);
const filelocation = args.f || args.file;

if (!filelocation) {
	gracefulExit(
		"[error]: please provide icon.toml file as  parameter -f[ile]=location",
	);
}

const loadeddata = await validateandparsetoml(filelocation);
const options = loadeddata.options;

const result = await gen_typescript(loadeddata);

const timeTook = Date.now() - starting;

console.log(
	chalk.green(
		`Total valid icon - ${chalk.bold.greenBright(result.generated)} within ${chalk.yellow(`${timeTook / 1000}s`)}`,
	),
);
console.log(
	`${chalk.blue("Generated to -")} ${chalk.blue.bold.underline(options.output)}`,
);
