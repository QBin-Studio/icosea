import { bold } from "@std/fmt/colors";
import { unitPurify, warn } from "../utility/mod.ts";
import type { TomlIconDataType } from "../utility/toml_parser.ts";
import regexes from "../constant/regexes.ts";
import { exists } from "@std/fs";
import { dirname } from "@std/path";
import { Parser } from "htmlparser2";

export default async function (data: TomlIconDataType): Promise<{
  generated: number;
}> {
  /* Generating parts */
  const o = data.options;
  let object_key_value = ``; // eg. (icon:()=>string)
  let keysTypeG = ``; //eg. (type key = "name1" | "name2")

  const keysName = `${o.name.toUpperCase()}_KEYS`;

  let amountOfIcon = 0;

  const parser = new Parser({
    onopentag: function (name, attributes) {
      console.log(name);
      console.log(attributes);
    },
  });

  Object.entries(data.icons).forEach(([key, value], index, arr) => {
    parser.write(value);
    const className = `${o.global_className || "icosea_icon"} $\{cls}`; // adding className

    if (regexes.class.test(value)) {
      value = value.replace(regexes.class, `class="${className}"`);
    } else {
      value = value.replace("<svg", `<svg class="${className}"`);
    }

    if (!regexes.width.test(value)) {
      warn(`[icon]: ${bold(key)} doesn't has any Width attribute`);
    }

    if (!regexes.height.test(value)) {
      warn(`[icon]: ${bold(key)} doesn't has any height attribute`);
    }

    const readyText = value
      .replace(regexes.width, 'width="${w}"')
      .replace(regexes.height, 'height="${h}"')
      .replace(regexes.stroke, 'stroke="${c}"')
      .replace('fill="none"', "")
      .replace(regexes.fill, 'fill="${c}"');

    const functionText = `(w, h, c,cls) => \`${readyText}\``;

    keysTypeG += `"${key}" ${arr.length - 1 === index ? "" : " | "}`;

    object_key_value += `"${key}": ${functionText},\n`;
    amountOfIcon++;
  });

  const dataToWriteInFile = `
export type ${keysName} = ${keysTypeG};

const ${o.name}_obj : Record<${keysName},(w:string | number, h:string | number,c:string, cls:string) => string> = { 
${object_key_value}
} 

type ${o.func_name}Options = {
  /**width of icon. it will be place to width="<your value>" */
  w?: string | number;
  /**height of icon. it will be place to height="<your value>" */
  h?: string | number;
  /**Specified className. You can target this specific icon. or any tailwind class */
  cls?: string;
  /**Color of icon. */
  c?: string;
};
export default function ${o.func_name}(name:${keysName}, obj?: ${o.func_name}Options): string {
  const {w,h,c,cls} =  { c: "${o.color}",h:${unitPurify(o.height)},w:${unitPurify(o.width)},cls:"", ...(obj??{})};
  return  ${o.name}_obj[name](w, h, c, cls);
}
`;

  if (!(await exists(data.options.output))) {
    // Creating output Directory incase directory isnot exist;
    await Deno.mkdir(dirname(o.output), { recursive: true });
  }

  if (await exists(o.output)) {
    await Deno.remove(o.output);
  }

  const output_file = await Deno.open(o.output, {
    read: true,
    write: true,
    append: true,
    create: true,
  });

  const output_writer = output_file.writable.getWriter();
  output_writer.write(new TextEncoder().encode(dataToWriteInFile));
  return {
    generated: amountOfIcon,
  };
}
