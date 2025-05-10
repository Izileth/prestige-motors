import type { Route } from "../../_about/_us/+types/us";
import AboutUsPage from "~/src/pages/about/(us)/about.us";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Nossa História | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function AboutUs() {
    return (
        <AboutUsPage/>
    );
}
