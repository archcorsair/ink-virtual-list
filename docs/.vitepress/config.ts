import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import llmstxt, { copyOrDownloadAsMarkdownButtons } from "vitepress-plugin-llms";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ink Virtual List",
  description: "A virtualized list component for Ink terminal applications",
  base: "/ink-virtual-list/",
  lastUpdated: true,
  sitemap: { hostname: "https://archcorsair.github.io/ink-virtual-list/" },

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='13' font-size='13'%3E%E2%98%B0%3C/text%3E%3C/svg%3E",
      },
    ],
    ["meta", { name: "theme-color", content: "#06b6d4" }],
    ["meta", { property: "og:title", content: "Ink Virtual List" }],
    ["meta", { property: "og:description", content: "A virtualized list component for Ink terminal applications" }],
    ["meta", { property: "og:url", content: "https://archcorsair.github.io/ink-virtual-list/" }],
  ],

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(copyOrDownloadAsMarkdownButtons);
    },
  },

  vite: {
    plugins: [
      groupIconVitePlugin(),
      llmstxt({
        excludeIndexPage: false,
      }),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/" },
      { text: "API", link: "/api/components" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/" },
          { text: "Basic Usage", link: "/guide/basic-usage" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Heights & Auto-fill", link: "/guide/heights" },
          { text: "Overflow Indicators", link: "/guide/overflow-indicators" },
          { text: "Imperative Scrolling", link: "/guide/imperative-scrolling" },
          { text: "Viewport Events & Scrollbars", link: "/guide/viewport-events" },
          { text: "Compatibility", link: "/guide/compatibility" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "Components", link: "/api/components" },
          { text: "Hooks", link: "/api/hooks" },
          { text: "Types", link: "/api/types" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/archcorsair/ink-virtual-list" }],

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/archcorsair/ink-virtual-list/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present archcorsair",
    },
  },
});
