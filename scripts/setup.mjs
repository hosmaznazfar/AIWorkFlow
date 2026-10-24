#!/usr/bin/env node
/**
 * Conservative AIWorkFlow bootstrapper.
 * Usage: node scripts/setup.mjs [target-project-root]
 * Refuses to overwrite existing files. Review the resulting diff before committing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, chmodSync } from "node:fs";
import { dirname, resolve, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetRoot = resolve(process.argv[2] || process.cwd());
const projectName = targetRoot.split(/[\\/]/).filter(Boolean).at(-1) || "MyProject";
const repository = process.env.AIWORKFLOW_REPOSITORY || "<OWNER/REPOSITORY>";
const branch = process.env.AIWORKFLOW_BRANCH || "<BRANCH>";

const mapping = [
  ["templates/AI_README.md", "AI_README.md"],
  ["templates/CHATGPT_CONTEXT.md", "CHATGPT_CONTEXT.md"],
  ["templates/CHATGPT_NEW_CHAT_STARTER.md", "docs/CHATGPT_NEW_CHAT_STARTER.md"],
  ["templates/handover-current.md", "docs/handover/current.md"],
  ["templates/FEATURE_IMPLEMENTATION_CHECKLIST.md", "FEATURE_IMPLEMENTATION_CHECKLIST.md"],
  ["templates/project-workflow.json", "project-workflow.json"],
  ["templates/pj.mjs", "scripts/pj.mjs"],
  ["pj-core/Cargo.toml", "pj-core/Cargo.toml"],
  ["pj-core/src/main.rs", "pj-core/src/main.rs"],
  ["templates/trace-queries.json", "docs/architecture/trace-queries.json"]
];
const replacements = (s) => s.replaceAll("<PROJECT_NAME>", projectName)
  .replaceAll("<OWNER/REPOSITORY>", repository)
  .replaceAll("<BRANCH>", branch);

const conflicts = mapping.map(([, dst]) => dst).filter(dst => existsSync(join(targetRoot, dst)));
if (conflicts.length) {
  console.error("Refusing to overwrite existing files:");
  for (const file of conflicts) console.error("  - " + file);
  console.error("Merge these files manually, then rerun setup. No files were copied.");
  process.exit(2);
}
for (const [src, dst] of mapping) {
  const from = join(sourceRoot, src);
  const to = join(targetRoot, dst);
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, replacements(readFileSync(from, "utf8")), { flag: "wx" });
  console.log("Created " + dst);
}
const launcher = join(targetRoot, "pj");
if (!existsSync(launcher)) {
  writeFileSync(launcher, '#!/bin/sh\nset -eu\nROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"\nif [ -x "$ROOT/pj-core/target/release/pj" ]; then exec "$ROOT/pj-core/target/release/pj" "$@"; fi\nif ! command -v cargo >/dev/null 2>&1; then echo "[pj] Rust/Cargo is required: https://www.rust-lang.org/tools/install" >&2; exit 127; fi\nexec cargo run --quiet --manifest-path "$ROOT/pj-core/Cargo.toml" -- "$@"\n', { flag: "wx" });
  chmodSync(launcher, 0o755);
  console.log("Created pj");
} else {
  console.log("Skipped existing pj launcher; invoke node scripts/pj.mjs instead or integrate manually.");
}
const readmePath = join(targetRoot, "README.md");
const marker = "<!-- AIWORKFLOW:START -->";
if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, "utf8");
  if (readme.includes(marker)) {
    console.log("README.md already has AIWorkFlow section; left unchanged.");
  } else {
    const section = `
\n<!-- AIWORKFLOW:START -->
## AI-assisted development workflow

This repository uses [AIWorkFlow](https://github.com/hosmaznazfar/AIWorkFlow) for repeatable AI-assisted development.

- Read `AI_README.md` and `CHATGPT_CONTEXT.md` before AI-assisted changes.
- Start a new chat with `docs/CHATGPT_NEW_CHAT_STARTER.md`.
- Persistent handover: `docs/handover/current.md`.
- CLI: `./pj --help` and `./pj init` (requires Rust/Cargo on first use).
- Review `docs/DEPENDENCIES.md` in the AIWorkFlow repository and this project's actual package manifests for dependencies.
- Graphify is optional; enable it only after installing/configuring it for this project.

Do not commit, push, merge, deploy, or run migrations automatically. Review generated diffs and validation results first.
<!-- AIWORKFLOW:END -->
`;
    writeFileSync(readmePath, readme.replace(/\s*$/, "") + "\n" + section, { flag: "w" });
    console.log("Appended AIWorkFlow documentation section to README.md");
  }
} else {
  writeFileSync(readmePath, `# ${projectName}\n\nDocument this project's purpose, real dependencies, setup and validation commands.\n\n${marker}\n## AI-assisted development workflow\n\nSee \`AI_README.md\`, \`CHATGPT_CONTEXT.md\`, and \`docs/CHATGPT_NEW_CHAT_STARTER.md\`. Run \`./pj help\` for the local workflow CLI.\n<!-- AIWORKFLOW:END -->\n`, { flag: "wx" });
  console.log("Created README.md with workflow section; complete the project-specific sections.");
}
console.log("\nBootstrap complete. Inspect README.md and every generated file, then run ./pj init to detect project checks and initialize .pj/workflow.toml.");
console.log("This script does not install packages, run project code, stage, commit, push, merge, deploy, or migrate.");
