import type { Route } from "../../_vehicle/_create/+types/create";
import CreateVehiclePage from "~/src/pages/vehicle/(create)/vehicle.create";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adcionar um Veículo | Prestige Motors" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function CreateVehicle() {
  return <CreateVehiclePage />;
}
