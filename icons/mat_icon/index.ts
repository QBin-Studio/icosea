
type MAT_ICON_KEYS = "3g"  | "12mp-sharp"  | "lock" ;

const mat_icon_obj : Record<MAT_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
    "3g": (width, height, color,className) => `<svg class="mat_icon ${className}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="${color}" d="M3 7v2h5v2H4v2h4v2H3v2h5c1.1 0 2-.9 2-2v-1.5c0-.83-.67-1.5-1.5-1.5c.83 0 1.5-.67 1.5-1.5V9c0-1.1-.9-2-2-2zm18 4v4c0 1.1-.9 2-2 2h-5c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2h-7v6h5v-2h-2.5v-2z"/></svg>`,
"12mp-sharp": (width, height, color,className) => `<svg class="mat_icon ${className}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="${color}" d="M8.808 11.192h.884V5.808H7.308v.884h1.5zm3.5 0h3.884v-.884h-3V8.885h3V5.808h-3.884v.884h3v1.424h-3zm-6 7h.884v-4.5h1.616v3h.884v-3h1.616v4.5h.884v-5.384H6.308zm7.5 0h.884v-1.5h3v-3.884h-3.884zm.884-2.384v-2.116h2.116v2.116zM4 20V4h16v16z"/></svg>`,
"lock": (width, height, color,className) => `<svg class="mat_icon ${className}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 512 512"><path stroke="${color}" stroke-miterlimit="10" stroke-width="${width}" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"/><path stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${width}" d="M256 176v160m80-80H176"/></svg>`,

} 

type matIconOptions = {
  w?: string | number;
  cls?: string;
  h?: string | number;
  c?: string;
};
export default function matIcon(name:MAT_ICON_KEYS, obj?: matIconOptions): string {
  let {w,h,c,cls} = (obj = { c: "currentColor", h: 20, w: 20, cls: "" });
  return mat_icon_obj[name](w, h, c, cls);
}

