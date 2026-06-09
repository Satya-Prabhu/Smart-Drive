import { useLayoutEffect, useRef } from "react";

export default function useFlip(containerRef, deps) {
  const rectsRef = useRef(new Map());

  const readPositions = () => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children);
    const rects = new Map();
    for (const child of children) {
      const id = child.dataset.id;
      if (id) rects.set(id, child.getBoundingClientRect());
    }
    rectsRef.current = rects;
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const children = Array.from(containerRef.current.children);
    const newRects = new Map();
    const invertTransforms = [];

    for (const child of children) {
      child.style.transform = "";
      child.style.transition = "";
    }

    for (const child of children) {
      const id = child.dataset.id;
      if (!id) continue;

      const rect = child.getBoundingClientRect();
      newRects.set(id, rect);

      const oldRect = rectsRef.current.get(id);
      if (oldRect) {
        const dx = oldRect.left - rect.left;
        const dy = oldRect.top  - rect.top;
        if (dx !== 0 || dy !== 0) {
          invertTransforms.push({ child, dx, dy });
        }
      }
    }

    rectsRef.current = newRects;

    for (const { child, dx, dy } of invertTransforms) {
      child.style.transform  = `translate(${dx}px, ${dy}px)`;
      child.style.transition = "none";
    }

    if (invertTransforms.length > 0) {
      let rafId2;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          for (const { child } of invertTransforms) {
            child.style.transform  = "";
            child.style.transition = "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
          }
        });
      });

      const handleTransitionEnd = (e) => {
        if (e.propertyName === "transform") {
          e.target.style.transition = "";
          e.target.style.transform  = "";
          e.target.removeEventListener("transitionend", handleTransitionEnd);
        }
      };

      for (const { child } of invertTransforms) {
        child.addEventListener("transitionend", handleTransitionEnd);
      }

      return () => {
        cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        for (const { child } of invertTransforms) {
          child.removeEventListener("transitionend", handleTransitionEnd);
        }
      };
    }
  }, [deps]);

  return readPositions;
}
