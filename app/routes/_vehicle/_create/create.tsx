import type { Route } from "../../+types/home";
import CreateVehiclePage from "~/src/pages/vehicle/(create)/vehicleCreate";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Adcionar um Veículo | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function CreateVehicle() {
    return (
        <CreateVehiclePage/>
    );
}
