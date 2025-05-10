import type { Route } from "../_auth/+types/login";
import LoginPage from "~/src/pages/auth/loguin";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Login | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return (
        <LoginPage/>
    );
}
