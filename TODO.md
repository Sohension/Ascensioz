# Python IDE Implementation

## Backend (Python Runner)
- [x] Create shared types (`lib/python/types.ts`)
- [x] Create secure subprocess runner (`lib/python/runner.ts`)
- [x] Create `/api/python/run` route
- [x] Create `/api/python/stop` route
- [x] Write `IDE_SECURITY.md` documenting security

## Frontend (IDE Components)
- [x] Editor component (Monaco, Python theme, shortcuts)
- [x] FileExplorer component (tree + CRUD + drawer on mobile)
- [x] EditorTabs component (tabs + unsaved dot)
- [x] Toolbar component (Run/Stop/Save)
- [x] Terminal component (output panel)
- [x] StatusBar component
- [x] PythonIDE orchestrator + responsive layout
- [x] `/ide` page
- [x] Persistence helpers + shortcuts helper

## Integration
- [x] Hide app nav on `/ide`
- [x] Verify build passes

## Testing
- [x] Basic Python, variables, loops, errors, timeout, multi-file, large output
- [x] Python runner verified end-to-end (real stdout/stderr/exit codes)
- [x] Fixed Windows Store Python ENOENT via interpreter resolver

## Upgrade 2024 (File Explorer + Mobile)
- [x] FileExplorer: proper expanding folder tree (files nest under "my-project", chevron rotation, sticky folder header, subfolder grouping)
- [x] Editor: mobile-aware larger font (16px), no minimap on small screens, word wrap + line-number off on touch
- [x] Toolbar: always-visible Run/Stop text label + mobile terminal toggle button
- [x] PythonIDE: toggle-able mobile bottom terminal sheet (slim bar when collapsed)
- [x] StatusBar/Terminal stay consistent on mobile
- [x] Verify build passes (compiled + TypeScript passed, /ide route built)

