
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const AboutUsPage = () => {
    // Animation variants for consistent effects
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }

    const slideUp = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section - Minimalist approach */}
        <motion.section
            className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
        >
            <motion.div
            className=" absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/83022ec1-b02f-4d56-a854-9e223ff6886b/Leonardo_Kino_XL_Cinematic_image_capturing_the_Prestige_Motors_0.jpg')] bg-cover bg-center opacity-10"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            />

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.h1
                className="text-4xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight"
                variants={slideUp}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                Nossa História
            </motion.h1>
            <motion.div
                className="h-px w-16 bg-gray-400 mx-auto mb-8"
                variants={fadeIn}
                transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.p
                className="text-lg text-gray-600 max-w-xl mx-auto font-light"
                variants={slideUp}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                A jornada da Prestige Motors em redefinir o luxo automotivo
            </motion.p>
            </div>
        </motion.section>

        {/* Timeline Section - Clean, minimal layout */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.h2
            className="text-2xl font-light text-center mb-20 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            Nossa Trajetória
            </motion.h2>

            <div className="space-y-24">
            {/* Timeline Item 1 */}
            <motion.div
                className="grid md:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="md:order-1">
                <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/83022ec1-b02f-4d56-a854-9e223ff6886b/Leonardo_Kino_XL_Cinematic_image_capturing_the_Prestige_Motors_2.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="md:order-2">
                <div className="h-px w-12 bg-gray-300 mb-6" />
                <h3 className="text-xl font-light mb-4">2005 — Fundação</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    A Prestige Motors nasceu da visão de dois entusiastas de automóveis que buscavam criar um espaço onde a
                    excelência e o luxo se encontrassem. Nosso primeiro showroom em São Paulo marcou o início de uma
                    revolução no mercado de veículos premium.
                </p>
                </div>
            </motion.div>

            {/* Timeline Item 2 */}
            <motion.div
                className="grid md:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div>
                <div className="h-px w-12 bg-gray-300 mb-6" />
                <h3 className="text-xl font-light mb-4">2012 — Expansão Internacional</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Com a abertura de nosso primeiro escritório em Miami, consolidamos nossa presença no mercado
                    internacional, trazendo veículos exclusivos da Europa e Ásia para clientes exigentes em todo o
                    continente americano.
                </p>
                </div>
                <div>
                <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/64050fe0-c6b2-4fc7-808e-2d9992c0ac09/Leonardo_Kino_XL_Photorealistic_architectural_image_of_the_Pre_1.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
            </motion.div>

            {/* Timeline Item 3 */}
            <motion.div
                className="grid md:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="md:order-1">
                <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/80c9257f-e41e-436f-9a80-8d50893c6d22/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_2.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="md:order-2">
                <div className="h-px w-12 bg-gray-300 mb-6" />
                <h3 className="text-xl font-light mb-4">2018 — Eventos Exclusivos</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Lançamos nossa série de eventos "Prestige Experience", oferecendo aos clientes a oportunidade de dirigir
                    os veículos mais exclusivos em locais paradisíacos, criando uma comunidade de entusiastas de alto
                    padrão.
                </p>
                </div>
            </motion.div>

            {/* Timeline Item 4 */}
            <motion.div
                className="grid md:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div>
                <div className="h-px w-12 bg-gray-300 mb-6" />
                <h3 className="text-xl font-light mb-4">2023 — Plataforma Digital</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Com o lançamento de nossa plataforma digital, democratizamos o acesso a veículos de luxo, mantendo o
                    padrão de excelência e personalização que nos tornou referência no setor.
                </p>
                </div>
                <div>
                <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_3.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
            </motion.div>
            </div>
        </section>

        {/* Values Section - Minimal cards */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-20 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Nossos Valores
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                className="p-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                >
                <h3 className="text-lg font-light mb-6 tracking-wide">Excelência</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Cada veículo em nosso portfólio passa por rigorosa inspeção para garantir perfeição. Nosso padrão de
                    qualidade é incomparável.
                </p>
                </motion.div>

                <motion.div
                className="p-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                >
                <h3 className="text-lg font-light mb-6 tracking-wide">Discreção</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Entendemos a importância da privacidade de nossos clientes. Todas as transações são tratadas com
                    absoluto sigilo e profissionalismo.
                </p>
                </motion.div>

                <motion.div
                className="p-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                >
                <h3 className="text-lg font-light mb-6 tracking-wide">Personalização</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Oferecemos serviços sob medida para atender às necessidades específicas de cada cliente, desde busca por
                    veículos raros até entregas exclusivas.
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
                Faça parte da nossa história
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
                Descubra como a Prestige Motors pode transformar sua experiência automotiva.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <button className="border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center mx-auto group">
                <span>Converse com um especialista</span>
                <ArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" size={18} />
                </button>
            </motion.div>
            </div>
        </section>
        </div>
    )
}

export default AboutUsPage
