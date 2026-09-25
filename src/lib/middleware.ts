// Authentication/session middleware completely disabled.
//
// This function intentionally does nothing.
// It is kept only so existing imports of updateSession
// do not break.

export async function updateSession() {
  return undefined;
}
