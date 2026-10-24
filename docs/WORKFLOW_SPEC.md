# Workflow specification

## Lifecycle

### New project
1. Identify stack, deployment model, architecture boundaries, test commands, data/security requirements, and Git branching model.
2. Scaffold the application and its real project docs.
3. Add project-specific `pj` config and a small CLI adapter.
4. Add assistant context, AI README, new-chat starter, handover and implementation checklist.
5. Add Graphify only if appropriate; build the initial graph and inspect output.
6. Run detected baseline checks and document actual results.

### Existing project
1. Inspect repository status and current branch; preserve uncommitted work.
2. Detect language/toolchain, package manager, tests, CI, docs, architecture instructions, ignore rules, and existing scripts.
3. Produce an integration plan and file conflict list before writes.
4. Add missing workflow files; merge into existing files carefully. Never overwrite the project README or existing assistant instructions blindly.
5. Add project-specific commands that call the repository's real tools.
6. Run safe validation and compare the full diff.
7. Commit/push only after user review and approval.

## Chat commands

Commands are assistant conventions described in project docs, not native slash-command registrations. Keep behavior consistent across projects.

- `/feature`: gather source/docs/graph evidence, define acceptance criteria, update plan/docs, ask for approval, implement one phase at a time, validate each phase, update checklist/handover.
- `/fix`: trace reported behavior, locate root cause, create minimal plan and regression test, implement and validate.
- `/branch`: inspect current branch/worktree, verify base, preserve changes, create/switch only after confirming target.
- `/merge`: compare source/target, inspect commits and conflicts, run available checks, explain risk, require explicit final approval before merge.
- `/sync`: refresh graph, regenerate configured traces, run status/review/whitespace checks, summarize diff. No implicit stage/commit/push.
- `/handover`: update the tracked handover with verified facts and successful commit URL; do not treat ignored local output as persistence.
- `/status`, `/trace`, `/review`, `/test`, `/help`, `/create`: follow definitions in `AI_README.md`.

## Shared CLI contract

The project-local `./pj` is a thin adapter, not a universal assumption that all projects use npm or dotnet. It should:
- offer `help`, `status`, `check`, `graph`, `traces`, `sync`, and `handover`;
- detect and call only available project tools;
- print actionable errors for missing optional dependencies;
- return non-zero on failed required checks;
- avoid hidden destructive operations;
- avoid staging, committing, pushing, merging, deployment and database migrations;
- distinguish required checks from optional checks and explain skipped checks.

## Graph-assisted workflow

1. Refresh the graph after relevant pulls/changes.
2. Query only the subgraph relevant to the task; don't treat the entire graph as a specification.
3. Check graph relationships against source files, tests and architecture docs.
4. Maintain reusable trace queries only for high-value repeatable paths.
5. Review generated graph/report changes and keep local caches, credentials and machine-specific state out of commits unless project policy explicitly says otherwise.

## Handover contract

Tracked `docs/handover/current.md` should include:
- repository, intended branch and verified commit;
- objective and user decisions;
- completed/in-progress steps;
- changed paths and commit links;
- checks actually executed and their evidence;
- local-only/uncommitted state explicitly identified as unknown unless the developer provided it;
- blockers and exact next actions.

At new-chat startup, verify current GitHub state, read `CHATGPT_CONTEXT.md`, `AI_README.md`, current handover, checklist and relevant source/docs/tests. Reconcile stale handover claims before acting.

## Language-independent CLI and action extensions

The shared workflow is independent of the target project's application language. The MJS CLI is a prototype; the recommended long-term core is a Rust executable using clap, with a versioned TOML manifest. A tiny POSIX-shell launcher can invoke it on Unix from Bash or Fish; provide a PowerShell launcher for Windows. Python is a reasonable alternative for a fast prototype when a Python runtime is an accepted dependency. Bash is appropriate for launchers and simple glue, not the primary configuration engine. Fish should not be the canonical implementation because it is not broadly available across platforms.

Keep five concerns separate: shared workflow contract/docs; core CLI; project configuration; action implementations; optional integrations. A project action may invoke Python, Rust/Cargo, Bash, Fish, dotnet, Go, Node.js, or another explicitly configured executable. The core CLI must not assume all these runtimes are installed.

Target CLI extension points:
- pj doctor: inspect configuration, environment, tools, and Git status.
- pj action list/show/add: discover, inspect, and scaffold project-specific actions.
- pj run <action>: validate and run a configured action.
- pj workflow validate/explain: validate manifests and explain an action without executing it.
- existing stable commands for help, status, check, graph, traces, sync, and handover.

Action manifests should declare a unique name, purpose, supported stack, executable plus argument array or repository-relative script, prerequisites/install guidance, required/optional status, timeout, working directory, expected outputs/checks, documentation to update, and read-only/write safety classification. Prefer argument arrays over interpolated shell strings. Adding an action must show a diff and update the actual project README with its real dependencies, installation, invocation, and validation instructions. Preserve the common planning, Graphify, test, handover, and Git safety rules. Do not execute downloaded/unreviewed actions automatically or allow them to bypass approval for consequential operations.

These are target-contract definitions; the existing MJS starter does not yet implement all listed commands or action management. Do not document a command as available in a project until it is implemented and tested there.

## Initialization and dependency management

Target command: `pj init`. It should identify the project root, inspect manifests and lockfiles, detect Git and relevant language toolchains, validate the workflow manifest, and report which integrations are available. It should check for `uv` and Graphify. If Graphify is wanted and missing, offer to install the official PyPI package `graphifyy` using `uv tool install graphifyy`; the resulting command is `graphify`. Explain separately that `graphify install` registers an assistant skill and that graph generation is performed from within a supported assistant. Official references: https://graphiffy.com/docs/install and https://graphiffy.com/docs/cli.

If uv is missing, explain the official platform-specific installation options from https://docs.astral.sh/uv/getting-started/installation/. Do not use a guessed package-manager command. Default behavior is interactive and asks before installation. An explicit non-interactive consent flag may authorize documented, non-privileged prerequisite installs, but must not bypass OS privilege prompts, overwrite user configuration, or execute arbitrary project scripts. Never install every language toolchain by default.

Dependency handling is layered:
1. Core pj executable and its runtime/build requirements.
2. Optional workflow tools such as uv and Graphify.
3. Project runtimes detected from manifests and lockfiles.
4. Dependencies required by individual configured actions.

The README should contain a managed AIWorkFlow section describing only detected or explicitly configured dependencies, installation instructions, commands, and validation steps. Preserve unrelated README content. On ambiguous detection, report the evidence and ask instead of guessing.

## Configurable multi-language checks

The target CLI should store checks in one project-local, versioned file, preferably `.pj/workflow.toml`. The check pipeline must support any number of ordered steps from different ecosystems in the same repository. Example commands include npm run test, cargo test, uv run pytest, dotnet test, go test ./..., and explicit Bash or Fish scripts. Only configure a command when the repository's manifests, scripts, or user instruction support it.

Target command contract:
- `pj check` runs configured steps in order and stops on the first required failure by default; report all executed, skipped, and unavailable steps.
- `pj check list` displays the configured sequence and prerequisites.
- `pj check add --name NAME -- executable arg...` adds a command with an explicit argument array.
- `pj check --add-command "npm run test"` is a convenience form that parses a quoted command into executable and arguments without implicit shell evaluation. Document its parsing rules and reject malformed input.
- `pj check remove NAME` removes a named step after showing the change.
- `pj check --dry-run` shows exactly what would execute without running it.
- `pj workflow validate` checks configuration without executing project commands.

Each step should declare name, executable, arguments, working directory, required/optional status, runtime prerequisites, and optional timeout. If shell operators or pipelines are required, make shell invocation explicit (for example, `bash -lc ...`) rather than silently evaluating a command string. Adding or removing a step modifies the one canonical config file and shows the diff. README documentation should be synchronized when setup or dependencies change.

The CLI must distinguish configuring a command from executing it. `--add-command` adds a step but must not run it unless the user supplies an explicit run option. Never install project dependencies or run post-install scripts merely because a command was added.

These are target requirements; the existing MJS prototype does not implement this contract yet. Do not claim support until the Rust CLI, schema validation, platform installation paths, and integration tests are implemented.