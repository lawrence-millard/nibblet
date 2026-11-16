"use client";

import { useEffect, useState } from "react";
import { StreamingText } from "./Component";

const response = "Sure. Imagine we are building a small component library: a place to discover an idea, try it out, and bring it into your project without rebuilding it from scratch. The experience starts with something simple: finding what you need and understanding how it works by seeing it in motion.\n\nWhen you open a component, the workspace splits into two areas. The preview sits on the left, with enough space to see every detail. Its controls appear on the right. You can change its appearance, adjust values, and compare the result immediately, all in the same place without losing context.\n\nIn this example, the response arrives in chunks, just like a conversation. Each new word starts at a low opacity and gradually becomes visible. Words you have already read keep their position and appearance: they do not animate again when more content arrives. If a chunk completes a partial word, its animation continues from where it left off.\n\nWhen several words arrive together, the reveal spaces them out slightly. This delay keeps the text flowing, but it has a limit so the animation never builds up an endless wait. You can keep reading while the response grows, whether you receive a short sentence or an explanation spanning several paragraphs.\n\nYou can also pause playback to inspect a particular moment. When you resume, the text continues from that point. Replay starts again from the beginning, while the settings let you explore how larger chunks or more frequent updates affect the experience. Content arrival and word fades are controlled independently.\n\nNow think of a longer response: a code review, a design proposal, or a step-by-step explanation. The goal is to let you start reading from the first lines without waiting for everything to finish. As new information appears, earlier content remains available to select, copy, or revisit.\n\nThe component keeps its styles inside its own folder. You can use it on a light page, in a dark chat, or inside an application with different typography. It does not need this library's styles to work. It receives the accumulated text and reveals new words using the same animation system.\n\nFinally, if you prefer reduced motion, the text appears immediately. The information stays the same and reading does not depend on an animation. You can try all these options here, edit this response, and copy the example with your chosen configuration.";

export default function Example() {
  const [text, setText] = useState("");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    // Local transport example. Replace this timer with your real stream.
    const characters = Array.from(response);
    let cursor = 0;
    let restart: ReturnType<typeof setTimeout> | undefined;
    setText("");
    const timer = setInterval(() => {
      cursor = Math.min(cursor + 6, characters.length);
      setText(characters.slice(0, cursor).join(""));
      if (cursor === characters.length) {
        clearInterval(timer);
        if (true) restart = setTimeout(() => setCycle((value) => value + 1), 2800);
      }
    }, 30);
    return () => { clearInterval(timer); clearTimeout(restart); };
  }, [cycle]);

  return <StreamingText text={text} streaming={text !== response}
    fadeDuration={1500} wordDelay={16}
    maxRevealLag={500} fontSize={16}
    appearance="dark" />;
}
