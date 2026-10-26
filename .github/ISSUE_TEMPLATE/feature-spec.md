---
name: Feature spec & board
about: One board Issue per feature. Owned by studioOS PM, gates tracked by Chief of Staff.
title: "<Feature> — spec & board"
labels: []
assignees: []
---

<!-- Protocol: docs/team/PROTOCOL.md. Approvals only in the room: "מאשר G0" / "מאשר 1,3". -->

## Goal
<!-- One or two sentences: what problem this solves and for whom. -->

## Base branch + SHA
- Branch: `main`
- SHA: `<full sha>`

## UI language
- [ ] he (RTL)
- [ ] en (LTR)

## Scope
**In:**
-

**Out:**
-

## User flow
1.
2.
3.

## Acceptance criteria
- [ ]
- [ ]
- [ ]

## Decisions for approval
<!-- Max 5. Each with a recommendation. Daniel approves in the room: "מאשר 1,3". -->
1. **<Decision>** — Options: A / B. **Recommendation:** A, because …
2.
3.

## Gate ledger
| Gate | Status | Approved by | When (Asia/Jerusalem) | Link to approval message |
|---|---|---|---|---|
| G0 — Spec | ⏳ | | | |
| G1 — Design | ⏳ | | | |
| G2 — Preview | ⏳ | | | |

## Owner per task
| Bot | Task | Status | Link |
|---|---|---|---|
| studioOS PM | Spec + board | ⏳ | |
| Competitor Research | (only if assigned) | — | |
| studioOS Product Designer | Figma; `ui/<feature>` after G1 | ⏳ | |
| studioOS Copy | `content/<feature>-copy.md` | ⏳ | |
| studioOS Prototype | `feature/<name>` | ⏳ | |
| studioOS QA | Preview test (light/dark, desktop/390px, nav) | ⏳ | |
| studioOS PR Review | Fork PR review | ⏳ | |

## Preview link
<!-- Latest Vercel preview URL, posted by Prototype after every push. -->
-

## Definition of Done
- [ ] Vercel build green, preview link works
- [ ] QA PASS (light + dark, desktop + 390px, every nav link) with screenshots
- [ ] PR Review approve
- [ ] No unapproved dependencies
- [ ] No hardcoded `/studioOS` basePath
- [ ] Stories for new components
- [ ] Strings taken from `content/<feature>-copy.md`
- [ ] Daniel's G2 recorded in the Gate ledger
