---
title: "How this site ships almost no JavaScript"
description: "Why I built my portfolio with Astro islands, and what actually hydrates."
date: 2026-07-12
---

This site is built with Astro, and the choice was deliberate: a portfolio is almost entirely static content, so shipping a full React bundle to render text and links would be waste. Astro renders everything to plain HTML at build time and only hydrates the specific components that genuinely need JavaScript.

On this site, exactly two things hydrate:

- The theme toggle, because it reads and writes `localStorage` and flips a `data-theme` attribute on the root element.
- The resume modal, because opening a dialog, trapping focus, and locking body scroll are inherently client-side behaviors.

Everything else, the navigation, the project cards, these note pages, is zero-JavaScript HTML and CSS.

Two details I liked solving:

**No flash of the wrong theme.** Theme preference lives in `localStorage`, but if you wait for a framework to boot before applying it, dark-mode users get a white flash on every load. The fix is a tiny inline script as the literal first child of `head` that sets `data-theme` before the browser paints anything. All colors are CSS custom properties scoped to that attribute, so the theme applies with no re-render at all.

**Modals without a modal library.** The resume viewer is a small React island using `createPortal` to render at `document.body`. Escape closes it, clicks on the backdrop close it, focus is trapped inside while it is open and restored to the trigger button when it closes. It turned out to need about 100 lines, which is a good reminder of how much of a dependency's weight goes to problems you do not have.

The takeaway: islands architecture is not about avoiding JavaScript on principle. It is about paying for interactivity only where interactivity exists.
