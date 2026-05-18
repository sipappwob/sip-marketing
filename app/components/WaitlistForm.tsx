"use client";

import { useState } from "react";
import { Button } from "./Button";

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res
          .json()
          .catch(() => ({}) as { error?: string });
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-full border border-cabernet/20 bg-ivory px-6 py-4 text-sm text-ink">
        {`You're on the list. We'll be in touch.`}
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
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          disabled={status === "submitting"}
          className="h-12 flex-1 rounded-full border border-hair bg-ivory px-5 text-sm text-ink placeholder:text-muted/80 focus-visible:border-cabernet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabernet/25 disabled:opacity-60"
        />
        <Button
          type="submit"
          variant="primary"
          className="h-12 px-6"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Request access"}
        </Button>
      </form>
      {status === "error" && errorMessage ? (
        <p className="mt-3 text-xs text-cabernet">{errorMessage}</p>
      ) : (
        <p className="mt-4 text-xs text-muted">
          No spam. One note when your city opens up.
        </p>
      )}
    </>
  );
}
