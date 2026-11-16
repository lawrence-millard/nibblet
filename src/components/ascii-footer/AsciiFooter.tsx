import styles from "./AsciiFooter.module.css";

const MARK = `
 ███╗   ██╗██╗██████╗ ██████╗ ██╗     ███████╗████████╗
 ████╗  ██║██║██╔══██╗██╔══██╗██║     ██╔════╝╚══██╔══╝
 ██╔██╗ ██║██║██████╔╝██████╔╝██║     █████╗     ██║
 ██║╚██╗██║██║██╔══██╗██╔══██╗██║     ██╔══╝     ██║
 ██║ ╚████║██║██████╔╝██████╔╝███████╗███████╗   ██║
 ╚═╝  ╚═══╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝
`;

type Props = {
  caption?: string;
};

export function AsciiFooter({ caption = "Free MCP · charcoal & lime" }: Props) {
  return (
    <footer className={styles.footer} aria-label="Nibblet brand mark">
      <pre className={styles.pre} aria-hidden>
        {MARK.trimEnd()}
      </pre>
      <p className={styles.tag}>{caption}</p>
    </footer>
  );
}
