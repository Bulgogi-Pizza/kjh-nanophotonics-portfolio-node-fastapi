import React, {useEffect, useMemo, useRef, useState} from "react";

function HorizontalGallery({
  items = [],
  renderItem,
  className = "",
  itemClassName = "",
  ariaLabel = "Horizontal gallery",
  autoScroll = false,
  autoScrollSpeed = 20,    // px/sec
  pauseOnHover = false,
  loop = false,
  gapPx = 24,
  paddingX = 40,
  loopStrategy = "recycle", // "recycle" | "duplicate"
}) {
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);

  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const pausedRef = useRef(false);

  // 측정/스로틀용
  const cardOuterRef = useRef(320 + gapPx); // 카드폭 + gap
  const gapRef = useRef(gapPx);
  const measuringRef = useRef(false);

  const rebalanceRafRef = useRef(null);
  const isManualScrollingRef = useRef(false);

  const [hovered, setHovered] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const useRecycle = loop && loopStrategy === "recycle";
  const useDuplicate = loop && loopStrategy === "duplicate";
  const HEADROOM_RATIO = 0.45; // 왼쪽 여유를 이 비율 이상 유지

  // overflow 계산
  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) {
      return;
    }

    const measure = () => {
      const first = track.firstElementChild;
      if (!first) {
        return;
      }

      // 실제 카드 폭 측정 (+ gap 포함한 1장 외부폭)
      const rect = first.getBoundingClientRect();
      const outer = rect.width + gapPx;
      if (outer <= 0) {
        return;
      }

      cardOuterRef.current = outer;

      // 현재 화면에 동시에 들어갈 수 있는 카드 수
      const perView = Math.max(1,
          Math.floor((scroller.clientWidth + gapPx) / outer));
      // "넘침" 여부 = 아이템 개수 > 한 화면 카드 수
      const overflow = items.length > perView;

      setIsOverflowing(overflow);
    };

    // 첫 측정 + 이미지 로딩 지연 대비 재측정
    const id1 = requestAnimationFrame(measure);
    const id2 = setTimeout(measure, 200);

    const onResize = () => {
      // 창 크기 바뀌면 다시 측정
      measure();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(id1);
      clearTimeout(id2);
      window.removeEventListener("resize", onResize);
    };
  }, [items.length, gapPx, paddingX, itemClassName, className]);

  const effectiveLoop = loop && isOverflowing;

  // (duplicate 전략에서만) 2배 렌더
  const renderItems = useMemo(() => {
    if (!(useDuplicate && effectiveLoop)) {
      return items.map((it, idx) => ({it, key: it.id ?? idx}));
    }
    const doubled = [...items, ...items];
    return doubled.map((it, idx) => ({
      it,
      key: `${it.id ?? idx}-${idx < items.length ? "a" : "b"}`,
    }));
  }, [items, useDuplicate, effectiveLoop]);

  // 실제 렌더 기준 측정
  const measure = () => {
    if (measuringRef.current) {
      return;
    }
    measuringRef.current = true;
    try {
      const track = trackRef.current;
      const scroller = scrollerRef.current;
      const first = track?.firstElementChild;
      if (!first || !scroller) {
        return;
      }

      const cs = getComputedStyle(track);
      const cg = parseFloat(cs.columnGap || cs.gap || "0");
      if (!Number.isNaN(cg)) {
        gapRef.current = cg;
      }

      const rect = first.getBoundingClientRect();
      if (rect.width > 0) {
        cardOuterRef.current = rect.width + gapRef.current;
      }
    } finally {
      measuringRef.current = false;
    }
  };

  // 초기 시딩: 왼쪽으로 갈 헤드룸 확보
  const seedRecycleHeadroom = () => {
    if (!effectiveLoop || !useRecycle) {
      return;
    }
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const step = cardOuterRef.current;
    if (!scroller || !track || step <= 0) {
      return;
    }

    // 왼쪽 여유가 부족하면 마지막 카드를 앞으로 당겨와 여유 확보
    if (scroller.scrollLeft < step * HEADROOM_RATIO) {
      const last = track.lastElementChild;
      if (last) {
        const prev = scroller.style.scrollBehavior;
        scroller.style.scrollBehavior = "auto";
        track.insertBefore(last, track.firstElementChild);
        scroller.scrollLeft += step;
        scroller.style.scrollBehavior = prev || "auto";
      }
    }
  };

  // 렌더/리사이즈 후 측정 + 시딩
  useEffect(() => {
    const t = setTimeout(() => {
      measure();
      seedRecycleHeadroom(); // ← 추가: 리사이즈/초기에도 항상 왼쪽 여유 보장
    }, 60);
    const onResize = () => {
      clearTimeout(t);
      setTimeout(() => {
        measure();
        seedRecycleHeadroom(); // ← 리사이즈 때도 재시딩
      }, 60);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderItems.length, gapPx, itemClassName, effectiveLoop, useRecycle]);

  // Hover pause
  useEffect(() => {
    pausedRef.current = pauseOnHover && hovered;
  }, [hovered, pauseOnHover]);

  // 🔁 재활용 루프: 좌/우 모두 안정적으로 리밸런스
  const rebalanceRecycleFull = () => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const step = cardOuterRef.current;
    if (!scroller || !track || step <= 0) {
      return;
    }

    const prevBehavior = scroller.style.scrollBehavior;
    scroller.style.scrollBehavior = "auto";

    // 안전 가드
    let guard = Math.max(8, (items.length || 1) * 4);

    // 👉 오른쪽 진행: 왼쪽 카드들을 뒤로 이동
    while (scroller.scrollLeft >= step - 0.5 && guard-- > 0) {
      const first = track.firstElementChild;
      if (!first) {
        break;
      }
      scroller.scrollLeft -= step;
      track.appendChild(first);
    }

    // 👈 왼쪽 진행: "음수"까지 기다리지 말고, 헤드룸이 적으면 마지막 카드를 앞으로 이동
    guard = Math.max(8, (items.length || 1) * 4);
    const minHeadroom = step * HEADROOM_RATIO;
    while (scroller.scrollLeft <= minHeadroom && guard-- > 0) {
      const last = track.lastElementChild;
      if (!last) {
        break;
      }
      track.insertBefore(last, track.firstElementChild);
      scroller.scrollLeft += step;
    }

    scroller.style.scrollBehavior = prevBehavior || "auto";
  };

  // 스크롤 이벤트 → rAF로 스로틀하여 리밸런스
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const onScroll = () => {
      if (!rebalanceRafRef.current) {
        rebalanceRafRef.current = requestAnimationFrame(() => {
          rebalanceRafRef.current = null;
          if (useRecycle && effectiveLoop && !isManualScrollingRef.current) {
            rebalanceRecycleFull();
          }
        });
      }
    };

    el.addEventListener("scroll", onScroll, {passive: true});
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rebalanceRafRef.current) {
        cancelAnimationFrame(
            rebalanceRafRef.current);
      }
    };
  }, [effectiveLoop, useRecycle]);

  // 부드러운 스크롤 종료 감지 (rAF 폴링)
  const smoothScrollTo = (targetLeft, then) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const EPS = 0.8;
    const MAX_MS = 800;
    let last = scroller.scrollLeft;
    let still = 0;
    const start = performance.now();

    const probe = (ts) => {
      const now = scroller.scrollLeft;
      const done =
          Math.abs(now - targetLeft) <= EPS ||
          ts - start > MAX_MS ||
          (Math.abs(now - last) < 0.2 && ++still >= 3);

      last = now;
      if (done) {
        then?.();
      } else {
        requestAnimationFrame(probe);
      }
    };

    requestAnimationFrame(probe);
  };

  // 페이지 단위 스크롤 - 1카드씩
  const pageScroll = (dir = 1) => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const step = cardOuterRef.current;
    if (!scroller || !track || step <= 0) {
      return;
    }

    measure();

    isManualScrollingRef.current = true;
    const prevPause = pausedRef.current;
    pausedRef.current = true;

    // 왼쪽 누르기 직전 헤드룸 확보
    if (dir < 0 && effectiveLoop && useRecycle && scroller.scrollLeft < step
        * HEADROOM_RATIO + 0.5) {
      const last = track.lastElementChild;
      if (last) {
        const prev = scroller.style.scrollBehavior;
        scroller.style.scrollBehavior = "auto";
        track.insertBefore(last, track.firstElementChild);
        scroller.scrollLeft += step;
        scroller.style.scrollBehavior = prev || "auto";
      }
    }

    // 목표 위치
    const target = scroller.scrollLeft + (dir > 0 ? step : -step);

    scroller.style.scrollBehavior = "smooth";
    scroller.scrollTo({left: target, behavior: "smooth"});

    smoothScrollTo(target, () => {
      scroller.style.scrollBehavior = "auto";
      rebalanceRecycleFull();
      isManualScrollingRef.current = false;
      pausedRef.current = prevPause;
    });
  };

  // 자동 스크롤
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !autoScroll || prefersReduced || items.length === 0) {
      return;
    }

    lastTsRef.current = null;

    const tick = (ts) => {
      if (!scrollerRef.current) {
        return;
      }

      if (pausedRef.current || isManualScrollingRef.current) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const last = lastTsRef.current;
      lastTsRef.current = ts;

      if (last != null) {
        const dt = (ts - last) / 1000;
        scroller.scrollLeft += autoScrollSpeed * dt;

        if (effectiveLoop) {
          if (useDuplicate) {
            const {scrollLeft, scrollWidth, clientWidth} = scroller;
            const half = (scrollWidth - clientWidth) / 2;
            if (scrollLeft >= half) {
              scroller.scrollLeft = scrollLeft - half;
            }
          } else if (useRecycle) {
            rebalanceRecycleFull();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [autoScroll, autoScrollSpeed, prefersReduced, items.length, effectiveLoop,
    useDuplicate, useRecycle]);

  return (
      <div
          className={`relative ${className}`}
          aria-label={ariaLabel}
          onMouseEnter={() => pauseOnHover && setHovered(true)}
          onMouseLeave={() => pauseOnHover && setHovered(false)}
          style={{
            ["--gallery-pad2x"]: `${paddingX * 2}px`,
            ["--gallery-gap"]: `${gapRef.current}px`,
          }}
      >
        {/* Left */}
        <button
            type="button"
            aria-label="Scroll left"
            onClick={() => pageScroll(-1)}
            disabled={!isOverflowing}
            className={`absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-200 shadow ${
                !isOverflowing
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white dark:hover:bg-gray-700 transition-colors"
            }`}
        >
          ◀
        </button>

        {/* Track */}
        <div
            ref={scrollerRef}
            className="overflow-x-auto hide-scrollbar"
            style={{scrollBehavior: "auto"}}
        >
          <div
              ref={trackRef}
              className="flex py-2"
              style={{
                gap: `${gapPx}px`,
                paddingInline: `${paddingX}px`,
              }}
          >
            {renderItems.map(({it, key}) => (
                <div
                    key={key}
                    className={`flex-shrink-0 ${itemClassName}`}
                    role="group"
                >
                  {renderItem(it)}
                </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <button
            type="button"
            aria-label="Scroll right"
            onClick={() => pageScroll(1)}
            disabled={!isOverflowing}
            className={`absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-200 shadow ${
                !isOverflowing
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white dark:hover:bg-gray-700 transition-colors"
            }`}
        >
          ▶
        </button>
      </div>
  );
}

export default HorizontalGallery;