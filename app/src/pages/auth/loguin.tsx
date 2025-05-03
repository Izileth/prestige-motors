import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "~/src/hooks/useAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const LoginPage = () => {
    const { login, status, error } = useAuth();
    const router = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    
    const handleLogin = async () => {
        if (!email || !password) {
            return; // Validação básica
        }

        try {
            await login({ email, senha: password });
            // Redireciona após login bem-sucedido
            router('/dashboard');
        } catch (err) {
            // O erro já é tratado pelo hook useAuth
            console.error("Erro no login:", err);
        }
    };

    

  

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extralight tracking-tight text-gray-900">ENTRAR</h1>
                    <p className="mt-2 text-sm font-light text-gray-500">
                        Acesse sua conta para continuar
                    </p>
                </div>

                {/* Exibe mensagem de erro se existir */}
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {typeof error === 'string' ? error : 'Credenciais inválidas'}
                        </p>
                    </div>
                )}
                

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Campo de email */}
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

                        {/* Campo de senha */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 pr-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Senha"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Lembrar-me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/passwords/forgot" className="font-medium text-gray-700 hover:text-black">
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleLogin}
                            disabled={status === 'loading'}
                            className="group relative flex w-full justify-center rounded-none border border-transparent bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </span>
                            ) : "ENTRAR"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="text-sm">
                            Não tem uma conta?{" "}
                            <Link to="/register" className="font-medium text-gray-700 hover:text-black">
                                Criar conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginPage