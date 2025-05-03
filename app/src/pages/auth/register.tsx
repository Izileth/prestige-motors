
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CreditCard } from "lucide-react";
import { useAuth } from "~/src/hooks/useAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function RegisterPage() {
    const { register, status, error } = useAuth();
    const router = useNavigate();
    
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        cpf: "",
        dataNascimento: ""
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormError(null); // Limpa erros ao digitar
    };

    const handleRegister = async () => {
        // Validação básica dos campos obrigatórios
        if (!formData.nome || !formData.email || !formData.senha) {
            setFormError("Nome, email e senha são obrigatórios");
            return;
        }

        try {
            await register({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                telefone: formData.telefone || undefined,
                cpf: formData.cpf || undefined,
                dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : undefined

            });
            
            // Redireciona para a página de login após registro bem-sucedido
            router("/login?registered=true");
            
        } catch (err) {
            // O erro já é tratado pelo hook useAuth, mas podemos adicionar tratamento adicional aqui
            console.error("Erro no registro:", err);
        }
    };

    // Formatar CPF
    const formatCPF = (value: string) => {
        if (!value) return value;
        
        const cpfDigits = value.replace(/\D/g, '');
        if (cpfDigits.length <= 3) return cpfDigits;
        if (cpfDigits.length <= 6) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3)}`;
        if (cpfDigits.length <= 9) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6)}`;
        return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6, 9)}-${cpfDigits.slice(9, 11)}`;
    };

    // Formatar telefone
    const formatPhone = (value: string) => {
        if (!value) return value;
        
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length <= 2) return `(${phoneDigits}`;
        if (phoneDigits.length <= 7) return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2)}`;
        return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 7)}-${phoneDigits.slice(7, 11)}`;
    };

    // Handler para CPF formatado
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCPF = formatCPF(e.target.value);
        setFormData(prev => ({ ...prev, cpf: formattedCPF }));
    };

    // Handler para telefone formatado
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhone = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, telefone: formattedPhone }));
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extralight tracking-tight text-gray-900">CRIAR CONTA</h1>
                    <p className="mt-2 text-sm font-light text-gray-500">
                        Preencha os dados para se registrar
                    </p>
                </div>

                {/* Mensagens de erro */}
                {(error || formError) && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {formError || error}
                        </p>
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Campo de nome */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Nome completo"
                                required
                            />
                        </div>

                        {/* Campo de email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
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

                        {/* Campo de telefone (opcional) */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handlePhoneChange}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Telefone (opcional)"
                            />
                        </div>

                        {/* Campo de CPF (opcional) */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleCPFChange}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="CPF (opcional)"
                                maxLength={14}
                            />
                        </div>

                        {/* Campo de data de nascimento (opcional) */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                className="block w-full rounded-none border-0 border-b border-gray-300 py-3 pl-10 text-gray-900 ring-0 focus:border-black focus:ring-0"
                                placeholder="Data de nascimento (opcional)"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleRegister}
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
                            ) : "CRIAR CONTA"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="text-sm">
                            Já tem uma conta?{" "}
                            <Link to="/login" className="font-medium text-gray-700 hover:text-black">
                                Entrar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}