# Integrating AIWorkFlow into a project

AIWorkFlow is designed to be vendored into each project, so each repository contains its own usable instructions, CLI and dependencies guide.

## Before you begin

- Ensure the working tree is clean or save/stash work yourself.
- Create a setup branch.
- Read the project README, contributing instructions, AI/agent instructions, package manifests, CI, test scripts, .gitignore and existing CLI.
- Record detected stack, baseline status and conflicting file paths.
- Do not run setup against production systems.

## Integration process

1. Clone or download AIWorkFlow.
2. Copy templates into the target project, adapting them to its actual stack and naming. Preserve existing project instructions by merging rather than replacing.
3. Create a project-local `project-workflow.json` from the template and fill in project name, detected package managers, checks, graph paths, trace-query file, handover path, and safe command allowlist.
4. Add `./pj` as a small launcher for the project's `scripts/pj.mjs`. On Windows, document `node scripts/pj.mjs` as the portable alternative if a shell launcher is not available.
5. Add `AI_README.md`, `CHATGPT_CONTEXT.md`, `docs/CHATGPT_NEW_CHAT_STARTER.md`, `docs/handover/current.md`, and `FEATURE_IMPLEMENTATION_CHECKLIST.md`. Use project-specific paths only after verifying conventions.
6. Inspect the target project's current Graphify configuration. If absent and graph support is wanted, install Graphify using its official instructions and build the graph in the assistant. Do not assume a graph exists.
7. Ensure the target project's README documents every required and optional dependency, installation steps, available commands, checks, and fallback commands.
8. Run CLI help/status and the safe checks supported by the environment. Verify generated files and diff.
9. Ask for review before committing or pushing.

## Existing-file policy

- Never overwrite README.md, package.json scripts, .gitignore, CI workflows, editor rules, or existing AI instructions without merging and reviewing.
- Preserve custom project workflows. Prefer a thin adapter that calls existing scripts.
- Do not add Graphify, Python, Node, dotnet, or any language toolchain as mandatory unless the project actually needs it.
- Do not install packages globally without user approval.
- Keep secrets and local-only output out of Git.
- Make setup idempotent: a second run should report already configured files and leave customized files unchanged.
- If a conflict cannot be merged safely, stop and show the conflict.

## Acceptance criteria

- A human-readable project README contains accurate setup/dependency/command documentation.
- `./pj help` matches implemented commands.
- `./pj status` shows branch, HEAD and worktree status where Git is available.
- `./pj check all` runs only detected/configured checks and reports skipped ones.
- `./pj sync` fails visibly if a required refresh/review step fails, but never commits or pushes.
- A new chat starter and tracked handover are present and reference the actual branch/file conventions.
- Existing project functionality, instructions and scripts are preserved.
- Validation and remaining manual steps are recorded.

## Language-neutral CLI and project actions

The MJS starter is a prototype, not a requirement. The recommended long-term core is a Rust executable distributed as a prebuilt binary or built from source. Use a small POSIX-shell launcher on Unix (usable from Bash and Fish) and a PowerShell launcher on Windows. Keep project metadata and action manifests in a versioned declarative format such as TOML.

The core CLI should not require Node.js or Python. A project action can invoke the actual tools already used by the target repository: Python/uv, Cargo, Bash, Fish, dotnet, Go, Node.js, or another explicit executable. Install only the runtime needed by the chosen action. Python is a valid quicker prototype if accepting Python as a dependency is a deliberate choice; Bash is best for launchers/glue rather than complex config parsing.

An action-add workflow should inspect the project, select or create an action template, declare the command and arguments, prerequisites, timeout and safety level, validate the manifest, show the diff, and update the target README with actual dependencies and usage. Preserve the shared planning, verification, handover, Graphify and Git safety rules. Never run an unreviewed downloaded action or silently stage/commit/push/merge/deploy/migrate. The exact new command names are target design until implemented and tested.

## Init and checks

The target `pj init` command should scan the target project and present a plan before changing files. It should detect project manifests and lockfiles, core tool availability, uv, Graphify, configured checks, existing README sections, and conflicts. It should ask before installing missing prerequisites or project dependencies. A non-interactive consent flag can authorize documented non-privileged setup, but must not use sudo/admin elevation automatically or run arbitrary project scripts without clear consent.

Graphify's official package is `graphifyy`; it installs the `graphify` executable. The documented uv path is `uv tool install graphifyy`. Registering the assistant integration (`graphify install`) and building/updating the graph inside an assistant are separate operations. If uv is missing, show official installation instructions for the detected platform rather than assuming a package manager. References: https://graphiffy.com/docs/install and https://docs.astral.sh/uv/getting-started/installation/.

Store project check steps in one canonical file such as `.pj/workflow.toml`. Configure multiple ordered commands across languages where the repository supports them. Example: npm run test, cargo test, uv run pytest, and dotnet test can coexist in a monorepo. Each step needs a name, executable plus argument array, working directory, required/optional flag, and prerequisites.

The target CLI should support `pj check`, `pj check list`, `pj check add --name NAME -- executable arg...`, `pj check --add-command "npm run test"`, `pj check remove NAME`, `pj check --dry-run`, and `pj workflow validate`. Adding a step updates configuration only; it must not execute the new command implicitly. Use explicit shell invocations for pipes or shell operators. Show diffs before mutating the check list.

After initialization or check configuration changes, update a managed section in the target README with detected dependencies, actual setup instructions, configured checks, and validation commands. Never replace the whole README or invent dependencies. If detection is ambiguous, document the ambiguity and ask.