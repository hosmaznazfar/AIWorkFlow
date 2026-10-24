# Feature implementation checklist

Use this checklist for each non-trivial feature. Keep checked items evidence-based.

## Before implementation
- [ ] Confirm intended repository, branch, and current working-tree state.
- [ ] Read project context, AI README, handover, architecture docs, and relevant source/tests.
- [ ] Query the relevant graph if configured; verify graph claims against source.
- [ ] Define acceptance criteria, scope, risks, and phased plan.
- [ ] Update feature docs and trace queries if useful.
- [ ] Obtain user approval before application-code implementation.

## Implementation
- [ ] Implement one approved phase at a time.
- [ ] Add/update regression and behavior tests.
- [ ] Preserve authorization, security, data integrity, localization/RTL, and existing behavior.
- [ ] Update docs and this checklist as work progresses.

## Validation and handover
- [ ] Run applicable configured checks; record exact results.
- [ ] Review complete diff, generated artifacts, secrets, and whitespace.
- [ ] Record skipped checks and required developer-side validation.
- [ ] Update docs/handover/current.md with verified branch/commit, decisions, changes, tests, blockers, and next steps.
- [ ] Commit/push only after explicit approval; never infer approval from this checklist.
