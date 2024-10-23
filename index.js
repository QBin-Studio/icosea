import { access, stat } from "node:fs";
import { readFile, statfs, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const fileLocation = process.env.ICOSEA_FILE;

/** @type {import(".").loadedJson} */
let loadedJson;

const fileData = await readFile(fileLocation);
loadedJson = JSON.parse(String(fileData));

/* Generating parts */
const obj = [`const ${loadedJson.options.name}_obj = {`, "}"];
let objKeysG = ``;
let keysTypeG = ``;
const keysName = `${loadedJson.options.name.toUpperCase()}_KEYS`;
let amountOfIcon = 0;
Object.entries(loadedJson.icons).forEach(([key, value], index, arr) => {
  const readyText = value
    .replace("<svg ", `<svg class="${loadedJson.options.global_className || "icosea_icon"} $\{className}" `)
    .replace(/width="[^"]*"/gm, 'width="${width}"')
    .replace(/height="[^"]*"/gm, 'height="${height}"')
    .replace(/stroke="[^"]*"/gm, 'stroke="${color}"')
    .replace('fill="none"', "")
    .replace(/fill="[^"]*"/gm, 'fill="${color}"');
  let functionText = `(width, height, color,className) => \`${readyText}\``;
  keysTypeG += `"${key}" ${arr.length - 1 === index ? "" : " | "}`;

  objKeysG += `"${key}": ${functionText},\n`;
  amountOfIcon++;
});

// File Data to Append
const finalData = `
type ${keysName} = ${keysTypeG};

const ${loadedJson.options.name}_obj : Record<MAT_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
    ${objKeysG}
} 

type ${loadedJson.options.func_name}Options = {
  w?: string | number;
  cls?: string;
  h?: string | number;
  c?: string;
};
export default function ${loadedJson.options.func_name}(name:${keysName}, obj?: ${loadedJson.options.func_name}Options): string {
  let {w,h,c,cls} = (obj = { c: "${loadedJson.options.color}", h: ${loadedJson.options.height}, w: ${loadedJson.options.width}, cls: "" });
  return mat_icon_obj[name](w, h, c, cls);
}

`;

//Checking if file exist
const ifFileExist = (path) => {
  access(path, (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
  return false;
};

if (!ifFileExist(loadedJson.options.output)) {
  await mkdir(dirname(loadedJson.options.output), { recursive: true });
}

await writeFile(loadedJson.options.output, finalData);
console.log(`${amountOfIcon} Generated to ${loadedJson.options.output}`);
