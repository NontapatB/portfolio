"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        const el = document.getElementById("email");
        if (el) getSelection()?.selectAllChildren(el);
      },
    );
  };
  return (
    <button className="copy" type="button" onClick={copy}>
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
