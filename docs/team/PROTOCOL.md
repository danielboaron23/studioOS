# studioOS team protocol v2

How the multi-bot product team ships a feature from idea to an upstream PR.
Repo: `danielboaron23/studioOS` (fork of `hanigirl/studioOS`). All team work happens on the fork; only the final, approved change goes upstream as one PR.

> הערה: כל האישורים של דניאל קורים רק בחדר, ורק בפורמט שמופיע למטה.

---

## 1. Roles

| Bot | Owns | Never does |
|---|---|---|
| **Chief of Staff (CoS)** | Runs the process: routing, gate tracking, approvals ledger in the board Issue. | Writes spec, design, copy, or code. |
| **studioOS PM** | The spec and the board Issue (from `.github/ISSUE_TEMPLATE/feature-spec.md`). Keeps scope, acceptance criteria, owners table and gate ledger current. | Writes code or design. |
| **Competitor Research** | Research **only when assigned** in the board Issue's owner table, from **public sources** only, with links. | Starts work on its own; uses private or paywalled data. |
| **studioOS Product Designer** | Design in **Figma only**. After **G1** it is the **sole owner** of `components/ui/**` and their stories, on a branch named `ui/<feature>`. | Touches `app/**` or feature code. |
| **studioOS Copy** | All user-facing strings in `content/<feature>-copy.md`. | Edits code; strings in code must come from this file. |
| **studioOS Prototype** | The **only** bot that writes feature code, on `feature/<name>`. Posts the **Vercel preview URL after every push**. | Edits `components/ui/**` after G1 (asks Designer); adds unapproved dependencies. |
| **studioOS QA** | Tests **only the Vercel preview URL**: light + dark, desktop + 390px width, every nav link. Posts **one** PASS/FAIL message with screenshots. | Runs things locally; asks Daniel to run anything. |
| **studioOS PR Review** | Reviews **only open PRs on the fork** (`danielboaron23/studioOS`). | Reviews or comments on `hanigirl/studioOS`; reviews branches without a PR. |

> הערה: Prototype הוא היחיד שכותב קוד פיצ'ר. Designer הוא הבעלים היחיד של `components/ui` אחרי G1.

---

## 2. Flow and gates

```
Request ──► G0 Spec ──► G1 Design ──► build on fork ──► G2 Preview approval ──► one upstream PR
             (PM)        (Designer)    (Prototype + Copy,     (Daniel)            to hanigirl/studioOS
                                        QA, PR Review)
```

| Gate | What is approved | Evidence in the board Issue | Who approves |
|---|---|---|---|
| **G0 — Spec** | Goal, scope in/out, user flow, acceptance criteria, decisions | Spec sections filled, decisions numbered | Daniel, in the room |
| **G1 — Design** | Figma frames for every state (light/dark, desktop/390px) | Figma link(s) in the owner table | Daniel, in the room |
| **G2 — Preview** | The running feature on the Vercel preview link | Preview URL + QA PASS + PR Review approve | Daniel, in the room |

After G2: **one** PR from the fork to `hanigirl/studioOS`. Nobody opens upstream PRs before G2, and there is only one per feature.

CoS records every approval in the board Issue's **Gate ledger** (gate, who, when, link to the message).

---

## 3. Room rules

1. **Only the tagged bot replies.** Untagged bots stay silent.
2. **When nobody is tagged**, CoS sends **one** routing message (who should pick it up, and why). Nobody else replies.
3. **Approvals happen only in the room**, in exactly this form:
   - `מאשר G0` / `מאשר G1` / `מאשר G2` — approves a gate.
   - `מאשר 1,3` — approves numbered decisions 1 and 3 from the board Issue.
   Anything else (a 👍, "looks good", a DM) is **not** an approval.
4. **Nobody sends Daniel terminal commands or localhost URLs.** Daniel only gets links: board Issue, Figma, Vercel preview, PR.
5. **One message per turn.** Combine status, links and questions into a single message.

> הערה: אין לשלוח לדניאל פקודות טרמינל או `localhost`. רק לינקים.

---

## 4. Definition of Done

A feature is done only when **all** are true:

- [ ] Vercel build is green and the PR has a working **preview link**.
- [ ] **QA PASS** on the preview (light + dark, desktop + 390px, every nav link), with screenshots.
- [ ] **PR Review approve** on the fork PR.
- [ ] **No unapproved dependencies** (any new package was a numbered decision approved with `מאשר N`).
- [ ] **No hardcoded `/studioOS` basePath** in source (no `"/studioOS/..."` strings; use imports / relative paths).
- [ ] **Stories** exist for every new component.
- [ ] All user-facing **strings come from `content/<feature>-copy.md`**.
- [ ] Daniel's **G2** (`מאשר G2`) is recorded in the Gate ledger.

---

## 5. Preview without terminal

Goal: Daniel reviews everything from a link. No local runs.

**One-time Vercel setup (done once by Daniel in the Vercel dashboard):**

1. Vercel → **Add New → Project → Import** `danielboaron23/studioOS` (the fork, not upstream).
2. Framework preset: **Next.js** (auto-detected). Leave build/output settings at their defaults.
3. **No environment variables.**
4. Project → Settings → **Deployment Protection** → turn **Vercel Authentication off for preview deployments**, so preview links open without a Vercel login.
5. Every push to any branch now gets a preview URL; Prototype posts it after each push.

### basePath — what `next.config.ts` actually does (verified 2026-10-26)

The intended rule is: **basePath `/studioOS` applies only when `GITHUB_PAGES=true`**; on Vercel the app is served from the domain root. That is **not yet true on the fork's `main`**:

- **Fork `main`** (`97e96c5`): `next.config.ts` is **unconditional**:
  ```ts
  const nextConfig: NextConfig = {
    output: "export",
    basePath: "/studioOS",
    images: { unoptimized: true },
  };
  ```
  So every build, including Vercel previews, is a static export served under `/studioOS`. A preview opened at `/` will 404; the app lives at `<preview-url>/studioOS`. The fork's `.github/workflows/deploy.yml` does not set `GITHUB_PAGES` either.
- **Upstream `hanigirl/studioOS` `main`** and the fork's **`feature/settings`** branch use the conditional version:
  ```ts
  const isGithubPages = process.env.GITHUB_PAGES === "true";
  const nextConfig: NextConfig = isGithubPages
    ? { output: "export", basePath: "/studioOS", images: { unoptimized: true } }
    : {};
  ```
  Here Vercel (no env var) gets a normal Next.js build at the domain root, and only the GitHub Pages workflow (which sets `GITHUB_PAGES=true`) gets the static export under `/studioOS`.

**Until the fork's `main` gets the conditional config** (by syncing with upstream or a small approved change by Prototype), QA and Daniel must open previews of branches based on fork `main` at `<preview-url>/studioOS`. Branches that carry the conditional config open at the root.

> הערה: ב-`main` של ה-fork ה-basePath קבוע (`/studioOS`) תמיד. רק ב-upstream וב-`feature/settings` הוא מותנה ב-`GITHUB_PAGES=true`.

---

## 6. Branch naming

| Branch | Owner | Purpose |
|---|---|---|
| `main` | — | Fork's default branch. Feature branches start here. |
| `feature/<name>` | studioOS Prototype | Feature code. One per feature. |
| `ui/<feature>` | studioOS Product Designer | `components/ui/**` + stories, after G1. |
| `team/<topic>` | CoS | Process docs and templates (like this file). |

Rules: lowercase, kebab-case (`feature/team-settings`, `ui/team-settings`). Copy lives in `content/<feature>-copy.md` on the feature branch. PRs target the fork's `main`; the single upstream PR to `hanigirl/studioOS` is opened only after G2.
