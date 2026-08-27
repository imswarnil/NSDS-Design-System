/* The component layer's file list, in one place.
   =========================================================================
   components/css/ is grouped into folders — foundation, primitives,
   navigation, content, product, integrations — so that "where does the
   button live" has an answer you can see rather than one you have to grep
   for. Six scripts read that directory, and before this helper four of them
   did a flat `readdirSync` that silently returned NOTHING once the files
   moved down a level: no error, no missing-file warning, just a linter that
   checks zero files and passes.

   That is the failure mode worth guarding against. A checker that finds no
   input should be loud, so `cssFiles()` throws when the walk comes back
   empty rather than letting a green build mean "nothing was examined". */
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** Every component stylesheet, recursively, as paths relative to ROOT.
 *  index.css is excluded: it is the import manifest, not a component. */
export function cssFiles(root, { includeIndex = false } = {}) {
  const base = join(root, "components/css");
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const abs = join(dir, entry);
      if (statSync(abs).isDirectory()) { walk(abs); continue; }
      if (!entry.endsWith(".css")) continue;
      if (!includeIndex && entry === "index.css") continue;
      out.push(relative(root, abs).split(sep).join("/"));
    }
  };
  walk(base);
  if (!out.length) throw new Error("cssFiles(): components/css contains no stylesheets — the layer moved, or the path is wrong");
  return out;
}

/** The folder a stylesheet sits in — "primitives", "product", … — for
 *  grouping output by family rather than by bare filename. */
export const cssGroup = (rel) => rel.split("/").slice(-2, -1)[0] ?? "";
