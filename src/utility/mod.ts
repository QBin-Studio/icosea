// import * as color from "@std/fmt/colors";

import chalk from "chalk";

export function warn(arg: string) {
	console.warn(chalk.yellowBright(arg));
}

export function gracefulExit(text?: string) {
	if (text) {
		console.error(chalk.redBright(text));
		process.exit(1);
	}
}

export function unitPurify(u: string | number) {
	if (typeof u === "string") {
		return `"${u}"`;
	} else {
		return u;
	}
}
