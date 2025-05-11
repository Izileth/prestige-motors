import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "~/src/hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { confirmPasswordReset, status, error } = useAuth();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReset = async () => {
        if (!token || !password || password !== confirmPassword) return;

        try {
            await confirmPasswordReset({ token, senha: password });
            setIsSuccess(true);
        } catch (err) {
            console.error("Erro ao resetar senha:", err);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h1 className="text-4xl font-extralight tracking-tight text-gray-900">SENHA ALTERADA</h1>
                    <p className="mt-2 text-sm font-light text-gray-500">
                        Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                    </p>
                    <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center w-full mt-6 text-sm font-medium text-gray-700 hover:text-black"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Voltar para o login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extralight tracking-tight text-gray-900">CRIAR NOVA SENHA</h1>
                    <p className="mt-2 text-sm font-light text-gray-500">
                        Digite sua nova senha abaixo
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Nova senha"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Confirme a nova senha"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleReset}
                            disabled={status === 'loading' || !password || password !== confirmPassword}
                            className="group relative flex w-full justify-center rounded-none border border-transparent bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? "Processando..." : "REDEFINIR SENHA"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
