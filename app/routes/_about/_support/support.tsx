import type { Route } from "../../_about/_support/+types/support";
import SupportPage from "~/src/pages/about/(support)/about.support";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Suporte | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function SupportUs() {
    return (
        <SupportPage/>
    );
}
