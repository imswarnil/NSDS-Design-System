/* NS Design System — gulp orchestration.
   =========================================================================
   The Ghost theme builds with gulp, so the design system speaks the same
   language: `gulp` for the dev loop, `gulp build` for artifacts, `gulp site`
   for the deployable preview. Every task is a thin orchestration of the
   scripts in scripts/ — gulp owns the WORKFLOW, the scripts own the WORK, so
   `node scripts/build-tokens.mjs` and CI keep working with no gulp at all.

   Tasks:
     gulp            dev loop — build, then serve with watch + live reload
     gulp build      tokens → css bundle → preview page
     gulp check      the CI checks (add --site-built to include link integrity)
     gulp site       build + stage the deployable static site into _site/
     gulp serve      serve an existing build, no watching
*/
import gulp from "gulp";
import { execFile, spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* Run one of scripts/*.mjs and stream its output. */
const run = (script, ...args) => {
  const fn = (done) => {
    execFile(process.execPath, [join(ROOT, "scripts", script), ...args], { cwd: ROOT }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      done(err || undefined);
    });
  };
  fn.displayName = script.replace(".mjs", "") + (args.length ? " " + args.join(" ") : "");
  return fn;
};

export const tokens = run("build-tokens.mjs");
export const css = run("build-css.mjs");
export const preview = run("build-preview.mjs");

export const build = gulp.series(tokens, css, preview);

export const check = gulp.series(
  run("build-tokens.mjs", "--check"),
  run("lint-principles.mjs"),
  /* The cascade check guards the one promise the Tailwind layer rests on — a
     utility always beats a .ns-* default. It parses the @import graph itself,
     so it runs before build-css and cannot pass on a stale dist/. */
  run("check-cascade.mjs"),
  run("check-components.mjs"),
  /* The icon subset. It does not fail the build yet — see the header in
     scripts/check-icons.mjs — but a missing glyph is an INVISIBLE control, and
     the only way that gets noticed is if the build says so every time. */
  run("check-icons.mjs"),
  run("check-palette.mjs"),
  run("build-css.mjs", "--check"),
);

/* The deployable static site — what CI publishes to Pages, and what you
   rsync to any server. Link integrity is checked HERE rather than in `check`
   because it needs _site/ to exist; running it as part of the build is what
   makes it unskippable. */
export const site = gulp.series(build, run("build-site.mjs"), run("check-links.mjs"));

/* Serve without watching (an existing build, e.g. reviewing a branch). */
export const serve = (done) => {
  spawn(process.execPath, [join(ROOT, "scripts/serve.mjs")], { cwd: ROOT, stdio: "inherit" });
  done();
};
serve.displayName = "serve";

/* The dev loop. serve.mjs --watch owns the file watching, incremental
   rebuild and SSE live reload — gulp starts it after a full build so the
   first page load is already correct. */
const dev = gulp.series(build, (done) => {
  spawn(process.execPath, [join(ROOT, "scripts/serve.mjs"), "--watch"], { cwd: ROOT, stdio: "inherit" });
  done();
});
export default dev;
