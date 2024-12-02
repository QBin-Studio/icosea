// import matIcon from "./icons/mat_icon/index.ts";

import { parseArgs } from "@std/cli";
import os_args_to_config from "./utility/os_args_to_config.ts";

// console.log(matIcon("3g", { w: 100, h: 100, c: "red", cls: "ac-icon" }));

const parsedArgs = os_args_to_config(Deno.args);

console.log(parsedArgs.files);
