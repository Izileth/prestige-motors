import type { Route } from "../+types/home";
import ProfilePage from "~/src/pages/dashboard/profile";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Dashboard | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Dashboard() {
    return (
        <ProfilePage/>
    );
}
