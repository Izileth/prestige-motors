import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

const TermsPage = () => {
    const [activeSection, setActiveSection] = useState<string | null>("uso")

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
                className="text-3xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight"
                variants={fadeInUp}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                Termos & Condições
            </motion.h1>
            <motion.div
                className="h-px w-16 bg-gray-300 mx-auto mb-8"
                variants={fadeIn}
                transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
                className="text-base text-gray-500 max-w-xl mx-auto font-light"
                variants={fadeInUp}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                Conheça os princípios que regem nossa relação com você
            </motion.p>
            </div>
        </motion.section>

        {/* Content Section - Clean layout */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.div
            className="flex flex-col md:flex-row gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            {/* Sidebar Navigation - Minimal design */}
            <motion.div
                className="md:w-1/4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="sticky top-28">
                <h3 className="text-base font-light mb-8 tracking-wide text-gray-900">Seções</h3>
                <nav className="space-y-5">
                    <button
                    onClick={() => setActiveSection("uso")}
                    className={`w-full text-left py-1 transition-colors font-light text-sm ${
                        activeSection === "uso"
                        ? "text-gray-900 border-l-2 border-gray-900 pl-4"
                        : "text-gray-500 hover:text-gray-900 pl-4"
                    }`}
                    >
                    Termos de Uso
                    </button>
                    <button
                    onClick={() => setActiveSection("vendas")}
                    className={`w-full text-left py-1 transition-colors font-light text-sm ${
                        activeSection === "vendas"
                        ? "text-gray-900 border-l-2 border-gray-900 pl-4"
                        : "text-gray-500 hover:text-gray-900 pl-4"
                    }`}
                    >
                    Condições de Venda
                    </button>
                    <button
                    onClick={() => setActiveSection("privacidade")}
                    className={`w-full text-left py-1 transition-colors font-light text-sm ${
                        activeSection === "privacidade"
                        ? "text-gray-900 border-l-2 border-gray-900 pl-4"
                        : "text-gray-500 hover:text-gray-900 pl-4"
                    }`}
                    >
                    Política de Privacidade
                    </button>
                    <button
                    onClick={() => setActiveSection("garantia")}
                    className={`w-full text-left py-1 transition-colors font-light text-sm ${
                        activeSection === "garantia"
                        ? "text-gray-900 border-l-2 border-gray-900 pl-4"
                        : "text-gray-500 hover:text-gray-900 pl-4"
                    }`}
                    >
                    Garantias
                    </button>
                    <button
                    onClick={() => setActiveSection("devolucao")}
                    className={`w-full text-left py-1 transition-colors font-light text-sm ${
                        activeSection === "devolucao"
                        ? "text-gray-900 border-l-2 border-gray-900 pl-4"
                        : "text-gray-500 hover:text-gray-900 pl-4"
                    }`}
                    >
                    Política de Devolução
                    </button>
                </nav>
                </div>
            </motion.div>

            {/* Main Content - Clean, minimal design */}
            <motion.div
                className="md:w-3/4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Termos de Uso */}
                {activeSection === "uso" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Termos de Uso</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Ao acessar e utilizar os serviços da Prestige Motors, você concorda com estes Termos de Uso.
                    </p>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">1. Uso do Site</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        O conteúdo deste site é destinado exclusivamente para fins informativos. Você concorda em não
                        utilizar nossas plataformas para:
                    </p>
                    <ul className="space-y-2 text-gray-600 font-light pl-5">
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Finalidades ilegais ou não autorizadas</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Violar direitos de propriedade intelectual</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Transmitir conteúdo malicioso ou prejudicial</span>
                        </li>
                    </ul>
                    </div>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">2. Propriedade Intelectual</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Todo o conteúdo, logotipos, imagens e softwares presentes no site são propriedade exclusiva da
                        Prestige Motors ou de seus licenciadores, protegidos por leis de direitos autorais e marcas
                        registradas.
                    </p>
                    </div>
                </motion.div>
                )}

                {/* Condições de Venda */}
                {activeSection === "vendas" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Condições de Venda</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Estas condições regulam todas as transações realizadas através da Prestige Motors.
                    </p>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">1. Processo de Compra</h3>
                    <p className="text-gray-600 font-light leading-relaxed">A finalização da compra está sujeita a:</p>
                    <ul className="space-y-2 text-gray-600 font-light pl-5">
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Disponibilidade do veículo</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Verificação de documentos</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Aprovação de pagamento</span>
                        </li>
                    </ul>
                    </div>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">2. Preços e Pagamento</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Todos os preços são exibidos em Reais (R$) e incluem impostos quando aplicável. Aceitamos as
                        seguintes formas de pagamento:
                    </p>
                    </div>
                </motion.div>
                )}

                {/* Política de Privacidade */}
                {activeSection === "privacidade" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Política de Privacidade</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Sua privacidade é fundamental para nós. Esta política explica como coletamos e utilizamos suas
                    informações.
                    </p>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">1. Dados Coletados</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Podemos coletar as seguintes informações:</p>
                    <ul className="space-y-2 text-gray-600 font-light pl-5">
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Dados de contato (nome, e-mail, telefone)</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Informações de pagamento (processadas por gateways seguros)</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Dados de navegação (cookies, endereço IP)</span>
                        </li>
                    </ul>
                    </div>
                </motion.div>
                )}

                {/* Garantias */}
                {activeSection === "garantia" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Garantias</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Todos os veículos Prestige Motors possuem garantia conforme especificado abaixo.
                    </p>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">1. Cobertura</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Nossas garantias cobrem:</p>
                    <ul className="space-y-2 text-gray-600 font-light pl-5">
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Defeitos de fabricação</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Problemas mecânicos não decorrentes de uso inadequado</span>
                        </li>
                        <li className="flex items-start">
                        <span className="text-gray-400 mr-3">—</span>
                        <span>Componentes elétricos originais</span>
                        </li>
                    </ul>
                    </div>
                </motion.div>
                )}

                {/* Política de Devolução */}
                {activeSection === "devolucao" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-light mb-8 tracking-wide">Política de Devolução</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                    Em casos específicos, aceitamos a devolução de veículos conforme estas condições.
                    </p>

                    <div className="space-y-4">
                    <h3 className="text-lg font-light tracking-wide">1. Direito de Arrependimento</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Você tem até 7 dias corridos, a partir da entrega, para desistir da compra.
                    </p>
                    </div>
                </motion.div>
                )}

                {/* Last Updated */}
                <motion.div
                className="mt-16 pt-6 border-t border-gray-100 text-sm text-gray-400 font-light"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                >
                <p>Última atualização: 15 de Novembro de 2023</p>
                </motion.div>
            </motion.div>
            </motion.div>
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
                Ainda com dúvidas?
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
                Nossa equipe jurídica está à disposição para esclarecimentos.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <button className="border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 group flex items-center mx-auto">
                <span>Contatar Jurídico</span>
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

export default TermsPage
