
import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "~/src/hooks/useAuth"
import { useNavigate } from "react-router"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

const LoginPage = () => {
    const { login, status, error } = useAuth()
    const router = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const handleLogin = async () => {
        if (!email || !password) {
        return // Validação básica
        }

        try {
        await login({ email, senha: password })
        // Redireciona após login bem-sucedido
        router("/dashboard")
        } catch (err) {
        // O erro já é tratado pelo hook useAuth
        console.error("Erro no login:", err)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
        handleLogin()
        }
    }

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8"
        >
        <div className="w-full max-w-md space-y-10">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
            >
            <h1 className="text-4xl font-extralight tracking-tight text-gray-900 dark:text-gray-100">ENTRAR</h1>
            <p className="mt-3 text-sm font-light text-gray-500 dark:text-gray-400">Acesse sua conta para continuar</p>
            </motion.div>

            <AnimatePresence>
            {error && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start"
                >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                    {typeof error === "string" ? error : "Credenciais inválidas"}
                </p>
                </motion.div>
            )}
            </AnimatePresence>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 space-y-8"
            >
            <div className="space-y-6">
                {/* Campo de email */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "email" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "email" ? "text-black dark:text-white" : "text-zinc-300 dark:text-zinc-300"
                    }`}
                >
                    <Mail className="h-5 w-5" />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-none border-0 border-b border-gray-300 dark:border-gray-700 py-4 pl-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200"
                    placeholder="Email"
                    required
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "email" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                </motion.div>

                {/* Campo de senha */}
                <motion.div
                className="relative"
                whileTap={{ scale: 0.995 }}
                animate={{ borderColor: focusedField === "password" ? "#000000" : "#e5e7eb" }}
                >
                <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200 ${
                    focusedField === "password" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <Lock className="h-5 w-5" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-none border-0 border-b border-gray-300 dark:border-gray-700 py-4 pl-10 pr-10 text-gray-900 dark:text-gray-100 bg-transparent ring-0 focus:border-black dark:focus:border-white focus:ring-0 transition-all duration-200"
                    placeholder="Senha"
                    required
                    minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-200 ${
                    focusedField === "password" ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.div>
                </button>
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === "password" ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                />
                </motion.div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <div className="relative flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-black dark:text-white focus:ring-black dark:focus:ring-white transition-colors duration-200"
                    />
                    <motion.label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    >
                    Lembrar-me
                    </motion.label>
                </div>
                </div>

                <motion.div className="text-sm" whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Link
                    to="/passwords/forgot"
                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                    Esqueceu a senha?
                </Link>
                </motion.div>
            </div>

            <div>
                <motion.button
                onClick={handleLogin}
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
                    ENTRAR
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
                Não tem uma conta?{" "}
                <motion.span whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Link
                    to="/register"
                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    >
                    Criar conta
                    </Link>
                </motion.span>
                </div>
            </motion.div>
            </motion.div>
        </div>
        </motion.div>
    )
}

export default LoginPage
