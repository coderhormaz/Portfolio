import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
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
      <Contact />
    </>
  );
}
