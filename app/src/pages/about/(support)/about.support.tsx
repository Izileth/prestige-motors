
import { motion } from "framer-motion"
import { Phone, Mail, MessageSquare, Clock, MapPin, ChevronDown } from "lucide-react"
import { useState } from "react"

const SupportPage = () => {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index)
    }

    const faqs = [
        {
        question: "Como verificar a autenticidade de um veículo Prestige Motors?",
        answer:
            "Todos os veículos em nosso catálogo passam por rigorosa verificação de autenticidade. Fornecemos relatórios completos de histórico, incluindo procedência, manutenções e inspeções técnicas. Solicite esses documentos ao seu consultor ou acesse sua área do cliente em nosso site.",
        },
        {
        question: "Qual a política de test-drive para veículos de luxo?",
        answer:
            "Oferecemos test-drives agendados para todos os veículos em nosso portfólio. Para modelos especialmente valiosos, realizamos em locais privativos e seguros. Entre em contato com nosso time de atendimento para agendar sua experiência personalizada.",
        },
        {
        question: "Vocês oferecem serviço de entrega internacional?",
        answer:
            "Sim, organizamos entregas internacionais com todo o cuidado necessário. Nossa equipe logística cuida de toda a documentação, transporte seguro e entrega personalizada. Os custos e prazos variam conforme o destino e serão apresentados em orçamento detalhado.",
        },
        {
        question: "Como funciona o programa de pós-venda Prestige?",
        answer:
            "Nosso programa exclusivo inclui: assistência 24h, agendamento prioritário em oficinas parceiras, eventos exclusivos para clientes e acompanhamento personalizado. Todos os detalhes serão explicados durante o processo de compra e documentados em seu contrato.",
        },
        {
        question: "Quais são as opções de pagamento disponíveis?",
        answer:
            "Aceitamos diversas formas de pagamento: transferência bancária, financiamento através de nossos parceiros premium, consórcio de luxo e cartões de crédito (com limites especiais para clientes selecionados). Nossos consultores podem orientá-lo sobre a melhor opção para seu perfil.",
        },
    ]

    // Animation variants
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
            className="absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/69533692-5801-4ec0-9617-369725398cdc/Leonardo_Kino_XL_Stylized_image_of_the_Prestige_Motors_custome_2.jpg')] bg-cover bg-center opacity-5"
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
                Suporte Prestige
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
                Assistência excepcional para clientes exigentes
            </motion.p>
            </div>
        </motion.section>

        {/* Contact Channels - Clean, minimal cards */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.h2
            className="text-2xl font-light text-center mb-20 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            Canais de Atendimento
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <motion.div
                className="border-t border-gray-100 pt-8 px-6 flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
            >
                <div className="border border-gray-200 p-4 rounded-full mb-8 text-gray-700">
                <Phone size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Telefone</h3>
                <p className="text-gray-600 font-light mb-6 leading-relaxed">
                Atendimento personalizado 24h para clientes Prestige
                </p>
                <a href="tel:+5511999999999" className="text-gray-900 hover:text-gray-600 transition-colors">
                +55 11 99999-9999
                </a>
                <div className="flex items-center mt-4 text-gray-500 text-sm">
                <Clock size={14} className="mr-2" strokeWidth={1.5} />
                <span className="font-light">24 horas / 7 dias</span>
                </div>
            </motion.div>

            {/* Email */}
            <motion.div
                className="border-t border-gray-100 pt-8 px-6 flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
            >
                <div className="border border-gray-200 p-4 rounded-full mb-8 text-gray-700">
                <Mail size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">E-mail</h3>
                <p className="text-gray-600 font-light mb-6 leading-relaxed">
                Resposta garantida em até 4 horas para clientes registrados
                </p>
                <a href="mailto:suporte@prestigemotors.com" className="text-gray-900 hover:text-gray-600 transition-colors">
                suporte@prestigemotors.com
                </a>
                <div className="flex items-center mt-4 text-gray-500 text-sm">
                <Clock size={14} className="mr-2" strokeWidth={1.5} />
                <span className="font-light">Resposta em até 4h</span>
                </div>
            </motion.div>

            {/* Chat */}
            <motion.div
                className="border-t border-gray-100 pt-8 px-6 flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
            >
                <div className="border border-gray-200 p-4 rounded-full mb-8 text-gray-700">
                <MessageSquare size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Chat Online</h3>
                <p className="text-gray-600 font-light mb-6 leading-relaxed">
                Atendimento imediato via chat com nossos especialistas
                </p>
                <button className="border border-gray-900 text-gray-900 px-8 py-2 font-light hover:bg-gray-900 hover:text-white transition-colors duration-300">
                Iniciar Chat
                </button>
                <div className="flex items-center mt-4 text-gray-500 text-sm">
                <Clock size={14} className="mr-2" strokeWidth={1.5} />
                <span className="font-light">08h-20h (GMT-3)</span>
                </div>
            </motion.div>
            </div>
        </section>

        {/* FAQ Section - Minimal accordions */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-20 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Perguntas Frequentes
            </motion.h2>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                <motion.div
                    key={index}
                    className="border-b border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <button
                    className="w-full py-5 text-left flex justify-between items-center font-light"
                    onClick={() => toggleFaq(index)}
                    >
                    <span className="text-base md:text-lg">{faq.question}</span>
                    <ChevronDown
                        size={20}
                        strokeWidth={1.5}
                        className={`transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`}
                    />
                    </button>
                    <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: activeFaq === index ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    <div className="text-gray-600 font-light pb-5 leading-relaxed">{faq.answer}</div>
                    </motion.div>
                </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* Showrooms Section - Clean layout */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.h2
            className="text-2xl font-light text-center mb-20 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            Nossos Showrooms
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-16">
            {/* São Paulo */}
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="aspect-[16/9] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/64050fe0-c6b2-4fc7-808e-2d9992c0ac09/Leonardo_Kino_XL_Photorealistic_architectural_image_of_the_Pre_0.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="pt-8">
                <h3 className="text-xl font-light mb-6 tracking-wide">São Paulo</h3>
                <div className="flex items-start mb-4">
                    <MapPin size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-gray-600 font-light">Avenida Brigadeiro Faria Lima, 2277 - Jardim Paulistano</p>
                </div>
                <div className="flex items-start mb-6">
                    <Clock size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-gray-600 font-light">
                    Segunda a Sexta: 09h-19h <br />
                    Sábado: 10h-16h
                    </p>
                </div>
                <button className="border border-gray-900 text-gray-900 px-8 py-2 font-light hover:bg-gray-900 hover:text-white transition-colors duration-300 group flex items-center">
                    <span>Ver no Mapa</span>
                    <MapPin
                    size={16}
                    className="ml-2 transition-transform duration-300 group-hover:translate-y-[-2px]"
                    strokeWidth={1.5}
                    />
                </button>
                </div>
            </motion.div>

            {/* Rio de Janeiro */}
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="aspect-[16/9] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/914a7d2d-7946-4eb8-a270-7b7318373ff1/Leonardo_Kino_XL_Nighttime_image_of_the_Prestige_Motors_headqu_0.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="pt-8">
                <h3 className="text-xl font-light mb-6 tracking-wide">Rio de Janeiro</h3>
                <div className="flex items-start mb-4">
                    <MapPin size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-gray-600 font-light">Avenida Ayrton Senna, 3000 - Barra da Tijuca</p>
                </div>
                <div className="flex items-start mb-6">
                    <Clock size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-gray-600 font-light">
                    Segunda a Sexta: 09h-19h <br />
                    Sábado: 10h-16h
                    </p>
                </div>
                <button className="border border-gray-900 text-gray-900 px-8 py-2 font-light hover:bg-gray-900 hover:text-white transition-colors duration-300 group flex items-center">
                    <span>Ver no Mapa</span>
                    <MapPin
                    size={16}
                    className="ml-2 transition-transform duration-300 group-hover:translate-y-[-2px]"
                    strokeWidth={1.5}
                    />
                </button>
                </div>
            </motion.div>
            </div>
        </section>

        {/* Emergency Contact - Minimal and elegant */}
        <section className="py-24 bg-zinc-950 text-white">
            <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.h2
                className="text-2xl font-light mb-8 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Assistência de Emergência 24h
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
                Para clientes Prestige Motors em situações críticas com seus veículos
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <a
                href="tel:+5511999998888"
                className="inline-block border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 group -center mx-auto justify-center"
                >
                <Phone size={18} strokeWidth={1.5} className="mr-3" />
                <span>+55 11 99999-8888</span>
                </a>
            </motion.div>
            </div>
        </section>
        </div>
    )
}

export default SupportPage
