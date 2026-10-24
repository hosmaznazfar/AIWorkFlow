# New-chat starter — <PROJECT_NAME>

Copy the prompt below into a new chat and replace the task placeholder.

```text
We are working in <OWNER/REPOSITORY>.

Before changing anything, verify the current GitHub repository, intended branch and recent commit. Read AI_README.md, CHATGPT_CONTEXT.md, docs/handover/current.md, FEATURE_IMPLEMENTATION_CHECKLIST.md, relevant architecture/feature docs, and source/tests. Reconcile the handover against current code; do not assume prior-chat or local working-tree state.

Follow the documented project workflow. For a new feature, inspect and plan first, provide acceptance criteria and phased steps, and wait for my approval before application-code implementation. Use Graphify only if configured and verify graph claims against source/tests. Do not claim local commands/tests ran unless actual output is available.

Keep docs and checklist current. At the end, update docs/handover/current.md on the intended branch and verify the GitHub write succeeded. Never stage, commit, push, merge, deploy or migrate without explicit approval.

My task: [DESCRIBE TASK]
```
