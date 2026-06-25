import { cookies } from "next/headers";

const COOKIE_NAME = "vcg_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

export async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME);
  if (existing?.value) return existing.value;

  const id = crypto.randomUUID();
  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return id;
}

export async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}
