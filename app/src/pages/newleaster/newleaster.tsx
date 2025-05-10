// src/pages/NewsletterPage.tsx
import { motion } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

const NewsletterPage = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulação de envio
        setTimeout(() => {
        setIsSubscribed(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
        {/* Hero Section */}
        <motion.section
            className="relative h-[50vh] bg-neutral-900 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
            className="absolute inset-0 bg-[url('/images/newsletter-hero.jpg')] bg-cover bg-center opacity-30"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            />

            <div className="relative z-10 text-center px-4">
            <motion.h1
                className="text-4xl md:text-6xl font-bold text-neutral-50 mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                Newsletter Exclusiva
            </motion.h1>
            <motion.p
                className="text-xl text-neutral-300 max-w-2xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Receba lançamentos, eventos VIP e ofertas personalizadas.
            </motion.p>
            </div>
        </motion.section>

        {/* Subscription Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
            <motion.div
            className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-neutral-100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            {!isSubscribed ? (
                <>
                <motion.h2
                    className="text-3xl font-bold mb-6 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Inscreva-se na Newsletter
                </motion.h2>
                <motion.p
                    className="text-lg text-neutral-600 mb-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Mantenha-se atualizado com os veículos mais exclusivos, eventos privativos e ofertas especiais.
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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    <button
                    type="submit"
                    className="bg-neutral-900 text-neutral-50 px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center"
                    >
                    Assinar <ArrowRight className="ml-2" size={20} />
                    </button>
                </motion.form>
                </>
            ) : (
                <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                >
                <div className="bg-neutral-900 text-neutral-50 p-4 rounded-full inline-flex mb-6">
                    <Check size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Inscrição Confirmada</h2>
                <p className="text-lg text-neutral-600 mb-6">
                    Obrigado por se inscrever na <strong>Prestige Motors</strong>. Você receberá nossas atualizações em primeira mão.
                </p>
                <a
                    href="/"
                    className="inline-block bg-neutral-900 text-neutral-50 px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors"
                >
                    Voltar à Página Inicial
                </a>
                </motion.div>
            )}
            </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-neutral-100">
            <div className="max-w-6xl mx-auto px-4">
            <motion.h2
                className="text-3xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                Benefícios Exclusivos
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                >
                <div className="bg-neutral-900 text-neutral-50 p-4 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Acesso Antecipado</h3>
                <p className="text-neutral-700">
                    Seja o primeiro a conhecer novos lançamentos e veículos exclusivos antes do público geral.
                </p>
                </motion.div>

                <motion.div
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                >
                <div className="bg-neutral-900 text-neutral-50 p-4 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Eventos VIP</h3>
                <p className="text-neutral-700">
                    Convites para test-drives exclusivos, lançamentos privativos e experiências premium.
                </p>
                </motion.div>

                <motion.div
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                >
                <div className="bg-neutral-900 text-neutral-50 p-4 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" />
                    <path d="m16 6-3 3" />
                    <path d="M18 12h4" />
                    <path d="m16 18 3-3" />
                    <path d="M12 22v-4" />
                    <path d="m8 18-3 3" />
                    <path d="M6 12H2" />
                    <path d="m8 6 3-3" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Ofertas Personalizadas</h3>
                <p className="text-neutral-700">
                    Descontos e condições especiais disponíveis apenas para assinantes.
                </p>
                </motion.div>
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-neutral-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                Não Perca Nenhuma Novidade
            </motion.h2>
            <motion.p
                className="text-xl mb-8 text-neutral-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Inscreva-se agora e faça parte do seleto grupo Prestige Motors.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <a
                href="#newsletter-form"
                className="inline-block bg-transparent border-2 border-neutral-50 text-neutral-50 px-8 py-3 rounded-full font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                Assinar Newsletter
                </a>
            </motion.div>
            </div>
        </section>
        </div>
    );
};

export default NewsletterPage;