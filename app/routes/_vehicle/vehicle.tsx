import type { Route } from "../_vehicle/+types/vehicle";
import VehicleListingPage from "~/src/pages/vehicle/(listing)/vehicle.review";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Veículos | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Vehicle() {
    return (
        <VehicleListingPage/>
    );
}
