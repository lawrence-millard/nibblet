"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { NotionMentionLink } from "@/components/unlumen-ui/notion-mention-link";

interface NotionMentionLinkDemoProps {
  showPreview?: boolean;
  previewWidth?: number;
  previewHeight?: number;
}

export function NotionMentionLinkDemo({
  showPreview = true,
  previewWidth = 360,
  previewHeight = 160,
}: NotionMentionLinkDemoProps) {
  const [value, setValue] = React.useState("desengs.com");
  const [previewUrl, setPreviewUrl] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreviewUrl(value.trim());
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [value]);

  return (
    <div className="flex min-h-[520px] w-full items-start justify-center px-6 py-24">
      <div className="flex w-full max-w-2xl flex-col items-start gap-5 text-left">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Website URL"
          spellCheck={false}
          style={{ width: `${Math.max(value.length + 1, 12)}ch` }}
          className="h-auto max-w-full rounded-none border-0 bg-transparent p-0 text-xl text-muted-foreground underline decoration-muted-foreground/45 underline-offset-2 shadow-none outline-none focus-visible:ring-0"
        />
        <NotionMentionLink
          key={previewUrl}
          url={previewUrl}
          showPreview={showPreview}
          previewWidth={previewWidth}
          previewHeight={previewHeight}
        />
      </div>
    </div>
  );
}

export default NotionMentionLinkDemo;
