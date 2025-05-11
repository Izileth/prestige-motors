import { motion } from "framer-motion"
import { Shield, Lock, Database, ArrowRight } from "lucide-react"

const PrivacyPolicyPage = () => {
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
                Política de Privacidade
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
                Transparência e segurança no tratamento dos seus dados
            </motion.p>
            </div>
        </motion.section>

        {/* Privacy Principles - Minimal cards */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-20 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Nossos Princípios de Privacidade
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
                    <Shield size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Proteção Rigorosa</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Seus dados são armazenados com criptografia de nível bancário e acessíveis apenas a pessoal autorizado.
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
                    <Lock size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Controle Total</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Você pode gerenciar suas preferências de privacidade a qualquer momento em sua conta.
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
                    <Database size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Minimização de Dados</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Coletamos apenas o essencial para fornecer nossos serviços premium.
                </p>
                </motion.div>
            </div>
            </div>
        </section>

        {/* Policy Content - Clean, minimal design */}
        <section className="py-24 px-4 max-w-3xl mx-auto">
            <motion.div
            className="border-t border-gray-100 pt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            <motion.h2
                className="text-2xl font-light mb-16 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Política Completa
            </motion.h2>

            <motion.div
                className="space-y-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wide">1. Dados Que Coletamos</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Para proporcionar a melhor experiência Prestige Motors, podemos coletar:
                </p>
                <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Informações de contato (nome, e-mail, telefone)</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Dados de pagamento (processados por gateways seguros)</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Histórico de interações com nossos serviços</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Preferências de veículos e serviços</span>
                    </li>
                </ul>
                </div>

                <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wide">2. Como Utilizamos Seus Dados</h3>
                <p className="text-gray-600 font-light leading-relaxed">Seus dados nos ajudam a:</p>
                <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Personalizar sua experiência</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Processar transações com segurança</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Melhorar nossos serviços</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Cumprir obrigações legais</span>
                    </li>
                </ul>
                </div>

                <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wide">3. Compartilhamento de Dados</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Seus dados não serão vendidos. Podemos compartilhá-los apenas com:
                </p>
                <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Parceiros de pagamento certificados</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Prestadores de serviços essenciais (logística, por exemplo)</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Autoridades legais quando exigido por lei</span>
                    </li>
                </ul>
                </div>

                <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wide">4. Seus Direitos</h3>
                <p className="text-gray-600 font-light leading-relaxed">Conforme a LGPD, você pode:</p>
                <ul className="space-y-3 text-gray-600 font-light">
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Acessar seus dados pessoais</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Solicitar correção de informações</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Revogar consentimentos</span>
                    </li>
                    <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span>Excluir dados não necessários</span>
                    </li>
                </ul>
                </div>

                <div className="border-t border-gray-100 pt-12 mt-16">
                <h3 className="text-lg font-light mb-6 tracking-wide">Encarregado de Proteção de Dados</h3>
                <p className="text-gray-600 font-light mb-4">Para exercer seus direitos ou dúvidas sobre privacidade:</p>
                <p className="text-gray-900">dpo@prestigemotors.com</p>
                </div>
            </motion.div>
            </motion.div>
        </section>

        {/* Updates Section - Minimal design */}
        <section className="py-16 px-4 max-w-3xl mx-auto">
            <motion.div
            className="border-t border-gray-100 pt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            <h3 className="text-base font-light mb-2 tracking-wide">Última Atualização</h3>
            <p className="text-gray-600 font-light mb-8">15 de Novembro de 2023</p>
            <button className="group flex items-center mx-auto text-gray-900 font-light hover:text-gray-600 transition-colors">
                <span>Histórico de Alterações</span>
                <ArrowRight
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                size={16}
                strokeWidth={1.5}
                />
            </button>
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
                Dúvidas Sobre Privacidade?
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
                Nossa equipe de proteção de dados está à disposição.
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

export default PrivacyPolicyPage
