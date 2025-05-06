import type { Route } from "../+types/home";
import VehicleListingPage from "~/src/pages/vehicle/(reviews)/vehicleReview";
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
