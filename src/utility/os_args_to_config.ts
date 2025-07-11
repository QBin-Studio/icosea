import chalk from "chalk";

export function parseArgs(args: string[]) {
	const parsed: Record<string, string> = {};

	for (const arg of args) {
		if (arg.startsWith("--") || arg.startsWith("-")) {
			const flag = arg.replace(/^-{1,2}/gm, "");

			const splitted = flag.split(/:|=/gm);

			if (splitted.length < 2) {
				console.log(chalk.red("Invalid flag ", flag));
			} else {
				parsed[splitted[0]] = splitted[1];
			}
		}
	}
	return parsed;
}

export default function (_args: string[]) {
	const args = {
		files: [] as string[],
	};

	const parsed = parseArgs(_args);

	// Files -f[file] parsing and validation
	const files: string = parsed["f"] || parsed["file"] || "";
	if (!files)
		throw new Error(
			"[Error]: Please provide icon.toml file as  parameter -f[ile]=location",
		);
	args.files = files.split(",");

	return args;
}
