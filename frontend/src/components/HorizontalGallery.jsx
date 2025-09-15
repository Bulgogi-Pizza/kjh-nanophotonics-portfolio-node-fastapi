import React, {useEffect, useMemo, useRef, useState} from "react";

function HorizontalGallery({
  items = [],
  renderItem,
  className = "",
  itemClassName = "",
  ariaLabel = "Horizontal gallery",
  autoScroll = false,
  autoScrollSpeed = 20,
  pauseOnHover = false,
  loop = false,
}) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const dirRef = useRef(1);
  const pausedRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [shouldDuplicate, setShouldDuplicate] = useState(false);

  const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shouldAutoScroll = autoScroll && !prefersReduced && isOverflowing;

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.scrollLeft = 0;
    requestAnimationFrame(() => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      setIsOverflowing(overflow);
      setShouldDuplicate(loop && overflow);
    });
  }, [items, loop, itemClassName, className]);

  const effectiveLoop = loop && shouldDuplicate;

  const renderItems = useMemo(() => {
    if (!effectiveLoop) {
      return items.map(
          (it, idx) => ({it, key: it.id ?? idx}));
    }
    return items.map((it, idx) => ({
      it,
      key: `${it.id ?? idx}-${idx < items.length ? "a" : "b"}`,
    }));
  }, [items, effectiveLoop]);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const updateEdges = () => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (effectiveLoop) {
      setAtStart(false);
      setAtEnd(false);
      return;
    }
    const {scrollLeft, scrollWidth, clientWidth} = el;
    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    updateEdges();
    const el = ref.current;
    if (!el) {
      return;
    }
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, {passive: true});
    return () => el.removeEventListener("scroll", onScroll);
  }, [renderItems.length, effectiveLoop]);

  useEffect(() => {
    pausedRef.current = pauseOnHover && hovered;
  }, [hovered, pauseOnHover]);

  const scrollByPage = (dir = 1) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const amount = Math.max(el.clientWidth * 0.9, 320);
    el.scrollBy({left: amount * dir, behavior: "smooth"});
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldAutoScroll || items.length === 0) {
      return;
    }
    if (effectiveLoop) {
      el.scrollLeft = 0;
    }
    lastTsRef.current = null;
    dirRef.current = 1;

    const step = (ts) => {
      if (!ref.current) {
        return;
      }
      if (pausedRef.current) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      if (last != null) {
        const dt = (ts - last) / 1000;
        const delta = autoScrollSpeed * dt * (effectiveLoop ? 1
            : dirRef.current);
        el.scrollLeft += delta;
        const {scrollLeft, scrollWidth, clientWidth} = el;
        if (effectiveLoop) {
          const half = (scrollWidth - clientWidth) / 2 + 1;
          if (scrollLeft >= half) {
            el.scrollLeft = scrollLeft - half;
          }
        } else {
          if (scrollLeft + clientWidth >= scrollWidth - 1) {
            dirRef.current = -1;
          } else if (scrollLeft <= 0) {
            dirRef.current = 1;
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [shouldAutoScroll, autoScrollSpeed, effectiveLoop, items.length]);

  return (
      <div
          className={`relative ${className}`}
          aria-label={ariaLabel}
          onMouseEnter={() => pauseOnHover && setHovered(true)}
          onMouseLeave={() => pauseOnHover && setHovered(false)}
      >
        {/* Left */}
        <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            className={`absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-200 shadow ${atStart
                ? "opacity-40 cursor-not-allowed" : "hover:bg-white"}`}
        >
          ◀
        </button>

        {/* Track */}
        <div ref={ref} className="overflow-x-auto snap-x snap-mandatory"
             style={{scrollBehavior: "smooth"}}>
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-10 py-2">
            {renderItems.map(({it, key}) => (
                <div key={key}
                     className={`snap-start flex-shrink-0 ${itemClassName}`}
                     role="group">
                  {renderItem(it)}
                </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            className={`absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-200 shadow ${atEnd
                ? "opacity-40 cursor-not-allowed" : "hover:bg-white"}`}
        >
          ▶
        </button>
      </div>
  );
}

export default HorizontalGallery;