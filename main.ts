// #!/usr/bin/env -S bun run
import { exists } from "@std/fs";
import * as toml from "@std/toml";
import { dirname } from "@std/path";

console.time("Generation Took");
const fileLocation = Deno.env.get("ICOSEA_FILE");
if (!fileLocation) {
  throw new Error(
    "Please provide icon.toml file as env variable eg. ICOSEA_FILE=<filePath>",
  );
}

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
const options = loadedData.options;

/* Generating parts */
let objKeysG = ``;
let keysTypeG = ``;
const keysName = `${loadedData.options.name.toUpperCase()}_KEYS`;
let amountOfIcon = 0;
Object.entries(loadedData.icons).forEach(([key, value], index, arr) => {
  const className = `${
    loadedData.options.global_className || "icosea_icon"
  } $\{cls}`; // adding className

  if (/class="[^"]*"/gm.test(value)) {
    value = value.replace(/class="[^"]*"/gm, `class="${className}"`);
  } else {
    value = value.replace("<svg", `<svg class="${className}"`);
  }

  const readyText = value
    .replace(/(?<=\s)width="[^"]*"/gm, 'width="${w}"')
    .replace(/height="[^"]*"/gm, 'height="${h}"')
    .replace(/stroke="[^"]*"/gm, 'stroke="${c}"')
    .replace('fill="none"', "")
    .replace(/fill="[^"]*"/gm, 'fill="${c}"');

  const functionText = `(w, h, c,cls) => \`${readyText}\``;

  keysTypeG += `"${key}" ${arr.length - 1 === index ? "" : " | "}`;

  objKeysG += `"${key}": ${functionText},\n`;
  amountOfIcon++;
});

// File Data to Append
const finalData = `
export type ${keysName} = ${keysTypeG};

const ${options.name}_obj : Record<${keysName},(w:string | number, h:string | number,c:string, cls:string) => string> = { 
${objKeysG}
} 

type ${options.func_name}Options = {
  /**width of icon. it will be place to width="<your value>" */
  w?: string | number;
  /**height of icon. it will be place to height="<your value>" */
  h?: string | number;
  /**Specified className. You can target this specific icon. or any tailwind class */
  cls?: string;
  /**Color of icon. */
  c?: string;
};
export default function ${options.func_name}(name:${keysName}, obj?: ${options.func_name}Options): string {
  const {w,h,c,cls} =  { c: "${options.color}",h:${
  unitPurify(options.height)
},w:${unitPurify(options.width)},cls:"", ...(obj??{})};
  return  ${options.name}_obj[name](w, h, c, cls);
}

`;

// function isStr(v:unknown){
// 	return typeof v ==="string"
// }
function unitPurify(u: string | number) {
  if (typeof u === "string") {
    return `"${u}"`;
  } else {
    return u;
  }
}

if (!(await exists(options.output))) {
  await Deno.mkdir(dirname(options.output), { recursive: true });
}

await Deno.writeTextFile(options.output, finalData);

console.log(`${amountOfIcon} Generated to ${options.output}`);
console.timeEnd("Generation Took");
