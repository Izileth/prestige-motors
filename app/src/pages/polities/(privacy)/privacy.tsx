
import { motion } from "framer-motion";
import { Shield, Lock, Database, ArrowRight } from "lucide-react";

const PrivacyPolicyPage = () => {
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
            className="absolute inset-0 bg-[url('/images/privacy-hero.jpg')] bg-cover bg-center opacity-30"
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
                Política de Privacidade
            </motion.h1>
            <motion.p 
                className="text-xl text-neutral-300 max-w-2xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Transparência e segurança no tratamento dos seus dados
            </motion.p>
            </div>
        </motion.section>

        {/* Privacy Principles */}
        <section className="py-20 bg-neutral-100">
            <div className="max-w-6xl mx-auto px-4">
            <motion.h2
                className="text-3xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                Nossos Princípios de Privacidade
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
                    <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Proteção Rigorosa</h3>
                <p className="text-neutral-700">
                    Seus dados são armazenados com criptografia de nível bancário e acessíveis apenas a pessoal autorizado.
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
                    <Lock size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Controle Total</h3>
                <p className="text-neutral-700">
                    Você pode gerenciar suas preferências de privacidade a qualquer momento em sua conta.
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
                    <Database size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">Minimização de Dados</h3>
                <p className="text-neutral-700">
                    Coletamos apenas o essencial para fornecer nossos serviços premium.
                </p>
                </motion.div>
            </div>
            </div>
        </section>

        {/* Policy Content */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
            <motion.div
            className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-neutral-100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            <motion.h2
                className="text-2xl font-bold mb-8 border-b border-neutral-200 pb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Política Completa
            </motion.h2>

            <motion.div
                className="prose max-w-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <h3 className="text-xl font-bold mb-4 mt-8">1. Dados Que Coletamos</h3>
                <p className="text-neutral-700 mb-6">
                Para proporcionar a melhor experiência Prestige Motors, podemos coletar:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Informações de contato (nome, e-mail, telefone)</li>
                <li>Dados de pagamento (processados por gateways seguros)</li>
                <li>Histórico de interações com nossos serviços</li>
                <li>Preferências de veículos e serviços</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 mt-8">2. Como Utilizamos Seus Dados</h3>
                <p className="text-neutral-700 mb-4">
                Seus dados nos ajudam a:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Personalizar sua experiência</li>
                <li>Processar transações com segurança</li>
                <li>Melhorar nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 mt-8">3. Compartilhamento de Dados</h3>
                <p className="text-neutral-700 mb-6">
                Seus dados não serão vendidos. Podemos compartilhá-los apenas com:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Parceiros de pagamento certificados</li>
                <li>Prestadores de serviços essenciais (logística, por exemplo)</li>
                <li>Autoridades legais quando exigido por lei</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 mt-8">4. Seus Direitos</h3>
                <p className="text-neutral-700 mb-6">
                Conforme a LGPD, você pode:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                <li>Acessar seus dados pessoais</li>
                <li>Solicitar correção de informações</li>
                <li>Revogar consentimentos</li>
                <li>Excluir dados não necessários</li>
                </ul>

                <div className="bg-neutral-50 p-6 rounded-lg mt-12">
                <h3 className="text-lg font-bold mb-4">Encarregado de Proteção de Dados</h3>
                <p className="text-neutral-700 mb-2">
                    Para exercer seus direitos ou dúvidas sobre privacidade:
                </p>
                <p className="text-neutral-900 font-medium">
                    dpo@prestigemotors.com
                </p>
                </div>
            </motion.div>
            </motion.div>
        </section>

        {/* Updates Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
            <motion.div
            className="border-t border-neutral-200 pt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            <h3 className="text-lg font-bold mb-2">Última Atualização</h3>
            <p className="text-neutral-700 mb-6">15 de Novembro de 2023</p>
            <button className="text-neutral-900 font-medium hover:underline flex items-center mx-auto">
                Histórico de Alterações <ArrowRight className="ml-2" size={16} />
            </button>
            </motion.div>
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
                Dúvidas Sobre Privacidade?
            </motion.h2>
            <motion.p
                className="text-xl mb-8 text-neutral-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Nossa equipe de proteção de dados está à disposição.
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

export default PrivacyPolicyPage;