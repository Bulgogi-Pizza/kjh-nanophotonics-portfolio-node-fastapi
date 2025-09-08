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

export default function ResearchHighlightsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {openLink, keyActivate} = useCardLink();

  useEffect(() => {
    fetch("/api/research-highlights/?active_only=1")
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Research
            Highlights</h2>
        </div>

        <HorizontalGallery
            items={items}
            ariaLabel="Research Highlights"
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
                    className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow transition ${item.link
                        ? "hover:shadow-md cursor-pointer" : "cursor-default"}`}
                >
                  <img
                      src={item.image_path}
                      alt={item.alt_text || item.description
                          || "Research highlight"}
                      className="w-full h-60 object-cover"
                      loading="lazy"
                  />
                  {item.description && (
                      <div
                          className="p-4 text-sm text-gray-700 dark:text-gray-300 min-h-[56px]">
                        {item.description}
                      </div>
                  )}
                </div>
            )}
        />
      </section>
  );
}