import type { Route } from "../_destacts/+types/destacts";
import { VehicleListing } from "~/src/_components/_page/_destacts/grid";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Destaques | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Destacts() {
    return (
        <VehicleListing/>
    );
}
