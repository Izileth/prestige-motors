// src/pages/CookiePolicyPage.tsx
import { motion } from "framer-motion";
import { Cookie, Settings, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";

const CookiePolicyPage = () => {
    const [activeTab, setActiveTab] = useState<"essenciais" | "analytics" | "marketing">("essenciais");
    const [cookieConsent, setCookieConsent] = useState({
        essential: true,
        analytics: false,
        marketing: false,
    });

    const handleConsentChange = (type: keyof typeof cookieConsent) => {
        setCookieConsent(prev => ({
        ...prev,
        [type]: !prev[type]
        }));
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
        {/* Hero Section */}
        <motion.section 
            className="relative h-[40vh] bg-neutral-900 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div 
            className="absolute inset-0 bg-[url('/images/cookies-hero.jpg')] bg-cover bg-center opacity-30"
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
                Política de Cookies
            </motion.h1>
            <motion.p 
                className="text-xl text-neutral-300 max-w-2xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Transparência no uso de tecnologias para melhorar sua experiência
            </motion.p>
            </div>
        </motion.section>

        {/* Cookie Types Navigation */}
        <section className="py-12 bg-white border-b border-neutral-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4">
            <motion.div 
                className="flex overflow-x-auto pb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <button
                onClick={() => setActiveTab("essenciais")}
                className={`flex items-center px-6 py-3 whitespace-nowrap ${activeTab === "essenciais" ? "text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                <Shield size={18} className="mr-2" />
                Cookies Essenciais
                </button>
                <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center px-6 py-3 whitespace-nowrap ${activeTab === "analytics" ? "text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                <Settings size={18} className="mr-2" />
                Cookies de Analytics
                </button>
                <button
                onClick={() => setActiveTab("marketing")}
                className={`flex items-center px-6 py-3 whitespace-nowrap ${activeTab === "marketing" ? "text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                <Cookie size={18} className="mr-2" />
                Cookies de Marketing
                </button>
            </motion.div>
            </div>
        </section>

        {/* Cookie Content */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
            {/* Main Content */}
            <motion.div 
                className="md:w-2/3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {activeTab === "essenciais" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-bold mb-6">Cookies Essenciais</h2>
                    <p className="text-neutral-700 mb-6">
                    Esses cookies são necessários para o funcionamento básico do site e não podem ser desativados. Eles garantem funcionalidades como:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                    <li>Segurança e prevenção de fraudes</li>
                    <li>Manutenção de sessão do usuário</li>
                    <li>Carregamento balanceado do servidor</li>
                    <li>Preferências de consentimento de cookies</li>
                    </ul>
                    <div className="bg-neutral-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Exemplos de uso:</h3>
                    <p className="text-neutral-700">
                        Quando você adiciona um veículo à sua lista de favoritos, utilizamos cookies essenciais para manter essa informação durante sua navegação.
                    </p>
                    </div>
                </motion.div>
                )}

                {activeTab === "analytics" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-bold mb-6">Cookies de Analytics</h2>
                    <p className="text-neutral-700 mb-6">
                    Esses cookies nos ajudam a entender como os visitantes interagem com nosso site, fornecendo informações sobre:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                    <li>Páginas mais visitadas</li>
                    <li>Padrões de navegação</li>
                    <li>Desempenho de carregamento</li>
                    <li>Possíveis erros encontrados</li>
                    </ul>
                    <div className="bg-neutral-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Como utilizamos esses dados:</h3>
                    <p className="text-neutral-700">
                        As informações são agregadas e anônimas, nos permitindo melhorar a organização do conteúdo e a performance técnica do site.
                    </p>
                    </div>
                </motion.div>
                )}

                {activeTab === "marketing" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-bold mb-6">Cookies de Marketing</h2>
                    <p className="text-neutral-700 mb-6">
                    Esses cookies são usados para personalizar anúncios e conteúdo de acordo com seus interesses, tanto em nosso site como em outras plataformas.
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                    <li>Exibição de veículos alinhados ao seu perfil</li>
                    <li>Limitação da frequência de anúncios</li>
                    <li>Medição da eficácia de campanhas</li>
                    </ul>
                    <div className="bg-neutral-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Controle personalizado:</h3>
                    <p className="text-neutral-700">
                        Você pode ajustar essas preferências a qualquer momento através do nosso Painel de Privacidade.
                    </p>
                    </div>
                </motion.div>
                )}
            </motion.div>

            {/* Consent Manager */}
            <motion.div 
                className="md:w-1/3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 sticky top-32">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Settings className="mr-2" size={20} />
                    Gerenciar Preferências
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Essenciais</h4>
                        <p className="text-sm text-neutral-500">Sempre ativos</p>
                    </div>
                    <div className="bg-neutral-100 rounded-full p-1">
                        <Shield className="text-neutral-900" size={18} />
                    </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                        <h4 className="font-medium">Analytics</h4>
                        <p className="text-sm text-neutral-500">Melhorar nosso site</p>
                        </div>
                        <div 
                        className={`relative w-12 h-6 rounded-full transition-colors ${cookieConsent.analytics ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                        onClick={() => handleConsentChange("analytics")}
                        >
                        <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${cookieConsent.analytics ? 'transform translate-x-6' : 'transform translate-x-1'} top-0.5`} />
                        </div>
                    </label>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                        <h4 className="font-medium">Marketing</h4>
                        <p className="text-sm text-neutral-500">Conteúdo personalizado</p>
                        </div>
                        <div 
                        className={`relative w-12 h-6 rounded-full transition-colors ${cookieConsent.marketing ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                        onClick={() => handleConsentChange("marketing")}
                        >
                        <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${cookieConsent.marketing ? 'transform translate-x-6' : 'transform translate-x-1'} top-0.5`} />
                        </div>
                    </label>
                    </div>
                </div>

                <button 
                    className="mt-6 w-full bg-neutral-900 text-neutral-50 px-4 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors"
                    onClick={() => alert("Preferências salvas com sucesso")}
                >
                    Salvar Configurações
                </button>
                </div>
            </motion.div>
            </div>
        </section>

        {/* Technical Details */}
        <section className="py-20 bg-neutral-100">
            <div className="max-w-4xl mx-auto px-4">
            <motion.h2
                className="text-3xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                Detalhes Técnicos
            </motion.h2>

            <motion.div 
                className="bg-white p-8 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h3 className="text-xl font-bold mb-4">Tempo de Armazenamento</h3>
                <p className="text-neutral-700 mb-6">
                Os cookies podem ser armazenados por períodos variados:
                </p>
                
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-neutral-200">
                    <tr>
                        <th className="pb-3 font-medium">Tipo</th>
                        <th className="pb-3 font-medium">Duração</th>
                        <th className="pb-3 font-medium">Fornecedor</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                    <tr>
                        <td className="py-3">Sessão</td>
                        <td className="py-3">Enquanto o navegador estiver aberto</td>
                        <td className="py-3">Prestige Motors</td>
                    </tr>
                    <tr>
                        <td className="py-3">Persistentes</td>
                        <td className="py-3">Até 12 meses</td>
                        <td className="py-3">Google Analytics</td>
                    </tr>
                    <tr>
                        <td className="py-3">Publicitários</td>
                        <td className="py-3">Até 6 meses</td>
                        <td className="py-3">Meta Pixel</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </motion.div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-zinc-950 text-neutral-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                Dúvidas Sobre Cookies?
            </motion.h2>
            <motion.p
                className="text-xl mb-8 text-neutral-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Nossa equipe de proteção de dados está à disposição para esclarecimentos.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <button className="bg-transparent border-2 border-neutral-50 text-neutral-50 px-8 py-3 rounded-full font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors flex items-center mx-auto">
                Falar com Especialista <ArrowRight className="ml-2" size={20} />
                </button>
            </motion.div>
            </div>
        </section>
        </div>
    );
};

export default CookiePolicyPage;