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
