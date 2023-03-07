import { expandGlobSync } from "https://deno.land/std@0.178.0/fs/mod.ts";

const json = JSON.parse(
  Deno.readTextFileSync("package/src/common/deno-meta.json"),
  //deno-lint-ignore no-explicit-any
) as any;
const meta = json.meta;

delete json.meta;

let excludes: string[] = [];
for (const file of meta.excludeGlobs) {
  const f: string = file;
  if (f.includes("*")) {
    for (const { path } of expandGlobSync(f)) {
      excludes.push(path);
    }
  } else {
    excludes.push(f);
  }
}

// drop the current working directory from the paths
excludes = excludes.map((e) => e.replace(Deno.cwd() + "/", ""));

json.lint.files.exclude = excludes;
json.fmt.files.exclude = excludes;

console.log("// auto-generated by package/src/common/create-deno-config.ts");
console.log("// see dev-docs/update-deno_jsonc.md");
console.log(JSON.stringify(json, null, 2));
