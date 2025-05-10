import type { Route } from "../_password/+types/forgout";
import TermsPage from "~/src/pages/polities/(terms)/terms";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Termos & Condições | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Terms() {
    return (
        <TermsPage/>
    );
}
