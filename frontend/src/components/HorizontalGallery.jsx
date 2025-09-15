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
  const cardOuterRef = useRef(360 + gapPx); // 카드 1장의 "외부폭"(=카드폭+gap)
  const rebalanceRafRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const useRecycle = loop && loopStrategy === "recycle";
  const useDuplicate = loop && loopStrategy === "duplicate";

  // overflow 측정
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = 0;
    requestAnimationFrame(() => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      setIsOverflowing(overflow);
    });
  }, [items, loop, loopStrategy, itemClassName, className, gapPx, paddingX]);

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

  // 카드 폭 측정 (첫 카드 기준) + 리사이즈 대응
  useEffect(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!first) {
      return;
    }

    const measure = () => {
      // layout read 1회
      const w = first.getBoundingClientRect().width;
      cardOuterRef.current = w + gapPx;
    };

    measure();

    // ResizeObserver로 첫 카드 크기 변화를 감지
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => measure());
      ro.observe(first);
    }

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) {
        ro.disconnect();
      }
    };
  }, [renderItems.length, gapPx]);

  // 가장자리 상태(비루프에서만 의미)
  const updateEdges = () => {
    const el = scrollerRef.current;
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

  // 스크롤 이벤트 → rAF로 스로틀하여 재배치/에지 업데이트
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const onScroll = () => {
      if (!rebalanceRafRef.current) {
        rebalanceRafRef.current = requestAnimationFrame(() => {
          rebalanceRafRef.current = null;
          if (useRecycle && effectiveLoop) {
            rebalanceRecycle();
          }
          updateEdges();
        });
      }
    };

    el.addEventListener("scroll", onScroll, {passive: true});
    return () => el.removeEventListener("scroll", onScroll);
  }, [effectiveLoop, useRecycle]);

  // Hover pause
  useEffect(() => {
    pausedRef.current = pauseOnHover && hovered;
  }, [hovered, pauseOnHover]);

  // 🔁 재활용 루프: 프레임당 필요한 만큼만 재배치(큰 이동에도 rAF 1회로 처리)
  const rebalanceRecycle = () => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const step = cardOuterRef.current;
    if (!scroller || !track || step <= 0) {
      return;
    }

    // 1) 오른쪽으로 지나간 카드들을 뒤로 보냄
    //    (여기서 while 대신 'passes' 계산으로 한번에 처리)
    let passes = Math.floor(scroller.scrollLeft / step);
    while (passes-- > 0) {
      const first = track.firstElementChild;
      if (!first) {
        break;
      }
      scroller.scrollLeft -= step; // layout write
      track.appendChild(first);    // DOM 이동 (최소화)
    }

    // 2) 왼쪽으로 갈 때는 스크롤이 0에 가까워지면 미리 한 장을 앞으로 당겨 헤드룸 확보
    //    (터치/휠로 빠르게 좌로 당길 때도 끊김 없이 이어짐)
    if (scroller.scrollLeft < 1) {
      const last = track.lastElementChild;
      if (last) {
        track.insertBefore(last, track.firstElementChild);
        scroller.scrollLeft += step;
      }
    }
  };

  // 페이지 단위 스크롤(보이는 카드 수 만큼 정확히 이동)
  const pageScroll = (dir = 1) => {
    const scroller = scrollerRef.current;
    const step = cardOuterRef.current;
    if (!scroller || step <= 0) {
      return;
    }

    const perView = Math.max(1, Math.round(scroller.clientWidth / step));

    if (useRecycle && effectiveLoop && dir < 0) {
      // 왼쪽 이동은 먼저 헤드룸 확보
      for (let i = 0; i < perView; i++) {
        const track = trackRef.current;
        const last = track?.lastElementChild;
        if (!last) {
          break;
        }
        track.insertBefore(last, track.firstElementChild);
        scroller.scrollLeft += step;
      }
    }

    // 부드러운 스크롤 중에는 자동 스크롤 잠깐 정지
    const prev = scroller.style.scrollBehavior;
    const prevPaused = pausedRef.current;
    pausedRef.current = true;
    scroller.style.scrollBehavior = "smooth";
    scroller.scrollLeft += dir * perView * step;

    window.setTimeout(() => {
      scroller.style.scrollBehavior = prev || "auto";
      pausedRef.current = prevPaused;
      if (useRecycle && effectiveLoop) {
        rebalanceRecycle(); // 마지막에 한 번 더 정리
      }
    }, 360);
  };

  // 자동 스크롤
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !autoScroll || prefersReduced || items.length
        === 0) {
      return;
    }

    lastTsRef.current = null;

    const tick = (ts) => {
      if (!scrollerRef.current) {
        return;
      }

      if (pausedRef.current) {
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
          if (useRecycle) {
            // 재활용 방식: 재배치로 무한 루프 유지
            rebalanceRecycle();
          } else if (useDuplicate) {
            // 중복 방식: 절반 지점에서 자연 리셋
            const {scrollLeft, scrollWidth, clientWidth} = scroller;
            const half = (scrollWidth - clientWidth) / 2 + 1;
            if (scrollLeft >= half) {
              scroller.scrollLeft = scrollLeft - half;
            }
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
    useRecycle, useDuplicate]);

  return (
      <div
          className={`relative ${className}`}
          aria-label={ariaLabel}
          onMouseEnter={() => pauseOnHover && setHovered(true)}
          onMouseLeave={() => pauseOnHover && setHovered(false)}
          style={{
            ["--gallery-pad2x"]: `${paddingX * 2}px`,
            ["--gallery-gap"]: `${gapPx}px`,
          }}
      >
        {/* Left */}
        <button
            type="button"
            aria-label="Scroll left"
            onClick={() => pageScroll(-1)}
            disabled={!isOverflowing}
            className={`absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 sm:p-2 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-200 shadow ${
                !isOverflowing ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white"
            }`}
        >
          ◀
        </button>

        {/* Track */}
        <div
            ref={scrollerRef}
            className="overflow-x-auto hide-scrollbar"
            style={{scrollBehavior: "auto"}} // 평상시 auto, 버튼/페이지 스크롤 시만 smooth
        >
          <div
              ref={trackRef}
              className="flex py-2"
              style={{
                gap: `var(--gallery-gap)`,
                paddingInline: `${paddingX}px`
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
                !isOverflowing ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white"
            }`}
        >
          ▶
        </button>
      </div>
  );
}

export default HorizontalGallery;