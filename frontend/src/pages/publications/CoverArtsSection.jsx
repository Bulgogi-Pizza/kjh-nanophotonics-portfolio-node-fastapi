import React, {useEffect, useState} from "react";
import HorizontalGallery from "../../components/HorizontalGallery";
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
      setItems(data);
      setLoading(false);
    })
    .catch((e) => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading || items.length === 0) {
    return null;
  }

  return (
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cover
            Arts</h2>
        </div>

        <HorizontalGallery
            items={items}
            ariaLabel="Cover Arts"
            itemClassName="w-[180px]"
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
                    className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow transition ${item.link
                        ? "hover:shadow-md cursor-pointer" : "cursor-default"}`}
                >
                  <img
                      src={item.image_path}
                      alt={item.alt_text || item.description
                          || `${item.journal} cover art`}
                      className="w-full h-60 object-cover"
                      loading="lazy"
                  />
                  <div className="p-3 text-center">
                    <div
                        className="text-gray-900 dark:text-white leading-tight">
                      <span className="font-bold italic">{item.journal}</span>
                      {item.volume && <span
                          className="font-bold">, {item.volume}</span>}
                      {item.year && <span>, {item.year}</span>}
                    </div>
                    {item.description && (
                        <div
                            className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                        >
                          {item.description}
                        </div>
                    )}
                  </div>
                </div>
            )}
        />
      </section>
  );
}