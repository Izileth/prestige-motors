import type { Route } from "./+types/index";
import { Hero } from "~/src/pages/hero/hero";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Prestige Motors" },
    { name: "description", content: "Welcome to Prestige Motors!" },
  ];
}

export default function Home() {
  return <Hero />;
}
