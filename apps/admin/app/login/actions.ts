"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!process.env.ADMIN_ACCESS_CODE || code !== process.env.ADMIN_ACCESS_CODE) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const store = await cookies();
  store.set("basirah_admin_session", code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next);
}
