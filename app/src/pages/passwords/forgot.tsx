import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "~/src/hooks/useAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function RecoverPasswordPage() {
    const { requestPasswordReset, status, error, clearPasswordResetStatus } = useAuth();
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate()

    const handleRecover = async () => {
        if (!email) return;

        try {
            await requestPasswordReset(email);
            setIsSent(true);
            navigate('/passwords/reset')
        } catch (err) {
            // O erro já é tratado pelo hook useAuth
            console.error("Erro ao solicitar recuperação de senha:", err);
        }
    };

    const handleTryAgain = () => {
        setEmail("");
        setIsSent(false);
        clearPasswordResetStatus(); // Limpa qualquer estado/erro anterior
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extralight tracking-tight text-gray-900">RECUPERAR SENHA</h1>
                    <p className="mt-2 text-sm font-light text-gray-500">
                        {!isSent 
                            ? "Digite seu email para receber instruções de recuperação"
                            : "Instruções de recuperação enviadas para seu email"
                        }
                    </p>
                </div>

                {/* Exibe mensagem de erro se existir */}
                {error && !isSent && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {!isSent ? (
                    <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleRecover}
                                disabled={status === 'loading' || !email}
                                className="group relative flex w-full justify-center rounded-none border border-transparent bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </span>
                                ) : "ENVIAR INSTRUÇÕES"}
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
                ) : (
                    <div className="mt-8 space-y-6">
                        <div className="text-center text-sm">
                            <p className="mb-6">
                                Se o email <span className="font-medium">{email}</span> estiver registrado em nossa base de dados, 
                                você receberá em instantes um link para criar uma nova senha.
                            </p>
                            <p>
                                Verifique sua caixa de entrada e a pasta de spam.
                            </p>
                        </div>

                        <div>
                            <button
                                onClick={handleTryAgain}
                                className="group relative flex w-full justify-center rounded-none border border-black bg-white py-3 text-sm font-medium text-black hover:bg-gray-100 focus:outline-none"
                            >
                                TENTAR NOVAMENTE
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
                )}
            </div>
        </div>
    );
}