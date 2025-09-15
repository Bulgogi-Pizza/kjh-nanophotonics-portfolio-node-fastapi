import React, {useEffect, useState} from "react";
import HorizontalGallery from "../components/HorizontalGallery";
import {useNavigate} from "react-router-dom";

const normalizeLink = (href = "") => {
  if (!href) {
    return "";
  }
  const t = href.trim();
  if (/^mailto:|^tel:/i.test(t)) {
    return t;
  }
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  if (t.startsWith("//")) {
    return `${window.location.protocol}${t}`;
  }
  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(t)) {
    return `https://${t}`;
  }
  return t;
};
const isExternal = (href = "") =>
    /^https?:\/\//i.test(normalizeLink(href)) || /^mailto:|^tel:/i.test(
        href.trim());

function useCardLink() {
  const nav = useNavigate();
  const openLink = (link) => {
    if (!link) {
      return;
    }
    const target = normalizeLink(link);
    if (isExternal(target)) {
      window.open(target, "_blank", "noopener");
    } else {
      nav(target.startsWith("/") ? target : `/${target}`);
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

export default function CoverArtsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {openLink, keyActivate} = useCardLink();

  useEffect(() => {
    fetch("/api/cover-arts/?active_only=1")
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
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div
            className="relative container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 py-10 sm:py-12 max-w-[2000px]">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Cover
              Arts
            </h2>
          </div>

          <HorizontalGallery
              items={items}
              ariaLabel="Cover Arts"
              itemClassName="
            w-[calc((100vw-80px-72px)/3)]
            sm:w-[calc((100vw-80px-96px)/4)]
            md:w-[calc((100vw-80px-120px)/5)]
          "
              autoScroll
              autoScrollSpeed={16}
              pauseOnHover
              loop
              renderItem={(item) => (
                  <div
                      role={item.link ? "link" : undefined}
                      tabIndex={item.link ? 0 : -1}
                      onClick={() => item.link && openLink(item.link)}
                      onKeyDown={(e) => item.link && keyActivate(e, item.link)}
                      className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow transition ${
                          item.link ? "hover:shadow-md cursor-pointer"
                              : "cursor-default"
                      }`}
                  >
                    {/* 비율 고정: 3:4 */}
                    <div style={{aspectRatio: "3 / 4"}}>
                      <img
                          src={item.image_path}
                          alt={item.alt_text || item.description
                              || `${item.journal} cover art`}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                      />
                    </div>
                  </div>
              )}
          />
        </div>
      </section>
  );
}