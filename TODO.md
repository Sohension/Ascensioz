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

## IDE Upgrades
- [x] File Explorer folder expansion (files nest under "my-project")
- [x] Mobile compatibility (touch-friendly editor, always-visible Run/Stop, toggle-able terminal sheet)

## Integration
- [x] Hide app nav on `/ide`
- [x] Verify build passes

## Testing
- [x] Basic Python, variables, loops, errors, timeout, multi-file, large output
- [x] Python runner verified end-to-end (real stdout/stderr/exit codes)
- [x] Fixed Windows Store Python ENOENT via interpreter resolver

# Friends / Chat Page (Supabase Realtime)

## Database / migration
- [x] Enable Realtime on existing `messages` + `friendships` tables (publication)
- [x] Add conversation indexes + RLS helper function
- [x] Reuse existing `messages`/`friendships` tables and RLS policies (no duplicates)

## Chat UI
- [x] Two-column responsive layout (search + conversation list | chat)
- [x] Friend search with results + "Message" action
- [x] Conversation list with last-message preview + timestamps
- [x] Chat window (header, message bubbles, timestamps, input, send)
- [x] Auto-scroll to newest message
- [x] Loading / error / empty states
- [x] Mobile: list ↔ chat pane switching with back button

## Supabase Realtime
- [x] Client-side channel subscription for live messages
- [x] Subscribe/unsubscribe when conversation opens/closes
- [x] Messages persisted via existing API routes (history survives refresh)
- [x] Realtime connection status indicator (Live / Connecting / Offline)

## Verification
- [x] Run `npm run build` to confirm compilation
