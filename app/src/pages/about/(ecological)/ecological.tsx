

import { motion } from "framer-motion"
import { Leaf, Recycle, BatteryCharging, ArrowRight } from "lucide-react"

const SustainabilityPage = () => {
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
            className="relative h-[70vh] flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
        >
            <motion.div
            className="absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_1.jpg')] bg-cover bg-center opacity-5"
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
                Sustentabilidade Prestige
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
                Luxo e responsabilidade ambiental em perfeita harmonia
            </motion.p>
            </div>
        </motion.section>

        {/* Philosophy Section - Clean layout */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
            <div>
                <motion.div
                className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/69533692-5801-4ec0-9617-369725398cdc/Leonardo_Kino_XL_Stylized_image_of_the_Prestige_Motors_custome_0.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                />
            </div>
            <div>
                <div className="h-px w-12 bg-gray-200 mb-8" />
                <motion.h2
                className="text-2xl font-light mb-6 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                >
                Nossa Filosofia Verde
                </motion.h2>
                <motion.p
                className="text-gray-600 mb-8 font-light leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                >
                Na Prestige Motors, acreditamos que o verdadeiro luxo deve ser sustentável. Nosso compromisso vai além dos
                veículos - é com o futuro do planeta.
                </motion.p>
                <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                >
                <button className="group flex items-center text-gray-900 font-light hover:text-gray-600 transition-colors">
                    <span>Conheça nosso relatório ambiental anual</span>
                    <ArrowRight
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    size={18}
                    strokeWidth={1.5}
                    />
                </button>
                </motion.div>
            </div>
            </motion.div>
        </section>

        {/* Initiatives Section - Minimal cards */}
        <section className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
            <motion.h2
                className="text-2xl font-light text-center mb-20 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Nossas Iniciativas
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
                {/* Initiative 1 */}
                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <Leaf size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Mobilidade Elétrica</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Curated selection of the finest electric vehicles with carbon-neutral delivery options.
                </p>
                </motion.div>

                {/* Initiative 2 */}
                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <Recycle size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Programa de Reciclagem</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Pioneiros na reciclagem de 95% dos componentes de veículos descomissionados.
                </p>
                </motion.div>

                {/* Initiative 3 */}
                <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                >
                <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                    <BatteryCharging size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-4 tracking-wide">Energia Renovável</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                    Nossos showrooms operam com 100% de energia solar e eólica.
                </p>
                </motion.div>
            </div>
            </div>
        </section>

        {/* Electric Fleet Section - Clean layout */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <motion.h2
            className="text-2xl font-light text-center mb-20 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            Frota Elétrica Prestige
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-16">
            <motion.div
                className="flex flex-col justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="h-px w-12 bg-gray-200 mb-8" />
                <h3 className="text-xl font-light mb-6 tracking-wide">O Futuro do Luxo Automotivo</h3>
                <p className="text-gray-600 mb-8 font-light leading-relaxed">
                Nossa seleção de veículos elétricos combina desempenho excepcional com zero emissões. Cada modelo passa
                por rigorosos critérios de sustentabilidade sem comprometer o conforto e a potência que nossos clientes
                esperam.
                </p>
                <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span className="text-gray-600 font-light">Baterias com materiais 100% recicláveis</span>
                </li>
                <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span className="text-gray-600 font-light">Programa de reciclagem de baterias</span>
                </li>
                <li className="flex items-start">
                    <span className="text-gray-400 mr-3">—</span>
                    <span className="text-gray-600 font-light">Carregamento com energia renovável</span>
                </li>
                </ul>
                <button className="border border-gray-900 text-gray-900 px-8 py-3 font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300 w-fit group flex items-center">
                <span>Explorar Veículos Elétricos</span>
                <ArrowRight
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    size={18}
                    strokeWidth={1.5}
                />
                </button>
            </motion.div>

            <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="aspect-square bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_1.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="aspect-square bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_0.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="aspect-square bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_3.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="aspect-square bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/02039cb9-b3bc-411e-b4f4-a37e587b8f2e/Leonardo_Kino_XL_Imagem_estilizada_da_equipe_de_atendimento_da_0.jpg?w=512')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
            </div>
        </section>

        {/* Carbon Neutral Section - Minimal design */}
        <section className="py-24 bg-zinc-950 text-white">
            <div className="max-w-5xl mx-auto px-4">
            <motion.div
                className="grid md:grid-cols-2 gap-16 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div>
                <div className="h-px w-12 bg-gray-700 mb-8" />
                <motion.h2
                    className="text-2xl font-light mb-6 tracking-wide"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Compromisso Carbono Neutro
                </motion.h2>
                <motion.p
                    className="text-gray-400 mb-10 font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Desde 2020, compensamos 100% das emissões de carbono geradas por nossas operações através de projetos de
                    reflorestamento e energia limpa.
                </motion.p>
                <motion.div
                    className="flex items-baseline space-x-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-4xl font-light tracking-tight">100%</div>
                    <div className="text-gray-400 font-light">emissões compensadas</div>
                </motion.div>
                </div>
                <div>
                <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/02039cb9-b3bc-411e-b4f4-a37e587b8f2e/Leonardo_Kino_XL_Imagem_estilizada_da_equipe_de_atendimento_da_0.jpg?w=512')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
            </motion.div>
            </div>
        </section>

        {/* CTA Section - Minimal and elegant */}
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.h2
                className="text-2xl font-light mb-8 tracking-wide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Junte-se ao Movimento
            </motion.h2>
            <motion.div
                className="h-px w-16 bg-gray-300 mx-auto mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.p
                className="text-lg mb-12 text-gray-600 font-light max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                Descubra como você pode fazer parte dessa jornada sustentável.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
            >
                <button className="border border-gray-900 text-gray-900 px-10 py-3 font-light tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-300 group flex items-center mx-auto">
                <span>Falar com um Consultor Verde</span>
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

export default SustainabilityPage
