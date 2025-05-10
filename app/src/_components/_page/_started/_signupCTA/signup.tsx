
import { useState } from "react"
import { motion } from "framer-motion"

import { useNavigate } from "react-router"

export function SignupCTA() {
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    const handleSignIn = () => {
        navigate('/register')
    }

    return (
        <section className="py-24 md:py-32 bg-white dark:bg-gray-950 w-full max-w-full border-t border-b border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-4">
            <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto"
            >
            <div className="space-y-12 md:space-y-16">
                {/* Heading with animated line */}
                <div className="text-center space-y-3">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="h-px bg-black dark:bg-white mx-auto"
                />
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-extralight tracking-tight text-gray-900 dark:text-gray-100"
                >
                    JUNTE-SE À NOSSA PLATAFORMA
                </motion.h2>
                </div>

                {/* Description */}
                <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="text-base md:text-lg font-light text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto leading-relaxed"
                >
                Cadastre-se gratuitamente e tenha acesso a ofertas exclusivas, alertas de novos veículos e muito mais.
                </motion.p>

                {/* Button */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="flex justify-center"
                >
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative"
                >
                    <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-black dark:bg-white text-white dark:text-black py-4 px-12 md:px-16 text-sm md:text-base font-light tracking-wider z-10 overflow-hidden group"
                    onClick={handleSignIn}
                    >
                    <span className="relative z-10">CRIAR MINHA CONTA</span>
                    <motion.div
                        className="absolute inset-0 bg-gray-800 dark:bg-gray-200"
                        initial={{ x: "-100%" }}
                        animate={{ x: isHovered ? 0 : "-100%" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                    </motion.button>
                    <motion.div
                    className="absolute -inset-px border border-black dark:border-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    viewport={{ once: true }}
                    animate={{
                        x: isHovered ? 4 : 0,
                        y: isHovered ? 4 : 0,
                        opacity: isHovered ? 0.3 : 1,
                    }}
                    />
                </motion.div>
                </motion.div>

                {/* Note */}
                <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center font-light"
                >
                Leva menos de um minuto para se cadastrar
                </motion.p>
            </div>
            </motion.div>
        </div>
        </section>
    )
}
