import type { Route } from "../../_about/_mission/+types/mission";
import OurMissionPage from "~/src/pages/about/(mission)/about.mission";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Quem Somos | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function OurMission() {
    return (
        <OurMissionPage/>
    );
}
