Title: feat: sync sadia-Frontend → dev (UI + routing + saved jobs)

Summary:
Merge `sadia-Frontend` changes into `dev`. This branch adds frontend improvements: normalized job ID usage, protected routes with role checks, Dashboard UI, Saved Jobs page, JobCard fixes, and routing updates. Backend remained unchanged.

Changes included:
- `frontend/src/App.jsx`: Added routes for jobs, saved jobs, admin, and fallback.
- `frontend/src/components/JobCard.jsx`: Normalized `job._id || job.id`, save/remove fixes.
- `frontend/src/components/ProtectedRoute.jsx`: Added `role` prop handling.
- `frontend/src/pages/*`: Dashboard, SavedJobs, Login, Register improvements and error fallbacks.
- `frontend/services/api.js`: Axios base URL and auth token attachment.

Testing performed:
- `git fetch` + merge from `origin/dev` (no conflicts).
- `cd frontend && npm run build` — Vite build succeeded.
- Backend checked for reachability locally.

Notes for reviewer:
- Backend `PUT`/`DELETE` job endpoints are not implemented yet; admin UI changes are frontend-only.
- `.env` contains local secrets and is excluded from git.

Suggested PR checklist:
- [ ] Run frontend locally and smoke-test pages (Login/Register/Jobs/Saved Jobs/Dashboard).
- [ ] Verify authentication flows with local backend.
- [ ] Confirm no sensitive data in commits.

Command to open PR with GitHub CLI (if available):

```bash
gh pr create --base dev --head sadia-Frontend --title "feat: sync sadia-Frontend → dev (UI + routing + saved jobs)" --body-file PR_DRAFT.md
```

If you want, I can run the `gh pr create` command for you (requires `gh` configured).