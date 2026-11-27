"use client";
import { looks, number } from "@/lib/collection";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
export default function Account({ signup = false }: { signup?: boolean }) {
  const [visible, setVisible] = useState(false),
    [message, set] = useState(""),
    [error, setError] = useState("");
  return (
    <div className="account-shell">
      <div className="account-print">
        {looks.map((look, i) => (
          <figure key={look.id}>
            <Image
              src={look.image}
              fill
              sizes="(max-width:650px) 24vw, 22vw"
              alt={look.name}
            />
            <figcaption>
              {number(i)} / {look.name}
            </figcaption>
          </figure>
        ))}
      </div>
      <section className="standard account">
        <p className="mono">RTW / DEMO ACCOUNT</p>
        <h1>
          {signup ? "Sign up" : "Log in"}
          <i>.</i>
        </h1>
        <p>
          Use fictional details for this classroom demo. Entries stay in this
          form.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget,
              data = new FormData(form);
            if (signup && data.get("password") !== data.get("confirm")) {
              setError("Passwords must match.");
              return;
            }
            form.reset();
            setVisible(false);
            setError("");
            set(signup ? "Demo signup complete." : "Demo login complete.");
          }}
          onChange={() => {
            set("");
            setError("");
          }}
        >
          <Field>
            <FieldLabel htmlFor="email">Demo email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              placeholder="student@example.test"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">
              Demo password (8+ characters)
            </FieldLabel>
            <Input
              id="password"
              name="password"
              type={visible ? "text" : "password"}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </Field>
          <button
            type="button"
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? "Hide" : "Show"} password
          </button>
          {signup && (
            <Field>
              <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
              <Input
                id="confirm"
                name="confirm"
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!error}
                aria-describedby="error"
                required
              />
            </Field>
          )}
          <div id="error" role="alert">
            {error}
          </div>
          <Button className="action">
            {signup ? "Create demo account" : "Demo login"}
          </Button>
          <div role="status">{message}</div>
        </form>
        <Link href={signup ? "/login" : "/signup"}>
          {signup ? "Go to login" : "Create an account"}
        </Link>
      </section>
    </div>
  );
}
