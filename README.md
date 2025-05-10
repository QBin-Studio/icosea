# IcoSea - A Icon Generator tool

IcoSea is a Icon utility tool to generate from **SVG** to flexible **typescript** reusable function.

`.toml` file

## build prerequisite

- **Deno Version ^2.0.0** (build dependencies)
- **Toml** support in browser (for icons listing. can be ignore in .gitignore but not recommended)

ps: all requisite is only to build output file. and output file is totally dependency free. it means no deno or toml at production only pure typescript.;

## Roadmap

- [x] core functionality. generation part
- [ ] component generation for library.
  - [-] Svelte - (can be use by `{@html icon("name", ...options)}`)
  - [ ] react
  - [ ] Vue

## usage

### example of.toml file

```toml
[options]
height = "1em" # can be controlled via font-size in html
width = "1em"
color = "currentColor" # can be controlled via color css property.
func_name = "icons"
name = "icosea_icons"
output = "src/assets/icons/index.ts"
global_className = "icosea_global_cls"


[icons]
note_outline = """<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4"/><path d="M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5"/></g></svg>"""
```

as you see in options we are taking some configuration.

- `height` - the default height of all icons
- `width` - the default width of all icons
- `color` - the default color of all icon
- `func_name` - callable function name which will return your svg string. like
  this
- `name` - A name that can be used as reference inside code generation
- `output` - specify where you want to store the output
- `global_className` - a global className by which

### Simple step to generate

1. Install Icosea Globally

```sh
deno install -gfr -A jsr:@bns/icosea -n icosea
```

2.run command using Deno

```shell
icosea -f=<your icon.toml absolute path>
```

3.In javscript use your spcefied function name in `icon.toml` <br> in `any.js`

```js
    import  {icoseaIcon} from "icons/icosea/index.ts"
    iconEl.innerHTML = icoseaIcon("iconKeyNameAsToml", {h:/* height */: 20, w/* width */: "20px", c/* color */:"#fff", cls/* individual className */: "note_outline"})
``
```

### Note

if your icon svg content doesn't has `height` `width`,`fill`, `stroke` attributes then icosea won't place
any value. icosea just make these property dynamic if these property exist.

happy coding.🤞 <br>
made by [@MrBns (Mr Binary Sniper)](https://mrbns.dev)
