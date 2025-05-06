import type { Route } from "../../+types/home";
import VehicleDetailsPage from "~/src/pages/vehicle/[id]/vehicleId";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Destaque | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function VehicleDetails() {
    return (
        <VehicleDetailsPage/>
    );
}
