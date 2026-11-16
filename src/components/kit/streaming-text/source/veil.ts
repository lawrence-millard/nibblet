/** React/DOM port of ClyraADE crates/ui/src/markdown/veil.rs. */
export const CLYRA_STREAM_DEFAULTS = {
  fadeDuration: 1500,
  wordDelay: 16,
  maxRevealLag: 500,
  easing: "cubic-bezier(0.42, 0, 0.58, 1)",
} as const;

export type RevealWord = { start: number; end: number; started: number };
export type VeilOptions = { fadeDuration: number; wordDelay: number; maxRevealLag: number };

function commonPrefix(a: string, b: string) {
  let offset = 0;
  for (const character of a) {
    if (!b.startsWith(character, offset)) break;
    offset += character.length;
  }
  return offset;
}

export class WordVeil {
  previous = "";
  private words: RevealWord[] = [];
  private nextReveal: number | null = null;

  seed(text: string) {
    this.previous = text;
    this.words = [];
    this.nextReveal = null;
  }

  advance(text: string, now: number, options: VeilOptions): RevealWord[] {
    if (text !== this.previous) {
      const prefix = commonPrefix(this.previous, text);
      this.words = this.words.map((word) => ({ ...word, end: Math.min(word.end, prefix) })).filter((word) => word.start < word.end);
      if (prefix < this.previous.length) this.nextReveal = this.words.at(-1)?.started ?? null;
      let offset = prefix;
      let extendsWord = prefix === this.previous.length && /\S$/u.test(this.previous);
      const ranges: { start: number; end: number }[] = [];
      for (const token of text.slice(prefix).match(/\S+\s*|\s+/gu) ?? []) {
        const end = offset + token.length;
        const whitespace = /^\s+$/u.test(token);
        const last = this.words.at(-1);
        if (last && last.end === offset && (whitespace || extendsWord)) last.end = end;
        else if (!whitespace) ranges.push({ start: offset, end });
        extendsWord = false;
        offset = end;
      }
      if (ranges.length) {
        const ceiling = now + Math.max(0, options.maxRevealLag);
        const start = Math.min(ceiling, Math.max(now, this.nextReveal ?? now));
        const gap = Math.min(Math.max(0, options.wordDelay), (ceiling - start) / ranges.length);
        ranges.forEach((range, index) => this.words.push({ ...range, started: start + index * gap }));
        this.nextReveal = start + ranges.length * gap;
      }
      this.previous = text;
    }
    this.words = this.words.filter((word) => now - word.started < options.fadeDuration);
    return this.words.map((word) => ({ ...word }));
  }
}
