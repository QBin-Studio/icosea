// #!/usr/bin/env -S bun run
import { exists } from "jsr:@std/fs";
import * as toml from "jsr:@std/toml";
import { dirname } from "jsr:@std/path";

console.time("Generation Took");
const fileLocation = Deno.env.get("ICOSEA_FILE");
if (!fileLocation) throw new Error("Please provide icon.toml file as env variable eg. ICOSEA_FILE=<filePath>");

type TLoadedData = {
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

const fileData = await Deno.readTextFile(fileLocation);
const loadedData = toml.parse(fileData) as TLoadedData;

/* Generating parts */
let objKeysG = ``;
let keysTypeG = ``;
const keysName = `${loadedData.options.name.toUpperCase()}_KEYS`;
let amountOfIcon = 0;
Object.entries(loadedData.icons).forEach(([key, value], index, arr) => {
  const readyText = value
    .replace("<svg ", `<svg class="${loadedData.options.global_className || "icosea_icon"} $\{className}" `) // adding className
    .replace(/width="[^"]*"/gm, 'width="${width}"')
    .replace(/height="[^"]*"/gm, 'height="${height}"')
    .replace(/stroke="[^"]*"/gm, 'stroke="${color}"')
    .replace('fill="none"', "")
    .replace(/fill="[^"]*"/gm, 'fill="${color}"');
  const functionText = `(width, height, color,className) => \`${readyText}\``;
  keysTypeG += `"${key}" ${arr.length - 1 === index ? "" : " | "}`;

  objKeysG += `"${key}": ${functionText},\n`;
  amountOfIcon++;
});

// File Data to Append
const finalData = `
type ${keysName} = ${keysTypeG};

const ${loadedData.options.name}_obj : Record<MAT_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
${objKeysG}
} 

type ${loadedData.options.func_name}Options = {
  w?: string | number;
  cls?: string;
  h?: string | number;
  c?: string;
};
export default function ${loadedData.options.func_name}(name:${keysName}, obj?: ${loadedData.options.func_name}Options): string {
  let {w,h,c,cls} =  { c: "${loadedData.options.color}", h: ${loadedData.options.height}, w: ${loadedData.options.width}, cls: "", ...(obj??{}) };
  return mat_icon_obj[name](w, h, c, cls);
}

`;

if (!(await exists(loadedData.options.output))) {
  await Deno.mkdir(dirname(loadedData.options.output), { recursive: true });
}

await Deno.writeTextFile(loadedData.options.output, finalData);

console.log(`${amountOfIcon} Generated to ${loadedData.options.output}`);
console.timeEnd("Generation Took");
