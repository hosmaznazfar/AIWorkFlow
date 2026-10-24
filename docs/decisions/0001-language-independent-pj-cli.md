# Architecture decision: language-independent pj CLI

- Status: Proposed direction
- Date: 2026-10-24

## Context

AIWorkFlow must work in existing and new repositories using different application stacks. Requiring Node.js or Python merely to use workflow commands adds an unnecessary dependency and couples the workflow to its implementation language. Shared assistant instructions, planning gates, graph conventions, validation, handovers, and Git safety policy must survive implementation changes.

## Decision

Target a Rust core CLI named pj, using clap for argument parsing and versioned TOML project/action manifests. Distribute a prebuilt executable where possible; building from source requires Rust. Keep platform launchers thin: POSIX shell on Unix, including invocation from Bash and Fish, and PowerShell on Windows.

Allow actions to invoke explicitly configured executables or repository-relative scripts in any language. Runtime dependencies are action-specific, not universal. Python remains a reasonable rapid-prototyping alternative if its runtime is an accepted dependency; Bash/Fish are suitable for launchers and small glue, not the central workflow engine.

## Extensible action model

The CLI should support listing, inspecting, adding, validating, explaining, and running named actions. An action manifest declares purpose, stack tags, executable/argument array or script path, prerequisites and install instructions, timeout, working directory, expected outputs/checks, documentation changes, and safety classification.

Adding an action must validate configuration and show a diff before writing. It must update the target project's actual README with the dependencies, installation, invocation, and verification steps that action truly needs. Existing shared workflow rules, AI instructions, Graphify conventions, phased planning, tests, and handovers must remain intact. No action may silently stage, commit, push, merge, deploy, or migrate. Downloaded or unreviewed actions are never executed automatically.

## Consequences

- No Node.js/Python requirement for the core when using a prebuilt Rust binary.
- Project-specific actions can use Python, Rust, Bash, Fish, .NET, Go, Node.js, or other installed tools.
- The current MJS CLI/setup scripts remain prototypes until a Rust CLI and language-neutral installer are implemented and tested.
- Command examples in documentation describe the target interface, not existing capability, until each command passes implementation tests.
- A TOML schema, action templates, platform packaging, installer, and disposable-project integration tests are required before calling the migration complete.

## References

- Rust clap CLI framework: https://docs.rs/clap/latest/clap/
- mise task runner (optional comparison/integration, not a replacement for the workflow contract): https://mise.jdx.dev/tasks/
