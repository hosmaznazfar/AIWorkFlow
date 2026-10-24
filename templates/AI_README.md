# AI README — <PROJECT_NAME>

This file is the operational guide for AI-assisted development in this repository. Replace placeholders with verified project-specific facts. Never claim a check ran unless its output is available.

## Startup: every new chat

1. Verify the intended repository and branch. Inspect current GitHub HEAD and recent commits; do not assume prior chat or local checkout state.
2. Read `CHATGPT_CONTEXT.md`, `AI_README.md`, `docs/handover/current.md`, `FEATURE_IMPLEMENTATION_CHECKLIST.md`, relevant architecture/feature docs, and current source/tests.
3. Reconcile the handover against current code and commits. Local uncommitted work is unknown unless the developer shares it.
4. Read the project README and use only installed/configured commands.
5. Use `docs/CHATGPT_NEW_CHAT_STARTER.md` when opening a new chat.

## Chat workflow conventions

These are instructions, not native slash-command registrations.

- `/help`: explain available workflows.
- `/status`: inspect branch, HEAD, worktree if available, graph freshness and check results.
- `/feature <goal>`: inspect source/docs/graph; draft acceptance criteria, targeted graph queries, implementation phases and doc updates; wait for approval before application-code implementation; proceed phase by phase.
- `/fix <problem>`: trace the behavior to source/tests, propose a minimal root-cause fix and regression test, then implement within scope.
- `/trace <area>`: follow real call/data paths and update reusable trace queries only when useful.
- `/review`: review the actual diff, architecture, security/authorization, data integrity, localization and tests.
- `/test`: run available checks only with real execution access; otherwise provide exact commands and ask for output.
- `/branch <name>`: verify target/base and worktree; preserve changes and never switch/delete work silently.
- `/merge <source> -> <target>`: inspect source/target diff, conflicts and validation; require explicit final confirmation before merging.
- `/sync`: refresh graph, regenerate configured traces, run status/review/diff checks. Never stage, commit or push automatically.
- `/handover`: update the tracked `docs/handover/current.md` on the intended branch. Include verified branch/commit, decisions, changed files/commits, actual checks, pending local validation, blockers and exact next steps. Confirm the GitHub write succeeded; otherwise say it did not.
- `/create`: follow the plan-first project/feature creation process.

## Local CLI

Use the project-local `./pj` only for commands actually implemented in this repository. Start with:

```bash
./pj help
./pj status
```

If the launcher is unavailable, try `node scripts/pj.mjs help` where Node.js is installed. See README.md for detected dependencies and checks.

## Graph-assisted development

If Graphify is configured, query the relevant subgraph before broad source exploration. Verify graph claims against real source and tests. Refresh after meaningful pulls/changes and review generated diffs. Do not blindly commit caches, machine-specific state, secrets or historical snapshots.

## Implementation rules

- Inspect before changing; respect existing project architecture and instructions.
- Plan and acceptance criteria first for new features; wait for user approval before application-code implementation.
- Update documentation and `FEATURE_IMPLEMENTATION_CHECKLIST.md` as implementation progresses.
- Run only relevant checks and report exactly what ran, passed, failed or was skipped.
- Do not stage, commit, push, merge, deploy or run migrations unless explicitly requested/approved.
- Preserve authorization, security, data integrity, localization/RTL and existing behavior.

## End-of-session handover

Update `docs/handover/current.md` with verified state. `./pj handover` may generate supplemental local-only context but is not a substitute for the tracked file.
