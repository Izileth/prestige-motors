import type { Route } from "../../_vehicle/_category/+types/category";
import { VehiclesByCategoryPage} from "~/src/pages/vehicle/(category)/vehicle.category";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Categorias | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function CategoryVehicle() {
    return <VehiclesByCategoryPage/>;
}
