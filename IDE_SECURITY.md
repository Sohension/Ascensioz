# Python IDE Security Model

This document describes the security assumptions and guarantees for the
Python IDE's code execution feature.

## TL;DR

- User code is **never** executed inside the Next.js server process.
- Every run happens in a **fresh, isolated child Python process** with a
  private temp directory that is deleted after the run.
- The child process gets a **sanitized environment** (no secrets).
- A **hard timeout** kills the process tree.
- **Output and source sizes are bounded** so the browser and server never
  freeze.
- The child is spawned with `shell:false` and an **argument array** (not a
  shell string), so shell injection is not possible.

## Why not run in-process?

Running `exec()` or `vm` with user code in the Next.js server process would
let a user:

- Read environment variables / secrets of the server.
- Access the filesystem of the application host.
- Crash or hang the server.
- Consume unbounded CPU/memory.

Even a "simple" `exec("python -c " + code)` is unsafe because it can read
arbitrary files and environment variables, and can be abused to exhaust
resources.

## What the sandbox does

1. **Isolated temp project dir**

   A unique temp directory is created per run (`asci-ide-*`). All submitted
   files are written there. The directory is recursively removed when the
   process exits (success, error, timeout, or user stop).

2. **Sanitized environment**

   The child process receives a minimal environment:

   - Only non-sensitive variables are copied from the host.
   - Variables matching `/SECRET|TOKEN|KEY|PASSWORD|SUPABASE|DATABASE|JWT|AUTH|COOKIE/i`
     are **stripped**.
   - `PYTHONIOENCODING=utf-8`, `PYTHONUNBUFFERED=1`,
     `PYTHONDONTWRITEBYTECODE=1` are set for predictable output.

3. **Resource limits**

   - **Timeout**: default 10s, clamped to 1–30s by the API route. On timeout
     the process tree is force-killed.
   - **Source size**: max 256 KB total.
   - **Output size**: max 1 MB per stream (stdout/stderr). Exceeding this
     kills the process and marks the result as `truncated`.
   - **File count**: max 50 files.
   - **Path safety**: file names are validated to prevent path traversal
     (`..`, absolute paths, drive letters).

4. **Process-tree termination**

   - On Windows, `taskkill /PID <pid> /T /F` kills the whole tree (handles
     fork bombs / child processes).
   - On Unix, a negative PID signal (`process.kill(-pid)`) kills the whole
     process group.
   - The Stop endpoint calls the same kill routine.

5. **No shell**

   `spawn` is called with `shell:false` and an array of arguments, so user
   input can never be interpreted as shell syntax.

## Known limitations (please read)

- This is a **subprocess sandbox**, not a kernel/container sandbox. On a
  shared host, a determined user could potentially read non-sensitive
  environment variables or probe the filesystem the process can access.
- **Network access is not actively blocked.** The child process inherits the
  host network. If your deployment requires no network access, wrap the
  runner in a container/network namespace, or set an outbound firewall rule.
- There is **no per-process memory/CPU cgroup limit** without a container
  runtime. The timeout and output caps mitigate CPU/output abuse, but a
  container runtime (e.g. Docker with `--memory` / `--cpus`) is strongly
  recommended for untrusted multi-tenant deployments.
- The active-run registry is in-memory (single instance). For horizontal
  scaling, replace it with a shared store (Redis/DB).

## Recommended production hardening

1. Run the runner inside a container (Docker) with:
   - `--network none`
   - `--memory <limit>`
   - `--cpus <limit>`
   - `--pids-limit <limit>` (prevents fork bombs)
   - `--read-only` root filesystem
   - a non-root user
2. Put the runner behind an internal-only service and rate-limit the API.
3. Add per-user rate limiting / quotas.
4. Use a job queue if you expect high concurrency.

## API contract

`POST /api/python/run`

```json
{
  "files": { "main.py": "print('hi')", "utils.py": "def add(a,b): return a+b" },
  "entry": "main.py"
}
```

Response:

```json
{
  "runId": "uuid",
  "stdout": "hi\n",
  "stderr": "",
  "exitCode": 0,
  "executionTime": 0.42,
  "timedOut": false,
  "stopped": false,
  "truncated": false,
  "status": "success"
}
```

`POST /api/python/stop`

```json
{ "runId": "uuid" }
```

Response: `{ "ok": true }`
