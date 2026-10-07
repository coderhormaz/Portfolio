import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { marqueeItems } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} />
      <About />
      <Marquee
        dark
        items={["Available for freelance", "Web3 builds", "EdTech platforms", "Mobile apps", "Design systems", "VPS & DevOps", "AI agents"]}
      />
      <Experience />
      <Work />
      <Projects />
      <Skills />
      <Faq />
      <Contact />
      {/* Agent entry points: public API + docs linked from homepage */}
      <nav aria-label="Developer and agent resources" className="sr-only">
        <a href="/docs">API documentation</a>
        <a href="/developers">Developer portal</a>
        <a href="/pricing">Pricing</a>
        <a href="/openapi.json">OpenAPI specification</a>
        <a href="/llms.txt">Agent index (llms.txt)</a>
        <a href="/auth.md">Agent auth</a>
        <a href="https://github.com/coderhormaz/Portfolio">Source repo with AGENTS.md</a>
      </nav>
      {/* Declarative WebMCP preview surface (programmatic registration lives in WebMCP.tsx) */}
      <form
        {...{ toolname: "get_profile", tooldescription: "Get Hormaz Daruwala's public profile, roles, and availability." } as Record<string, string>}
        action="/api/profile"
        method="get"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        <button type="submit">Get profile</button>
      </form>
      <form
        {...{ toolname: "search_projects", tooldescription: "Search portfolio projects by kind and keyword." } as Record<string, string>}
        action="/api/projects"
        method="get"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        <input type="text" name="q" />
        <button type="submit">Search projects</button>
      </form>
    </>
  );
}
