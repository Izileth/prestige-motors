import type { Route } from "../_destacts/+types/destacts";
import DestactsPage from "~/src/pages/destacts/destacts";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Destaques | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Destacts() {
    return (
        <DestactsPage/>
    );
}
