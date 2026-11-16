"use client";

import { Check } from "lucide-react";
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import styles from "./OtpInput.module.css";

const LENGTH = 6;

type Props = {
  onComplete?: (code: string) => void;
  expected?: string;
};

export function OtpInput({ onComplete, expected = "424242" }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [verified, setVerified] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const apply = (next: string[]) => {
    setDigits(next);
    const code = next.join("");
    if (code.length === LENGTH && next.every(Boolean)) {
      const ok = code === expected;
      setVerified(ok);
      if (ok) onComplete?.(code);
    } else {
      setVerified(false);
    }
  };

  const setAt = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    apply(next);
    if (char && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    apply(next);
    const focusAt = Math.min(pasted.length, LENGTH - 1);
    refs.current[focusAt]?.focus();
  };

  return (
    <div className={`${styles.root} ${verified ? styles.verified : ""}`}>
      <div className={styles.row} role="group" aria-label="One-time passcode">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={styles.cell}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={d}
            aria-label={`Digit ${i + 1}`}
            disabled={verified}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {verified ? (
        <div className={styles.merge} role="status">
          <Check size={14} aria-hidden /> Verified — slots merged
        </div>
      ) : (
        <p className={styles.hint}>Paste or type 6 digits (demo: {expected})</p>
      )}
    </div>
  );
}
