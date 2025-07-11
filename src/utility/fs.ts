import * as fs from "node:fs/promises";

export async function exist(
	path: string,
	mode = fs.constants.W_OK | fs.constants.R_OK,
): Promise<boolean> {
	return fs
		.access(path, mode)
		.then(() => true)
		.catch(() => false);
}
