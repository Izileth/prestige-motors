import type { Route } from "../+types/home";
import RecoverPasswordPage from "~/src/pages/passwords/forgot";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Redefinição de Senha | Prestige Motors" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Register() {
    return (
        <RecoverPasswordPage/>
    );
}
