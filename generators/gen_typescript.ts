import { unitPurify } from "../utility/mod.ts";
import type { TomlIconDataType } from "../utility/toml_parser.ts";
import { exists } from "@std/fs";
import { dirname } from "@std/path";
import { parseFragment } from "parse5";
import type { DefaultTreeAdapterTypes } from "parse5";
import { serialize } from "parse5";
// import { Parser } from "htmlparser2";

function processSVG(
  svg: string,
) {
  const parsedSvg = parseFragment(svg);

  function modifySvg(
    node: DefaultTreeAdapterTypes.ChildNode,
  ): DefaultTreeAdapterTypes.ChildNode {
    if (node.nodeName === "svg") {
      node.attrs = node.attrs.map((attr) => {
        if (attr.name === "width") {
          return {
            name: "width",
            value: "${w}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        if (attr.name === "height") {
          return {
            name: "height",
            value: "${h}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        if (attr.name === "class") {
          return {
            name: "class",
            value: "${cls}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        if (attr.name === "fill") {
          return {
            name: "fill",
            value: "${c}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        return attr;
      });
    } else if ("attrs" in node) {
      node.attrs = node.attrs.map((attr) => {
        if (attr.name === "fill") {
          return {
            name: "fill",
            value: "${c}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        if (attr.name === "stroke") {
          return {
            name: "stroke",
            value: "${c}",
          } as DefaultTreeAdapterTypes.Element["attrs"][number];
        }

        return attr;
      });
    }

    if ("childNodes" in node) {
      node.childNodes = node.childNodes.map(modifySvg);
    }

    return node;
  }

  if (parsedSvg.childNodes.length) {
    parsedSvg.childNodes = parsedSvg.childNodes.map(modifySvg);
  }

  const serialized = serialize(parsedSvg);

  return serialized;
}

export default async function GenTypescript(data: TomlIconDataType): Promise<{
  generated: number;
}> {
  /* Generating parts */
  const o = data.options;

  if (!(await exists(o.output))) {
    // Creating output Directory incase directory is not exist.
    // its only create directory not output file;
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

  let object_key_value = ``; // eg. (icon:()=>string)
  let keysTypeG = ``; //eg. (type key = "name1" | "name2")

  const keysName = `${o.name.toUpperCase()}_KEYS`;

  let amountOfIcon = 0;

  Object.entries(data.icons).forEach(([key, value], index, arr) => {
    keysTypeG += `"${key}" ${arr.length - 1 === index ? "" : " | "}`;

    let processedSvg = ``;
    if (value.startsWith("<svg")) {
      processedSvg = processSVG(value);
    }

    object_key_value += `"${key}": (w, h, c,cls) => \`${processedSvg}\`,\n`;

    amountOfIcon++;
  });

  // The top part of files;
  await output_writer.write(
    new TextEncoder().encode(`export type ${keysName} = ${keysTypeG};

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
  const {w,h,c,cls} =  { c: "${o.color}",h:${unitPurify(o.height)},w:${
      unitPurify(o.width)
    },cls:"", ...(obj??{})};
  return  ${o.name}_obj[name](w, h, c, cls);
}
`),
  );

  output_writer.close();
  return {
    generated: amountOfIcon,
  };
}
