"use client";

import { useEffect, useState } from "react";
import styles from "./MessageThread.module.css";

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

const DEMO: Message[] = [
  {
    id: "1",
    from: "them",
    text: "Nibblet ships FREE MCP servers you can wire into Cursor in under a minute.",
    time: "10:02",
  },
  {
    id: "2",
    from: "me",
    text: "Remote URL or local npx — which is cleaner for demos?",
    time: "10:03",
  },
  {
    id: "3",
    from: "them",
    text: "Remote for shareable links. Local when you want offline tools and custom args.",
    time: "10:03",
  },
];

export function MessageThread() {
  const [typing, setTyping] = useState(true);
  const [messages, setMessages] = useState<Message[]>(DEMO.slice(0, 2));

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setTyping(false);
      setMessages(DEMO);
    }, 1600);
    const t2 = window.setTimeout(() => setTyping(true), 3200);
    const t3 = window.setTimeout(() => setTyping(false), 4800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return (
    <div className={styles.thread} role="log" aria-label="Message thread" aria-live="polite">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`${styles.row} ${m.from === "me" ? styles.rowMine : styles.rowTheirs}`}
        >
          <div
            className={`${styles.bubble} ${m.from === "me" ? styles.mine : styles.theirs}`}
          >
            {m.text}
          </div>
          <span className={styles.meta}>
            {m.from === "me" ? "You" : "Nibblet"} · {m.time}
          </span>
        </div>
      ))}
      {typing && (
        <div className={`${styles.row} ${styles.rowTheirs}`} aria-label="Nibblet is typing">
          <div className={styles.typing}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      )}
    </div>
  );
}
