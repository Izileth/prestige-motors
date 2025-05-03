import type { Route } from "./+types/home";
import { Started } from "..";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Prestige Motors" },
    { name: "description", content: "Welcome to Prestige Motors!" },
  ];
}

export default function Home() {
  return <Started/>;
}
