import { User } from "lucide-react";
import type { Route } from "../../+types/home";
import { UserVehicleList } from "~/src/pages/vehicle/(private)/vehilce.private";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Meus Veículos | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function VehicleUserList() {
    return (
        <UserVehicleList/>
    );
}
