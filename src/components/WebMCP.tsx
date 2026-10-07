"use client";

import { useEffect } from "react";

/**
 * WebMCP tool surface (proposed web standard) for browser agents.
 * Registers portfolio tools via document.modelContext.registerTool(),
 * with navigator.modelContext as a trailing compatibility fallback.
 * ChatGPT desktop browser / Chrome origin-trial clients can discover
 * and call these in-page tools when the feature is available.
 */
export default function WebMCP() {
  useEffect(() => {
    const tools = [
      {
        name: "get_profile",
        description: "Get Hormaz Daruwala's public profile, roles, and availability.",
        execute: async () => {
          const r = await fetch("/api/profile");
          return await r.json();
        },
      },
      {
        name: "search_projects",
        description: "Search portfolio projects by kind and keyword.",
        parameters: { type: "object", properties: { q: { type: "string" } } },
        execute: async (args: { q?: string }) => {
          const r = await fetch(`/api/projects?q=${encodeURIComponent(args?.q || "")}`);
          return await r.json();
        },
      },
      {
        name: "get_contact",
        description: "Get public contact channels for hiring inquiries.",
        execute: async () => {
          const r = await fetch("/api/contact");
          return await r.json();
        },
      },
    ];
    for (const t of tools) {
      try {
        const doc = document as unknown as {
          modelContext?: { registerTool?: (tool: unknown) => void };
        };
        const nav = navigator as unknown as {
          modelContext?: { registerTool?: (tool: unknown) => void };
        };
        if (doc.modelContext?.registerTool) doc.modelContext.registerTool(t);
        else if (nav.modelContext?.registerTool) nav.modelContext.registerTool(t);
      } catch {
        /* WebMCP unavailable - REST/MCP surfaces remain */
      }
    }
  }, []);
  return null;
}
