import { User } from "lucide-react";
import type { Route } from "../../_vehicle/_negociation/+types/negociation";
import NegotiationsPage from "~/src/pages/vehicle/(negociations)/negociation";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Minhas Negociações | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function NegociationUserList() {
    return (
        <NegotiationsPage/>
    );
}
