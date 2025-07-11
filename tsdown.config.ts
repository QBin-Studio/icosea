import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/bin/icosea.ts",
	platform: "node",
	dts: true,
	format: ["module"],
	outDir: "dist",
	external: ["parse5"],
	unbundle: true,
});
