# AIWorkFlow — reusable AI-assisted project workflow

A reusable, project-local workflow for AI coding assistants and developers. It supports **new projects and existing repositories** and provides a project-specific `pj` CLI, graph-assisted planning, tracked docs, safe phased implementation, and GitHub handovers so a new chat can resume reliably.

> Status: starter scaffold. The setup scripts and templates are being bootstrapped in this repository; test them in a disposable repository before adopting them in a production project.

## Goals

- One repeatable workflow across feature projects, with small project-specific configuration instead of copy/paste CLI implementations.
- Chat conventions such as `/feature`, `/fix`, `/branch`, `/merge`, `/sync`, and `/handover`.
- Graphify-assisted exploration with source/test verification.
- A human-readable project README describing real commands, dependencies, setup, and validation.
- Tracked handovers that make new-chat startup deterministic.
- No implicit staging, committing, pushing, merging, deployment, or migrations.

## Repository layout

- `README.md` — this guide.
- `docs/WORKFLOW_SPEC.md` — end-to-end workflow and slash-command conventions.
- `docs/PROJECT_INTEGRATION.md` — onboarding existing and new projects.
- `docs/DEPENDENCIES.md` — dependency matrix and optional integrations.
- `templates/AI_README.md` — project-local assistant guide.
- `templates/CHATGPT_CONTEXT.md` — project-specific assistant context.
- `templates/CHATGPT_NEW_CHAT_STARTER.md` — reusable new-chat prompt.
- `templates/handover-current.md` — tracked handover template.
- `templates/pj.mjs` — portable starter for a project-specific CLI.
- `templates/project-workflow.json` — project config template.

## Quick start concept

For an existing project, first inspect its languages, package managers, tests, docs, Git branches, assistant instructions, and current graph artifacts. Do not overwrite existing files blindly.

1. Clone this repository.
2. Review `docs/PROJECT_INTEGRATION.md` and `docs/DEPENDENCIES.md`.
3. Run the planned setup in a clean branch and review the diff.
4. Configure the project-specific command in `project-workflow.json` and `./pj`.
5. Read the generated project's `AI_README.md` and run its checks.
6. Build/refresh the graph and review artifacts before committing them.
7. Commit and push only reviewed changes.

The setup must be idempotent: safe to rerun, preserve user content, and explain any conflicts rather than replacing files.

## Core commands

The intended common interface is:

```bash
./pj help
./pj status
./pj check all
./pj graph refresh
./pj graph review
./pj graph query "question"
./pj graph path "source" "target"
./pj graph explain "symbol"
./pj traces update
./pj sync
./pj handover
```

Each project may add language-specific checks, but the shared commands and safety rules should remain consistent. Do not advertise a command until it is implemented for that project.

## Chat workflow conventions

These are instructions to the assistant, **not native ChatGPT slash-command registrations**:

- `/help` — explain available workflows.
- `/status` — inspect current branch, commits, changes, graph and validation state.
- `/feature <goal>` — inspect source/docs/graph, propose acceptance criteria and phased plan, update relevant docs, and wait for approval before application-code implementation.
- `/fix <problem>` — reproduce/trace the issue, identify root cause, propose minimal fix and tests, then implement within the agreed scope.
- `/trace <area>` — trace actual source relationships and update repeatable trace queries when useful.
- `/review` — review diffs, architecture, authorization, data integrity, tests and generated artifacts.
- `/test` — identify and run available checks only when execution tools exist; otherwise give exact commands and request output.
- `/branch <name>` — verify base/target and current changes before creating or switching branches; never discard work silently.
- `/merge <source> -> <target>` — compare changes, check conflicts and tests, and require explicit final approval before merge.
- `/sync` — explain/run the configured local sync and inspect resulting diffs; never imply local execution without evidence.
- `/handover` — update the tracked handover file on the intended branch with verified state and link the successful GitHub commit.
- `/create` — scaffold a new feature/project following the same plan-first process.

## Dependencies

Required dependencies depend on the project. The workflow itself should not force every language's toolchain into every repository.

- Git — required.
- Node.js — required only for the JavaScript-based `pj` starter or Node-based project tooling.
- Graphify — recommended optional graph tooling; official package is `graphifyy`, command is `graphify`; Python 3.10+ is required by the current upstream docs. See [official install guide](https://graphiffy.com/docs/install).
- Project language/package manager — based on detected project (for example npm/pnpm/yarn, dotnet, Python/uv, Go).
- AI assistant + GitHub access — needed for chat-driven repository edits and handover persistence. Availability depends on the chosen assistant/integrations.

See [Dependencies](docs/DEPENDENCIES.md) for details.

## Safety and correctness

- Inspect the repository before setup; detect rather than assume its stack.
- Never overwrite project README, CI, ignore rules, assistant instructions, or existing CLI without showing/reconciling changes.
- Keep generated output separate from caches, secrets, machine-local state and dated backups.
- Do not store tokens, API keys, or secrets in committed docs/config.
- Never stage/commit/push/merge/deploy or run migrations automatically.
- Verify graph claims against real source and tests.
- Distinguish checks actually executed from suggested commands.
- Treat a GitHub handover as successful only after the write and read-back are verified.
- Preserve localization/RTL, authorization, security and data integrity constraints in the target project.

## Documentation

- [Workflow specification](docs/WORKFLOW_SPEC.md)
- [Project integration guide](docs/PROJECT_INTEGRATION.md)
- [Dependencies](docs/DEPENDENCIES.md)

## Current scope

This repository is the common workflow source of truth. A project should copy/adapt the templates into its own repository so that it remains usable independently and the local project instructions describe its actual dependencies and commands.
