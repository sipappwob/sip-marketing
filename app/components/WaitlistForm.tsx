"use client";

import { useState } from "react";
import { Button } from "./Button";

type Status = "idle" | "submitting" | "success";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    // Intentionally no backend yet — this is a placeholder for wiring later.
    setTimeout(() => setStatus("success"), 400);
  }

  if (status === "success") {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-full border border-cabernet/20 bg-ivory px-6 py-4 text-sm text-ink">
        You&apos;re on the list. We&apos;ll be in touch.
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          className="h-12 flex-1 rounded-full border border-hair bg-ivory px-5 text-sm text-ink placeholder:text-muted/80 focus-visible:border-cabernet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabernet/25"
        />
        <Button type="submit" variant="primary" className="h-12 px-6">
          {status === "submitting" ? "Sending…" : "Request access"}
        </Button>
      </form>
      <p className="mt-4 text-xs text-muted">
        No spam. One note when your city opens up.
      </p>
    </>
  );
}
