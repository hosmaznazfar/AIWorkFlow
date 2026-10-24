# Project check configuration

This document defines the intended single source of truth for the future Rust pj check pipeline. The current MJS prototype does not yet read this file; do not treat these commands as implemented until the Rust CLI is available and tested.

## Canonical file

Use `.pj/workflow.toml` for project metadata and ordered check steps. Start from `templates/pj-workflow.toml`, then configure only commands verified from the repository's manifests, scripts, CI, or user instructions.

Each `[[checks.steps]]` entry has:

- `name`: stable unique identifier used by add/list/remove commands.
- `command`: executable name or repository-relative executable path.
- `args`: array of arguments passed without implicit shell expansion.
- `cwd`: working directory relative to the repository root; `.` for the root.
- `required`: whether a missing runtime or failing command fails the pipeline.
- `timeout_seconds`: optional timeout.
- `requires`: tool names that `pj doctor` should check.
- `description`: short purpose shown by `pj check list` and `pj check --dry-run`.

Steps run in declaration order, so one file can include npm, Cargo, uv/Python, dotnet, Go, and shell commands in a monorepo. Do not add steps merely because a language exists; inspect manifests and existing scripts. A required step that cannot run should fail with actionable install guidance. An optional unavailable step should be clearly reported as skipped.

## CLI contract

- `pj check`: run the configured pipeline, in order.
- `pj check list`: show configured steps, their runtimes, and order.
- `pj check add --name frontend-tests -- npm run test`: add a command using explicit executable and arguments.
- `pj check --add-command "npm run test"`: convenience syntax; parse quoting into executable and arguments, do not pass the whole string to a shell. Reject malformed or empty input.
- `pj check remove frontend-tests`: show the proposed config change before removing the named step.
- `pj check --dry-run`: show the commands, working directories, and prerequisites without executing them.
- `pj workflow validate`: validate schema, unique names, path safety, required fields, and executable/argument types without running project commands.

Adding a command configures it; it must not execute it implicitly. If the command needs pipes, redirects, environment expansion, or shell operators, configure an explicit shell executable and its arguments. Never construct shell commands by concatenating untrusted values.

## Init and dependency guidance

`pj init` should detect the repository root, existing workflow files, Git, toolchain clues, and available uv/Graphify commands. It should produce a plan and ask before installation or file changes. The official Graphify install path is `uv tool install graphifyy`, followed separately by `graphify install` to register the assistant skill; building the graph is a separate assistant operation. uv installation should follow its official OS-specific instructions: https://docs.astral.sh/uv/getting-started/installation/.

After setup or check configuration changes, update the managed AIWorkFlow section of README with actual prerequisites, installation instructions, configured checks, and validation commands. Preserve all unrelated README content. Never install every toolchain automatically. Do not bypass OS privilege prompts or run project scripts as part of detection.

## Acceptance tests for implementation

1. Empty repository: init explains missing project metadata and creates no guessed checks.
2. Node project: detects package manager from lockfile and proposes existing package scripts, but asks before saving/running them.
3. Python project: detects pyproject/lockfiles and offers uv guidance; does not assume pytest exists.
4. Rust project: detects Cargo.toml and proposes only commands supported by project conventions.
5. Mixed-language repository: stores and executes steps in declaration order, preserving each working directory.
6. Missing optional tool: reports skipped with install instructions; missing required tool: fails clearly.
7. `--add-command` parses quoted args safely and never implicitly evaluates shell syntax.
8. `--dry-run` does not execute commands or modify files.
9. README updates preserve all user-authored content outside the managed section.
10. No command stages, commits, pushes, merges, deploys, or migrates automatically.
