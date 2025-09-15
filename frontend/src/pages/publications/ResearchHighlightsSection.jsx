import React, {useEffect, useState} from "react";
import HorizontalGallery from "../../components/HorizontalGallery";
import {useNavigate} from "react-router-dom";

const isExternal = (href = "") =>
    /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith(
        "tel:");

function useCardLink() {
  const nav = useNavigate();
  const openLink = (link) => {
    if (!link) {
      return;
    }
    if (isExternal(link)) {
      window.open(link, "_blank", "noopener");
    } else {
      nav(link.startsWith("/") ? link : `/${link}`);
    }
  };
  const keyActivate = (e, link) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLink(link);
    }
  };
  return {openLink, keyActivate};
}

export default function ResearchHighlightsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {openLink, keyActivate} = useCardLink();

  useEffect(() => {
    fetch("/api/research-highlights/?active_only=1")
    .then(r => r.json())
    .then(d => {
      setItems(d || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) {
    return null;
  }

  return (
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Research Highlights
          </h2>
        </div>

        <HorizontalGallery
            items={items}
            ariaLabel="Research Highlights"
            loop
            loopStrategy="recycle"
            autoScroll
            autoScrollSpeed={16}
            pauseOnHover
            gapPx={16}
            paddingX={24}
            itemClassName="
          w-[calc((100vw-var(--gallery-pad2x)-2*var(--gallery-gap))/3)]
          md:w-[calc((100vw-var(--gallery-pad2x)-3*var(--gallery-gap))/4)]
          lg:w-[calc((100vw-var(--gallery-pad2x)-4*var(--gallery-gap))/5)]
          max-w-[420px]
        "
            renderItem={(item) => (
                <div
                    role={item.link ? "link" : undefined}
                    tabIndex={item.link ? 0 : -1}
                    onClick={() => item.link && openLink(item.link)}
                    onKeyDown={(e) => item.link && keyActivate(e, item.link)}
                    className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow transition ${
                        item.link ? "hover:shadow-md cursor-pointer"
                            : "cursor-default"
                    }`}
                >
                  {/* 20:13 비율 */}
                  <div style={{aspectRatio: "20 / 13"}}>
                    <img
                        src={item.image_path}
                        alt={item.alt_text || item.description
                            || "Research highlight"}
                        className="w-full h-full object-cover block"
                        loading="lazy"
                    />
                  </div>

                  {item.description && (
                      <div
                          className="p-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-h-[44px] sm:min-h-[56px]">
                        {item.description}
                      </div>
                  )}
                </div>
            )}
        />
      </section>
  );
}