
type MAT_ICON_KEYS = "3g" ;

const mat_icon_obj : Record<MAT_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
"3g": (width, height, color,className) => `<svg class="mat_icons ${className}" width="${width}" height="${height}" viewBox="0 0 14 14"  xmlns="http://www.w3.org/2000/svg">
<path d="M4.33998 6.32671H5.07665V1.84004H3.08998V2.57671H4.33998V6.32671ZM7.25665 6.32671H10.4933V5.59004H7.99331V4.40421H10.4933V1.84004H7.25665V2.57671H9.75665V3.76337H7.25665V6.32671ZM2.25665 12.16H2.99331V8.41004H4.33998V10.91H5.07665V8.41004H6.42331V12.16H7.15998V7.67337H2.25665V12.16ZM8.50665 12.16H9.24331V10.91H11.7433V7.67337H8.50665V12.16ZM9.24331 10.1734V8.41004H11.0066V10.1734H9.24331ZM0.333313 13.6667V0.333374H13.6666V13.6667H0.333313Z" fill="${color}"/>
</svg>
`,

} 

type matIconOptions = {
  w?: string | number;
  cls?: string;
  h?: string | number;
  c?: string;
};
export default function matIcon(name:MAT_ICON_KEYS, obj?: matIconOptions): string {
  let {w,h,c,cls} =  { c: "currentColor", h: 20, w: 20, cls: "", ...(obj??{}) };
  return mat_icon_obj[name](w, h, c, cls);
}

