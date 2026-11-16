"use client";

import { useRef, useState, type ReactNode } from "react";
import { MorphSurface, type MorphOrigin } from "./morph-surface";
import styles from "./morph-dialog.module.css";

export function MorphDialog({ trigger = "Open dialog", title, description, children, className, triggerClassName }: {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const origin = useRef<MorphOrigin | null>(null);
  return <>
    <button type="button" className={`${styles.trigger} ${triggerClassName || ""}`} aria-haspopup="dialog" aria-expanded={open}
      onClick={event => {
        const trigger = event.currentTarget;
        origin.current = { element: trigger, trigger, rect: trigger.getBoundingClientRect(), keyboard: event.detail === 0 };
        setOpen(true);
      }}>{trigger}</button>
    {open && <MorphSurface title={title} description={description} origin={origin.current} close={() => setOpen(false)} className={className}>
      <div className={styles.body}>
        <h3>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </MorphSurface>}
  </>;
}
