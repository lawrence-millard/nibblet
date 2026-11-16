"use client";

import { useState } from "react";
import {
  GlassButton,
  GlassInput,
  GlassSearch,
  GlassSlider,
  GlassSurface,
  GlassSwitch,
} from "./wrappers";
import styles from "./GlassShowcase.module.css";

export function GlassShowcase() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(62);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("free-mcp");

  return (
    <div className={styles.showcase} data-liquidglass-backdrop>
      <div className={styles.backdropArt} aria-hidden />
      <div className={styles.grid}>
        <div>
          <p className={styles.label}>Glass surface</p>
          <GlassSurface className={styles.panel}>
            <h3 className={styles.panelTitle}>Liquid glass</h3>
            <p className={styles.panelText}>
              Thin wrappers around @onlymoein/liquidglass — frosted panes with lime
              accents for FREE MCP.
            </p>
          </GlassSurface>
        </div>

        <div className={styles.row}>
          <p className={styles.label}>Buttons &amp; switch</p>
          <GlassButton variant="filled" tint="#c8f542">
            Install MCP
          </GlassButton>
          <GlassButton variant="glass" aria-label="Secondary action">
            Docs
          </GlassButton>
          <GlassSwitch
            aria-label="Enable remote MCP"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className={styles.row}>
          <p className={styles.label}>Slider</p>
          <div className={styles.sliderWrap}>
            <GlassSlider
              aria-label="Sync intensity"
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={100}
            />
          </div>
          <span className="font-mono text-sm text-fog">{volume}%</span>
        </div>

        <div className={styles.row}>
          <p className={styles.label}>Input &amp; search</p>
          <div className={styles.fieldWrap}>
            <GlassInput
              aria-label="Server name"
              value={name}
              onValueChange={setName}
              placeholder="Server id"
            />
          </div>
          <div className={styles.fieldWrap}>
            <GlassSearch
              aria-label="Search MCPs"
              value={query}
              onValueChange={setQuery}
              placeholder="Search free MCPs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
