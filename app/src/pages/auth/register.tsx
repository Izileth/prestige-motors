import type React from "react"

import { useState, useEffect } from "react"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    Calendar,
    CreditCard,
    ArrowRight,
    AlertCircle,
    Check,
} from "lucide-react"
import { useAuth } from "~/src/hooks/useAuth"
import { useNavigate } from "react-router"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

export default function RegisterPage() {
    const { register, status, error } = useAuth()
    const router = useNavigate()

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [formProgress, setFormProgress] = useState(0)
    const [fieldValidation, setFieldValidation] = useState({
        nome: true,
        email: true,
        senha: true,
        cpf: true,
    })

    // Calculate form completion progress
    useEffect(() => {
        const requiredFields = ["nome", "email", "senha"]
        const filledRequiredFields = requiredFields.filter((field) => formData[field as keyof typeof formData]?.trim())
        const optionalFields = ["telefone", "cpf", "dataNascimento"]
        const filledOptionalFields = optionalFields.filter((field) => formData[field as keyof typeof formData]?.trim())

        const requiredProgress = (filledRequiredFields.length / requiredFields.length) * 70
        const optionalProgress = (filledOptionalFields.length / optionalFields.length) * 30

        setFormProgress(Math.round(requiredProgress + optionalProgress))
    }, [formData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormError(null) // Limpa erros ao digitar

        // Validate fields as user types
        if (name === "email") {
        setFieldValidation((prev) => ({
            ...prev,
            email: !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        }))
        } else if (name === "senha") {
        setFieldValidation((prev) => ({
            ...prev,
            senha: !value.trim() || value.length >= 6,
        }))
        } else if (name === "nome") {
        setFieldValidation((prev) => ({
            ...prev,
            nome: !value.trim() || value.trim().length > 0,
        }))
        }
    }

    const handleRegister = async () => {
        // Validações básicas
        if (!formData.nome.trim()) {
        setFormError("Nome é obrigatório")
        return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setFormError("Por favor, insira um email válido")
        return
        }

        if (formData.senha.length < 6) {
        setFormError("A senha deve ter pelo menos 6 caracteres")
        return
        }

        if (formData.cpf && formData.cpf.replace(/\D/g, "").length !== 11) {
        setFormError("CPF deve ter 11 dígitos")
        return
        }

        try {
        await register({
            nome: formData.nome.trim(),
            email: formData.email.trim().toLowerCase(),
            senha: formData.senha,
            telefone: formData.telefone?.replace(/\D/g, ""),
            cpf: formData.cpf?.replace(/\D/g, ""),
            dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : undefined,
        })

        router("/login?registered=true")
        } catch (err) {
        console.error("Erro no registro:", err)
        }
    }

    // Formatar CPF
    const formatCPF = (value: string) => {
        if (!value) return value

        const cpfDigits = value.replace(/\D/g, "")
        if (cpfDigits.length <= 3) return cpfDigits
        if (cpfDigits.length <= 6) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3)}`
        if (cpfDigits.length <= 9) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6)}`
        return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6, 9)}-${cpfDigits.slice(9, 11)}`
    }

    const validateCPF = (cpf: string) => {
        if (!cpf) return true
        const cleaned = cpf.replace(/\D/g, "")
        return cleaned.length === 11
    }

    // Formatar telefone
    const formatPhone = (value: string) => {
        if (!value) return value

        const phoneDigits = value.replace(/\D/g, "")
        if (phoneDigits.length <= 2) return `(${phoneDigits}`
        if (phoneDigits.length <= 7) return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2)}`
        return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 7)}-${phoneDigits.slice(7, 11)}`
    }

    // Handler para CPF formatado
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCPF = formatCPF(e.target.value)
        setFormData((prev) => ({ ...prev, cpf: formattedCPF }))

        // Validate CPF
        setFieldValidation((prev) => ({
        ...prev,
        cpf: !e.target.value.trim() || validateCPF(e.target.value),
        }))
    }

    // Handler para telefone formatado
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhone = formatPhone(e.target.value)
        setFormData((prev) => ({ ...prev, telefone: formattedPhone }))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
        handleRegister()
        }
    }

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-gray-950 px-4 py-8"
        >
        <div className="w-full max-w-md space-y-8">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
            >
            <h1 className="text-4xl font-extralight tracking-tight text-gray-900 dark:text-gray-100">CRIAR CONTA</h1>
            <p className="mt-3 text-sm font-light text-gray-500 dark:text-gray-400">
                Preencha os dados para se registrar
            </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-1 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-full"
            >
            <motion.div
                className="absolute left-0 top-0 h-full bg-black dark:bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
            />
            </motion.div>
            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-right text-gray-500 dark:text-gray-400"
            >
            {formProgress}% completo
            </motion.p>

            <AnimatePresence>
            {(error || formError) && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start"
                >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{formError || error}</p>
                </motion.div>
            )}
            </AnimatePresence>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 space-y-6"
            >
            <div className="space-y-5">
                {/* Campo de nome */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "nome" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "nome" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <User className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("nome")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className={`block w-full rounded-none border-0 border-b ${
                    !fieldValidation.nome ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                    } py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200`}
                    placeholder="Nome completo"
                    required
                />
                <motion.div
                    className={`absolute bottom-0 left-0 h-0.5 ${
                    !fieldValidation.nome ? "bg-red-500" : "bg-black dark:bg-white"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "nome" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.nome && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>

                {/* Campo de email */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "email" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "email" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <Mail className="h-5 w-5" />
                </div>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className={`block w-full rounded-none border-0 border-b ${
                    !fieldValidation.email ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                    } py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200`}
                    placeholder="Email"
                    required
                />
                <motion.div
                    className={`absolute bottom-0 left-0 h-0.5 ${
                    !fieldValidation.email ? "bg-red-500" : "bg-black dark:bg-white"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "email" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.email && fieldValidation.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>

                {/* Campo de senha */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "senha" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "senha" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <Lock className="h-5 w-5" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("senha")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className={`block w-full rounded-none border-0 border-b ${
                    !fieldValidation.senha ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                    } py-4 pl-10 pr-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200`}
                    placeholder="Senha"
                    required
                    minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-200 ${
                    focusedField === "senha" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.div>
                </button>
                <motion.div
                    className={`absolute bottom-0 left-0 h-0.5 ${
                    !fieldValidation.senha ? "bg-red-500" : "bg-black dark:bg-white"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "senha" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.senha && formData.senha.length >= 6 && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>

                {/* Campo de telefone (opcional) */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "telefone" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "telefone" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <Phone className="h-5 w-5" />
                </div>
                <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    onFocus={() => setFocusedField("telefone")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-none border-0 border-b border-gray-300 dark:border-gray-700 py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200"
                    placeholder="Telefone (opcional)"
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "telefone" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.telefone && formData.telefone.length >= 14 && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>

                {/* Campo de CPF (opcional) */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "cpf" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "cpf" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <CreditCard className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    onFocus={() => setFocusedField("cpf")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className={`block w-full rounded-none border-0 border-b ${
                    !fieldValidation.cpf ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                    } py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200`}
                    placeholder="CPF (opcional)"
                    maxLength={14}
                />
                <motion.div
                    className={`absolute bottom-0 left-0 h-0.5 ${
                    !fieldValidation.cpf ? "bg-red-500" : "bg-black dark:bg-white"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "cpf" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.cpf && formData.cpf.length === 14 && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>

                {/* Campo de data de nascimento (opcional) */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "dataNascimento" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "dataNascimento" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <Calendar className="h-5 w-5" />
                </div>
                <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("dataNascimento")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-none border-0 border-b border-gray-300 dark:border-gray-700 py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200"
                    placeholder="Data de nascimento (opcional)"
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "dataNascimento" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {formData.dataNascimento && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <Check className="h-5 w-5 text-black dark:text-white" />
                    </motion.div>
                )}
                </motion.div>
            </div>

            <div>
                <motion.button
                onClick={handleRegister}
                disabled={status === "loading"}
                className="group relative flex w-full justify-center items-center rounded-none border border-transparent bg-black dark:bg-white py-4 text-sm font-medium text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)" }}
                >
                {status === "loading" ? (
                    <span className="flex items-center">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    PROCESSANDO...
                    </span>
                ) : (
                    <span className="flex items-center">
                    CRIAR CONTA
                    <motion.span
                        className="ml-2"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: [0, 5, 0], opacity: [0, 1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                    >
                        <ArrowRight className="h-4 w-4" />
                    </motion.span>
                    </span>
                )}
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center pt-4"
            >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                Já tem uma conta?{" "}
                <motion.span whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Link
                    to="/login"
                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                    Entrar
                    </Link>
                </motion.span>
                </div>
            </motion.div>
            </motion.div>
        </div>
        </motion.div>
    )
}
