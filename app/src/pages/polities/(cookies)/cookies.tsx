
import { motion } from "framer-motion"
import { Cookie, Settings, Shield, ArrowRight } from "lucide-react"
import { useState } from "react"

const CookiePolicyPage = () => {
    const [activeTab, setActiveTab] = useState<"essenciais" | "analytics" | "marketing">("essenciais")
    const [cookieConsent, setCookieConsent] = useState({
        essential: true,
        analytics: false,
        marketing: false,
    })

    const handleConsentChange = (type: keyof typeof cookieConsent) => {
        setCookieConsent((prev) => ({
        ...prev,
        [type]: !prev[type],
        }))
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
            className="relative h-[40vh] flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
        >
            <motion.div
            className="absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8dbcab80-6ad5-43a7-95be-d083de93f4f3/Leonardo_Kino_XL_Interior_image_of_the_executive_lounge_at_Pre_3.jpg')] bg-cover bg-center opacity-5"
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
                Política de Cookies
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
                Transparência no uso de tecnologias para melhorar sua experiência
            </motion.p>
            </div>
        </motion.section>

        {/* Cookie Types Navigation - Minimal tabs */}
        <section className="py-8 border-b border-gray-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4">
            <motion.div
                className="flex overflow-x-auto scrollbar-hide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <button
                onClick={() => setActiveTab("essenciais")}
                className={`flex items-center px-6 py-3 whitespace-nowrap font-light text-sm transition-colors ${
                    activeTab === "essenciais"
                    ? "text-gray-900 border-b border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                <Shield size={16} className="mr-2" strokeWidth={1.5} />
                Cookies Essenciais
                </button>
                <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center px-6 py-3 whitespace-nowrap font-light text-sm transition-colors ${
                    activeTab === "analytics"
                    ? "text-gray-900 border-b border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                <Settings size={16} className="mr-2" strokeWidth={1.5} />
                Cookies de Analytics
                </button>
                <button
                onClick={() => setActiveTab("marketing")}
                className={`flex items-center px-6 py-3 whitespace-nowrap font-light text-sm transition-colors ${
                    activeTab === "marketing"
                    ? "text-gray-900 border-b border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                <Cookie size={16} className="mr-2" strokeWidth={1.5} />
                Cookies de Marketing
                </button>
            </motion.div>
            </div>
        </section>

        {/* Cookie Content - Clean layout */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16">
            {/* Main Content */}
            <motion.div
                className="md:w-2/3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {activeTab === "essenciais" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Cookies Essenciais</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Esses cookies são necessários para o funcionamento básico do site e não podem ser desativados. Eles
                    garantem funcionalidades como:
                    </p>
                    <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Segurança e prevenção de fraudes</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Manutenção de sessão do usuário</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Carregamento balanceado do servidor</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Preferências de consentimento de cookies</span>
                    </li>
                    </ul>
                    <div className="border-t border-gray-100 pt-8 mt-8">
                    <h3 className="text-lg font-light mb-4 tracking-wide">Exemplos de uso:</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Quando você adiciona um veículo à sua lista de favoritos, utilizamos cookies essenciais para manter
                        essa informação durante sua navegação.
                    </p>
                    </div>
                </motion.div>
                )}

                {activeTab === "analytics" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Cookies de Analytics</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Esses cookies nos ajudam a entender como os visitantes interagem com nosso site, fornecendo
                    informações sobre:
                    </p>
                    <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Páginas mais visitadas</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Padrões de navegação</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Desempenho de carregamento</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Possíveis erros encontrados</span>
                    </li>
                    </ul>
                    <div className="border-t border-gray-100 pt-8 mt-8">
                    <h3 className="text-lg font-light mb-4 tracking-wide">Como utilizamos esses dados:</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        As informações são agregadas e anônimas, nos permitindo melhorar a organização do conteúdo e a
                        performance técnica do site.
                    </p>
                    </div>
                </motion.div>
                )}

                {activeTab === "marketing" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Cookies de Marketing</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Esses cookies são usados para personalizar anúncios e conteúdo de acordo com seus interesses, tanto em
                    nosso site como em outras plataformas.
                    </p>
                    <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Exibição de veículos alinhados ao seu perfil</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Limitação da frequência de anúncios</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Medição da eficácia de campanhas</span>
                    </li>
                    </ul>
                    <div className="border-t border-gray-100 pt-8 mt-8">
                    <h3 className="text-lg font-light mb-4 tracking-wide">Controle personalizado:</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Você pode ajustar essas preferências a qualquer momento através do nosso Painel de Privacidade.
                    </p>
                    </div>
                </motion.div>
                )}
            </motion.div>

            {/* Consent Manager - Minimal design */}
            <motion.div
                className="md:w-1/3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="border border-gray-100 p-8 sticky top-32">
                <h3 className="text-lg font-light mb-8 tracking-wide flex items-center">
                    <Settings className="mr-2" size={18} strokeWidth={1.5} />
                    Gerenciar Preferências
                </h3>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-light">Essenciais</h4>
                        <p className="text-sm text-gray-500 font-light mt-1">Sempre ativos</p>
                    </div>
                    <div className="text-gray-400">
                        <Shield size={16} strokeWidth={1.5} />
                    </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                        <h4 className="font-light">Analytics</h4>
                        <p className="text-sm text-gray-500 font-light mt-1">Melhorar nosso site</p>
                        </div>
                        <div
                        className={`relative w-10 h-5 transition-colors ${
                            cookieConsent.analytics ? "bg-gray-900" : "bg-gray-200"
                        }`}
                        onClick={() => handleConsentChange("analytics")}
                        >
                        <div
                            className={`absolute w-4 h-4 bg-white transition-transform ${
                            cookieConsent.analytics ? "transform translate-x-5" : "transform translate-x-0.5"
                            } top-0.5`}
                        />
                        </div>
                    </label>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                        <h4 className="font-light">Marketing</h4>
                        <p className="text-sm text-gray-500 font-light mt-1">Conteúdo personalizado</p>
                        </div>
                        <div
                        className={`relative w-10 h-5 transition-colors ${
                            cookieConsent.marketing ? "bg-gray-900" : "bg-gray-200"
                        }`}
                        onClick={() => handleConsentChange("marketing")}
                        >
                        <div
                            className={`absolute w-4 h-4 bg-white transition-transform ${
                            cookieConsent.marketing ? "transform translate-x-5" : "transform translate-x-0.5"
                            } top-0.5`}
                        />
                        </div>
                    </label>
                    </div>
                </div>

                <button
                    className="mt-12 w-full border border-gray-900 text-gray-900 px-4 py-3 font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300"
                    onClick={() => alert("Preferências salvas com sucesso")}
                >
                    Salvar Configurações
                </button>
                </div>
            </motion.div>
            </div>
        </section>

        {/* Technical Details - Clean table */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-16 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Detalhes Técnicos
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h3 className="text-lg font-light mb-8 tracking-wide">Tempo de Armazenamento</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-8">
                Os cookies podem ser armazenados por períodos variados:
                </p>

                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b border-gray-200">
                        <th className="pb-4 font-light text-gray-900 tracking-wide">Tipo</th>
                        <th className="pb-4 font-light text-gray-900 tracking-wide">Duração</th>
                        <th className="pb-4 font-light text-gray-900 tracking-wide">Fornecedor</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="py-4 font-light text-gray-600">Sessão</td>
                        <td className="py-4 font-light text-gray-600">Enquanto o navegador estiver aberto</td>
                        <td className="py-4 font-light text-gray-600">Prestige Motors</td>
                    </tr>
                    <tr>
                        <td className="py-4 font-light text-gray-600">Persistentes</td>
                        <td className="py-4 font-light text-gray-600">Até 12 meses</td>
                        <td className="py-4 font-light text-gray-600">Google Analytics</td>
                    </tr>
                    <tr>
                        <td className="py-4 font-light text-gray-600">Publicitários</td>
                        <td className="py-4 font-light text-gray-600">Até 6 meses</td>
                        <td className="py-4 font-light text-gray-600">Meta Pixel</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </motion.div>
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
                Dúvidas Sobre Cookies?
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
                Nossa equipe de proteção de dados está à disposição para esclarecimentos.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <button className="border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 group flex items-center mx-auto">
                <span>Falar com Especialista</span>
                <ArrowRight
                    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                    size={18}
                    strokeWidth={1.5}
                />
                </button>
            </motion.div>
            </div>
        </section>
        </div>
    )
}

export default CookiePolicyPage
