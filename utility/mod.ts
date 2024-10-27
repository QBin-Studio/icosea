import * as color from "@std/fmt/colors";

export function warn(arg: string) {
  console.warn(color.brightYellow(arg));
}

export function gracefulExit(text?: string) {
  if (text) {
    console.error(color.brightRed(text));
    Deno.exit(1);
  }
}
