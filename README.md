# IcoSea - A Icon Generator tool

IcoSea is a Icon utility tool to generate flexible icon in `.ts` file from `.toml` file

### prerequisite

- **Deno Version ^2.0.0** (for generation. after generation you can use with any javascript tool)
- **Toml** support in browser (optional)

## Roadmap

- [x] core functionality. generation part
- [] component generation for library.
  - [] Svelte
  - [] react
  - [] Vue

## usage

**example of .toml file**

```toml
[options]
height = 20
width = 20
color = "currentColor"
func_name = "icoseaIcon"
name = "mat_icon"
output = "icons/icosea/index.ts"
global_className = "mat_icons"


[icons]
3g = """<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.33998 6.32671H5.07665V1.84004H3.08998V2.57671H4.33998V6.32671ZM7.25665 6.32671H10.4933V5.59004H7.99331V4.40421H10.4933V1.84004H7.25665V2.57671H9.75665V3.76337H7.25665V6.32671ZM2.25665 12.16H2.99331V8.41004H4.33998V10.91H5.07665V8.41004H6.42331V12.16H7.15998V7.67337H2.25665V12.16ZM8.50665 12.16H9.24331V10.91H11.7433V7.67337H8.50665V12.16ZM9.24331 10.1734V8.41004H11.0066V10.1734H9.24331ZM0.333313 13.6667V0.333374H13.6666V13.6667H0.333313Z" fill="black"/>
</svg>
"""
```

as you see in options we are taking some configuration.

- `height` - the default height of all icons
- `width` - the default width of all icons
- `color` - the default color of all icon
- `func_name` - callable function name which will return your svg string. like this
- `name` - A name that can be used as reference inside code generation
- `output` - specify where you want to store the output
- `global_className` - a global className by which

### Simple step to generate

1. clone this repo as subModule of git

```sh
git clone https://github.com/mrbns/icosea lib/pkg/icosea
```

2. run command using Deno

```shell
ICOSEA_FILE=<icon_file.toml> deno run -A lib/pkg/icosea/main.ts
```

3. in javscript use your spcefied function name in `icon.toml` <br> in `any.js`

```js
    import  {icoseaIcon} from "icons/icosea/index.ts"
    iconEl.innerHTML = icoseaIcon("iconKeyNameAsToml", {h:/* height */: 20, w/* width */: "20px", c/* color */:"#fff", cls/* individual className */: "heckingName"})
``
```
