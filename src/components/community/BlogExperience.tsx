"use client";

import { useMemo, useState } from "react";

type Article = {
  id: string;
  category: string;
  title: string;
  deck: string;
  readTime: string;
  sections: { heading: string; paragraphs?: string[]; items?: string[] }[];
};

const articles: Article[] = [
  {
    id: "origin",
    category: "Manifesto",
    title: "Why I Built This",
    deck: "Why Ascensioz needs to exist, and why progress should feel like momentum instead of maintenance.",
    readTime: "4 min read",
    sections: [
      {
        heading: "The gap between learning and change",
        paragraphs: [
          "Most platforms today are designed to teach. Very few are designed to transform. That gap is exactly why Ascensioz exists. I did not want to build another app where you passively consume content and feel productive for a few hours. I wanted something that actually pushes you.",
          "Growth should feel like a game you want to play, not a task you have to complete.",
        ],
      },
      {
        heading: "The problems worth solving",
        items: [
          "Feels empty after progress",
          "No sense of identity",
          "Weak feedback loops",
          "Gamification without depth",
        ],
      },
      {
        heading: "The core system",
        paragraphs: [
          "Your growth is tracked like a game character. Skills evolve, capabilities improve, and your profile reflects who you are becoming.",
          "Ascensioz builds a model of you — strengths, weaknesses, and patterns over time.",
          "Instead of static dashboards, you experience progression and momentum like a real system.",
        ],
      },
      {
        heading: "The vision",
        paragraphs: [
          "Ascensioz is not just a learning app, productivity tool, or game. It is a system where you continuously evolve with clarity, feedback, and challenge.",
          "The long-term goal is to create a fully immersive growth environment with personalized progression, competitive ecosystems, and deep integration of skill and identity.",
        ],
      },
    ],
  },
  {
    id: "progression",
    category: "Systems",
    title: "Progress Should Leave a Trace",
    deck: "A useful progression system does more than count activity. It gives effort a visible shape.",
    readTime: "3 min read",
    sections: [
      {
        heading: "From activity to identity",
        paragraphs: [
          "A completed challenge should not disappear into a feed. It should become evidence: a small, durable signal that says what you can do now that you could not do before.",
          "That is why skills, XP, rank, and profile identity belong in the same system. The interface should make growth legible without turning it into noise.",
        ],
      },
      {
        heading: "Feedback is the product",
        paragraphs: [
          "The most motivating loop is not an empty streak. It is a clear exchange between effort and consequence: attempt, feedback, adjustment, improvement.",
        ],
      },
    ],
  },
  {
    id: "practice",
    category: "Practice",
    title: "Make the Next Attempt Easier",
    deck: "The best learning environments reduce the distance between curiosity, practice, and another attempt.",
    readTime: "2 min read",
    sections: [
      {
        heading: "Momentum beats ceremony",
        paragraphs: [
          "A good practice session does not need a perfect setup. It needs a clear next move, useful context, and enough feedback to make trying again feel natural.",
          "The interface should stay out of the way while still making the journey feel consequential.",
        ],
      },
    ],
  },
];

const categories = ["All", ...new Set(articles.map((article) => article.category))];

export default function BlogExperience() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("origin");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const searchableText = `${article.title} ${article.deck} ${article.category}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const selectedArticle =
    articles.find((article) => article.id === selectedId) ?? articles[0];
  const featuredArticle = filteredArticles[0] ?? articles[0];

  return (
    <main className="blog-shell min-h-screen overflow-hidden">
      <section className="blog-hero relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="blog-hero-image" aria-hidden="true" />
        <div className="relative z-10 grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <p className="blog-kicker">The Ascensioz Journal / 001</p>
            <h1 className="blog-display mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] sm:text-7xl lg:text-8xl">
              Ideas for people who are still becoming.
            </h1>
            <p className="blog-hero-copy mt-7 max-w-xl text-lg leading-8 sm:text-xl">
              Notes on learning, identity, feedback, and building a system that makes progress feel real.
            </p>
          </div>
          <div className="blog-feature-note lg:mb-2">
            <span className="blog-label">Featured dispatch</span>
            <h2 className="mt-4 text-2xl font-semibold">{featuredArticle.title}</h2>
            <p className="mt-3 text-sm leading-6">{featuredArticle.deck}</p>
            <button
              type="button"
              className="blog-text-button mt-6"
              onClick={() => setSelectedId(featuredArticle.id)}
            >
              Read the dispatch <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-12">
        <div className="blog-toolbar flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Filter articles">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`blog-filter ${activeCategory === category ? "is-active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="blog-search flex items-center gap-3">
            <span className="sr-only">Search articles</span>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the journal"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-12">
        <aside>
          <div className="blog-label mb-5">Dispatches / {filteredArticles.length}</div>
          <div className="space-y-3">
            {filteredArticles.map((article, index) => (
              <button
                key={article.id}
                type="button"
                onClick={() => setSelectedId(article.id)}
                className={`blog-article-card w-full text-left ${selectedId === article.id ? "is-selected" : ""}`}
              >
                <span className="blog-card-index">0{index + 1}</span>
                <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  {article.category}
                </span>
                <span className="mt-3 block text-xl font-semibold leading-tight text-[var(--color-text)]">
                  {article.title}
                </span>
                <span className="mt-3 block text-sm leading-6 text-[var(--color-muted)]">
                  {article.deck}
                </span>
                <span className="mt-5 block text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {article.readTime}
                </span>
              </button>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="blog-empty border p-6 text-sm leading-6">
              No dispatches match that search. Try a broader phrase.
            </div>
          )}
        </aside>

        <article className="blog-reading max-w-3xl">
          <div className="blog-label">{selectedArticle.category} / Field notes</div>
          <h2 className="blog-display mt-5 text-4xl font-semibold leading-tight sm:text-6xl">
            {selectedArticle.title}
          </h2>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--color-muted)]">
            {selectedArticle.deck}
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            <span>{selectedArticle.readTime}</span>
            <span aria-hidden="true">•</span>
            <span>Ascensioz editorial</span>
          </div>

          <div className="mt-14 space-y-12">
            {selectedArticle.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
                  {section.heading}
                </h3>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <li key={item} className="blog-principle border p-4 text-sm font-semibold text-[var(--color-text)]">
                        <span className="mr-3 text-[var(--color-primary)]">/</span>{item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <footer className="mt-16 border-t border-[var(--color-border)] pt-8 text-lg italic text-[var(--color-muted)]">
            This is not about doing more. It is about <strong className="text-[var(--color-text)]">becoming more</strong>.
          </footer>
        </article>
      </section>
    </main>
  );
}
