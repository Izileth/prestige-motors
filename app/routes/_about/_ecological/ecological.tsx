import type { Route } from "../../_about/_ecological/+types/ecological";
import SustainabilityPage from "~/src/pages/about/(ecological)/ecological";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Políticas Ecológicas | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Sustainability() {
    return (
        <SustainabilityPage/>
    );
}
