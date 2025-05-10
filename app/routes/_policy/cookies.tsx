import type { Route } from "../_password/+types/forgout";
import CookiePolicyPage from "~/src/pages/polities/(cookies)/cookies";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Política de Cookies | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Cookies() {
    return (
        <CookiePolicyPage/>
    );
}
