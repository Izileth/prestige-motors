import type { Route } from "../+types/home";
import RegisterPage from "~/src/pages/auth/register";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Registro | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Register() {
    return (
        <RegisterPage/>
    );
}
