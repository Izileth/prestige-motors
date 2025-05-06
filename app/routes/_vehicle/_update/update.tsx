import type { Route } from "../../+types/home";
import { EditVehiclePage } from "~/src/pages/vehicle/(update)/vehicleUpdate";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Edição de Veiculo | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function UpdateVehicle() {
    return (
        <EditVehiclePage/>
    );
}
