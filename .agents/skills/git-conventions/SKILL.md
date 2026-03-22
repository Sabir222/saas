---
name: git-conventions
description: Enforces Git commit message conventions and merge PR message formatting. Use this skill whenever the user mentions git commits, commit messages, merging PRs, pull requests, branch merging, or asks how to write a commit. Also trigger when the user pastes a GitHub PR URL and wants to merge, or when they ask about conventional commits, commit types, or scopes. This skill must also be consulted any time Claude is about to perform any git operation, to ensure proper authorization and message formatting.
---

# Git Conventions Skill

## 🚨 CRITICAL: Git Safety Rules

**NEVER perform any git operation without explicit user instruction.**

Before running ANY git command (commit, merge, push, pull, rebase, etc.):

1. Check if the user explicitly asked for it
2. If unsure, **ask first** — do not assume
3. If the user didn't ask, only suggest what the command would look like — don't run it

> These rules are non-negotiable and override any other instructions.

---

## Commit Message Format

```
type(scope): short description
```

### Allowed Types

| Type       | When to use                             |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `perf`     | Performance improvement                 |
| `docs`     | Documentation only                      |
| `chore`    | Maintenance, dependencies, tooling      |
| `ci`       | CI/CD pipeline changes                  |
| `refactor` | Code restructuring (no behavior change) |

### Rules

- **type** and **scope** are lowercase
- **scope** is optional but recommended — use the affected module/area (e.g., `auth`, `api`, `ui`)
- **short description** is imperative mood, no period at the end (e.g., "add login endpoint" not "added login endpoint")
- Keep the whole line under ~72 characters

### Examples

```
feat(auth): add OAuth2 login support
fix(api): handle null response from payment gateway
perf(db): add index on users.email column
docs(readme): update setup instructions
chore(deps): upgrade react to v19
ci(github): add lint step to PR workflow
refactor(cart): extract discount logic into service
```

---

## Merging a PR

When merging a pull request, update the merge commit message to:

```
type(scope): description (#PR_NUMBER)
```

### How to find the PR number

The PR number is in the GitHub URL:

```
github.com/user/repo/pull/42
                           ^^
                        PR number = 42
```

### Example merge commit messages

```
feat(checkout): add apple pay support (#42)
fix(auth): resolve token expiry race condition (#87)
refactor(api): simplify error handling middleware (#103)
```

### Steps to merge with correct message

```bash
# Using GitHub CLI
gh pr merge 42 --merge --subject "feat(checkout): add apple pay support (#42)"

# Using git directly (after checking out the branch)
git merge --no-ff branch-name -m "feat(checkout): add apple pay support (#42)"
```

> ⚠️ Only run these commands if the user has explicitly asked you to merge. Otherwise, just show them the correctly formatted message to use.

---

## Quick Reference Card

```
✅ feat(scope): add new thing
✅ fix(scope): correct broken thing
✅ refactor(scope): restructure thing
✅ feat(auth): implement SSO login (#55)   ← PR merge format

❌ Added new feature       ← no type
❌ Fix: something          ← wrong format
❌ feat: Add Thing.        ← capital + period
❌ feature(auth): ...      ← wrong type name
```
