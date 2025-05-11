import type React from "react"

import { motion } from "framer-motion"
import { Mail, Check, ArrowRight, Activity, Clock, Sparkles } from "lucide-react"
import { useState } from "react"

const NewsletterPage = () => {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulação de envio
        setTimeout(() => {
        setIsSubmitting(false)
        setIsSubscribed(true)
        }, 1000)
    }

    // Animation variants for consistent effects
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }

    const fadeInUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section - Minimalist approach */}
        <motion.section
            className="relative h-[60vh] flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
        >
            <motion.div
            className="absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8dbcab80-6ad5-43a7-95be-d083de93f4f3/Leonardo_Kino_XL_Interior_image_of_the_executive_lounge_at_Pre_2.jpg')] bg-cover bg-center opacity-5"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            />

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.h1
                className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight"
                variants={fadeInUp}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                Newsletter Exclusiva
            </motion.h1>
            <motion.div
                className="h-px w-16 bg-gray-300 mx-auto mb-8"
                variants={fadeIn}
                transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
                className="text-lg text-gray-500 max-w-xl mx-auto font-light"
                variants={fadeInUp}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                Receba lançamentos, eventos VIP e ofertas personalizadas.
            </motion.p>
            </div>
        </motion.section>

        {/* Subscription Section - Clean, minimal form */}
        <section className="py-24 px-4 max-w-3xl mx-auto" id="newsletter-form">
            <motion.div
            className="border-t border-gray-100 pt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            {!isSubscribed ? (
                <>
                <motion.h2
                    className="text-2xl font-light text-center mb-8 tracking-wide"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Inscreva-se na Newsletter
                </motion.h2>
                <motion.p
                    className="text-base text-gray-600 mb-12 text-center font-light max-w-xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Mantenha-se atualizado com os veículos mais exclusivos, eventos privativos e ofertas especiais
                    disponíveis apenas para assinantes da Prestige Motors.
                </motion.p>
                <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="relative flex-grow">
                    <Mail
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                        strokeWidth={1.5}
                    />
                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent font-light"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border border-gray-900 bg-gray-900 text-white px-6 py-3 font-light tracking-wide hover:bg-transparent hover:text-gray-900 transition-colors duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {isSubmitting ? (
                        "Processando..."
                    ) : (
                        <>
                        <span>Assinar</span>
                        <ArrowRight
                            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            size={18}
                            strokeWidth={1.5}
                        />
                        </>
                    )}
                    </button>
                </motion.form>
                </>
            ) : (
                <motion.div
                className="text-center max-w-lg mx-auto"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                >
                <div className="border border-gray-200 p-4 rounded-full inline-flex mb-8 text-gray-900">
                    <Check size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-light mb-6 tracking-wide">Inscrição Confirmada</h2>
                <p className="text-base text-gray-600 mb-8 font-light leading-relaxed">
                    Obrigado por se inscrever na <span className="font-normal">Prestige Motors</span>. Você receberá nossas
                    atualizações em primeira mão.
                </p>
                <a
                    href="/"
                    className="inline-block border border-gray-900 text-gray-900 px-8 py-3 font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300 group"
                >
                    <span>Voltar à Página Inicial</span>
                </a>
                </motion.div>
            )}
            </motion.div>
        </section>

        {/* Benefits Section - Minimal cards */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-20 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Benefícios Exclusivos
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <Activity size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Acesso Antecipado</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Seja o primeiro a conhecer novos lançamentos e veículos exclusivos antes do público geral.
                </p>
                </motion.div>

                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <Clock size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Eventos VIP</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Convites para test-drives exclusivos, lançamentos privativos e experiências premium.
                </p>
                </motion.div>

                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <Sparkles size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Ofertas Personalizadas</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Descontos e condições especiais disponíveis apenas para assinantes.
                </p>
                </motion.div>
            </div>
            </div>
        </section>

        {/* CTA Section - Minimal and elegant */}
        <section className="py-24 bg-zinc-950 text-white">
            <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.h2
                className="text-2xl font-light mb-8 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Não Perca Nenhuma Novidade
            </motion.h2>
            <motion.div
                className="h-px w-16 bg-gray-700 mx-auto mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.p
                className="text-lg mb-12 text-gray-400 font-light max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                Inscreva-se agora e faça parte do seleto grupo Prestige Motors.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <a
                href="#newsletter-form"
                className="w-72 border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 group flex items-center mx-auto justify-center"
                >
                <span>Assinar Newsletter</span>
                <ArrowRight
                    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                    size={18}
                    strokeWidth={1.5}
                />
                </a>
            </motion.div>
            </div>
        </section>
        </div>
    )
}

export default NewsletterPage
