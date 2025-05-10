import type { Route } from "../../_vehicle/_update/+types/update";
import { EditVehiclePage } from "~/src/pages/vehicle/(update)/vehicle.update";
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
