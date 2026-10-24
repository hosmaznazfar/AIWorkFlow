# ChatGPT Project Context — <PROJECT_NAME>

Repository: <OWNER/REPOSITORY>
Primary branch: <BRANCH>
Project stack: <DETECTED_STACK>

At the start of every chat, verify current repository/branch/commit and read `AI_README.md`, `docs/handover/current.md`, `FEATURE_IMPLEMENTATION_CHECKLIST.md`, relevant docs and source/tests. Never assume previous-chat context or local state is current.

Follow `AI_README.md` chat workflow conventions. For `/feature`, investigate and plan first, update relevant docs and targeted graph trace configuration if useful, then wait for approval before application-code implementation. Implement in phases and validate each phase.

For `/handover`, update the tracked `docs/handover/current.md` on the intended branch and verify the GitHub write succeeded. Distinguish local-only/uncommitted state from committed GitHub state. The local `./pj handover` output is supplemental only.

Slash commands are documented assistant conventions, not native ChatGPT registrations. No commit/push/merge/deploy/migration without explicit approval.
