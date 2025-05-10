import type { Route } from "../../_vehicle/_id/+types/vehicleId";
import VehicleDetailsPage from "~/src/pages/vehicle/[id]/vehicle.id";
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
