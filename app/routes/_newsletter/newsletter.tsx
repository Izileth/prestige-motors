import type { Route } from "../_newsletter/+types/newsletter";
import NewsletterPage from "~/src/pages/newleaster/newleaster";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Exclusivos | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function NewsLetter() {
    return (
        <NewsletterPage/>
    );
}
