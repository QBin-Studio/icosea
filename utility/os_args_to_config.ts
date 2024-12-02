import { parseArgs } from "@std/cli";

export default function (_args: string[]) {
  const args = {
    files: [] as string[],
  };

  const parsed = parseArgs(_args);

  // Files -f[file] parsing and validation
  const files: string = parsed["f"] || parsed["file"] || "";
  if (!files) throw new Error("[Error]: Please provide icon.toml file as  parameter -f[ile]=location");
  args.files = files.split(",");

  return args;
}
