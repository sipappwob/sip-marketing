"use client";

import { useEffect } from "react";
import { ensureAuthPersistence } from "@/lib/firebase";

/** Sets Firebase Auth to local browser persistence on every admin route load. */
export function AuthPersistence() {
  useEffect(() => {
    ensureAuthPersistence().catch(() => {});
  }, []);
  return null;
}
