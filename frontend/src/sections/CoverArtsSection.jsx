import React, {useEffect, useState} from "react";
import HorizontalGallery from "../components/HorizontalGallery";
import {useNavigate} from "react-router-dom";

// 외부/내부 링크 판별 + 보정
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
  return t; // 내부 경로로 취급
};
const isExternal = (href = "") =>
    /^https?:\/\//i.test(normalizeLink(href)) || /^mailto:|^tel:/i.test(
        href.trim());

function useCardLink() {
  const navigate = useNavigate();
  const openLink = (link) => {
    if (!link) {
      return;
    }
    const target = normalizeLink(link);
    if (isExternal(target)) {
      window.open(target, "_blank", "noopener");
    } else {
      navigate(target.startsWith("/") ? target : `/${target}`);
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
    .then((r) => r.json())
    .then((data) => {
      setItems(data || []);
      setLoading(false);
    })
    .catch((e) => {
      console.error("Cover arts fetch error:", e);
      setLoading(false);
    });
  }, []);

  if (loading || items.length === 0) {
    return null; // 데이터 없으면 홈에서 섹션 감춤
  }

  return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Cover Arts
            </h2>
            {/* 필요하면 전체보기 링크 추가 가능:
          <Link to="/publications#cover-arts" className="text-blue-600">See all</Link> */}
          </div>

          <HorizontalGallery
              items={items}
              ariaLabel="Cover Arts"
              itemClassName="w-[360px]"
              autoScroll
              autoScrollSpeed={18}
              pauseOnHover
              loop
              renderItem={(item) => (
                  <div
                      role={item.link ? "link" : undefined}
                      tabIndex={item.link ? 0 : -1}
                      aria-label={item.link ? `${item.description || "open"}`
                          : undefined}
                      onClick={() => item.link && openLink(item.link)}
                      onKeyDown={(e) => item.link && keyActivate(e, item.link)}
                      className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow transition ${
                          item.link ? "hover:shadow-md cursor-pointer"
                              : "cursor-default"
                      }`}
                  >
                    <img
                        src={item.image_path}
                        alt={item.alt_text || item.description
                            || `${item.journal} cover art`}
                        className="w-full h-[460px] object-cover"
                        loading="lazy"
                    />
                  </div>
              )}
          />
        </div>
      </section>
  );
}