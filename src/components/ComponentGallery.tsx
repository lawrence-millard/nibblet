import styles from "./ComponentGallery.module.css";

const ITEMS = [
  {
    id: "mcp-installer",
    name: "MCP Installer",
    description: "Hero tabs, remote/local toggle, JSON + command copy, connection states.",
  },
  {
    id: "glass",
    name: "Glass",
    description: "Liquid glass surface, button, switch, slider, input, and search wrappers.",
  },
  {
    id: "activity-island",
    name: "Activity Island",
    description: "Morphing capsule across timer, playing, call, and MCP sync.",
  },
  {
    id: "status-picker",
    name: "Status Picker",
    description: "Orb + emoji status that unfolds into a picker.",
  },
  {
    id: "search-input",
    name: "Search Input",
    description: "Expanding search pill with Ctrl/Cmd+K and Escape clear.",
  },
  {
    id: "buttons",
    name: "Nibblet Button",
    description: "Primary, secondary, icon, and loading variants.",
  },
  {
    id: "otp-input",
    name: "OTP Input",
    description: "Six-digit code with paste support and verified merge state.",
  },
  {
    id: "merge-conflicts",
    name: "Merge Conflicts",
    description: "Mini PR conflict UI with resolve actions and checks.",
  },
  {
    id: "message-thread",
    name: "Message Thread",
    description: "Chat bubbles and typing indicator about free MCPs.",
  },
  {
    id: "ascii-footer",
    name: "ASCII Footer",
    description: "Monospace brand mark for Nibblet.",
  },
  {
    id: "morph-dialog",
    name: "Morph Dialog",
    description: "Shared-layout expand from trigger into a dialog.",
  },
  {
    id: "verse-text",
    name: "Verse Text",
    description: "Word-by-word reveal with reduced-motion safety.",
  },
  {
    id: "unlumen",
    name: "Unlumen Free",
    description:
      "Full free @unlumen-ui registry gallery (no license / no .env).",
  },
] as const;

export function ComponentGallery() {
  return (
    <nav className={styles.gallery} aria-label="Component gallery">
      {ITEMS.map((item) => (
        <a
          key={item.id}
          href={item.id === "unlumen" ? "/unlumen" : `#${item.id}`}
          className={styles.card}
        >
          <span className={styles.name}>{item.name}</span>
          <p className={styles.desc}>{item.description}</p>
          <span className={styles.anchor}>
            {item.id === "unlumen" ? "/unlumen" : `#${item.id}`}
          </span>
        </a>
      ))}
    </nav>
  );
}
