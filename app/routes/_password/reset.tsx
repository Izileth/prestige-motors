import type { Route } from "../_password/+types/reset";
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
