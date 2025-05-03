import type { Route } from "../+types/home";
import ResetPasswordPage from "~/src/pages/passwords/reset";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Criação de Senha | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Register() {
    return (
        <ResetPasswordPage/>
    );
}
