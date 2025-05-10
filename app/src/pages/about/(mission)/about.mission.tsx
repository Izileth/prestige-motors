import { motion } from "framer-motion"
import { ArrowRight, Trophy, Shield, Heart } from "lucide-react"

const OurMissionPage = () => {
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
          className="absolute grayscale-100 inset-0 bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/80c9257f-e41e-436f-9a80-8d50893c6d22/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_2.jpg')] bg-cover bg-center opacity-5"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight"
            variants={fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Nossa Missão
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
            Redefinindo padrões no universo automotivo de luxo
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Statement - Clean, elegant card */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <motion.div
          className="border-t border-gray-100 pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl font-light mb-12 text-center tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Nossa Razão de Existir
          </motion.h2>

          <motion.p
            className="text-xl text-gray-700 mb-12 text-center font-light italic max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            "Na Prestige Motors, nossa missão é transcender as expectativas no mercado de veículos de luxo, oferecendo
            uma experiência de compra tão excepcional quanto os automóveis que representamos."
          </motion.p>

          <motion.div
            className="w-16 h-px bg-gray-300 mx-auto my-12"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          <motion.p
            className="text-base text-gray-600 max-w-3xl mx-auto text-center font-light leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Acreditamos que adquirir um veículo de luxo deve ser uma jornada memorável, repleta de descobertas e prazer.
            Nosso compromisso vai além da transação - cultivamos relacionamentos duradouros, oferecendo assessoria
            especializada, transparência absoluta e serviços personalizados que atendem às necessidades dos clientes
            mais exigentes.
          </motion.p>
        </motion.div>
      </section>

      {/* Pillars Section - Minimal cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-light text-center mb-20 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Pilares da Prestige Motors
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Pillar 1 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                <Trophy size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-light mb-4 tracking-wide">Excelência Inigualável</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Buscamos a perfeição em cada detalhe, desde a seleção dos veículos até o pós-venda. Nossos padrões
                superam as expectativas do mercado.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                <Shield size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-light mb-4 tracking-wide">Integridade Absoluta</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Agimos com transparência e ética em todas as transações. Cada informação compartilhada é verificada e
                cada promessa é cumprida.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="border border-gray-200 p-5 rounded-full mb-8 text-gray-700">
                <Heart size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-light mb-4 tracking-wide">Paixão Automotiva</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Nossa equipe é formada por verdadeiros entusiastas que compartilham o mesmo amor por automóveis
                excepcionais que nossos clientes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Differentiators Section - Clean layout */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl font-light text-center mb-20 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          O Que Nos Diferencia
        </motion.h2>

        <div className="space-y-24">
          {/* Differentiator 1 */}
          <motion.div
            className="grid md:grid-cols-5 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:col-span-2">
              <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/80c9257f-e41e-436f-9a80-8d50893c6d22/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_1.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="md:col-span-3">
              <div className="h-px w-12 bg-gray-200 mb-6" />
              <h3 className="text-xl font-light mb-6 tracking-wide">Seleção Curada</h3>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                Cada veículo em nosso portfólio passa por um rigoroso processo de seleção. Trabalhamos apenas com os
                melhores exemplares, verificando minuciosamente sua procedência, histórico de manutenção e condições.
              </p>
              <ul className="space-y-3 text-gray-600 font-light">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Inspeção técnica de 212 pontos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Verificação completa de histórico</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Avaliação por especialistas independentes</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Differentiator 2 */}
          <motion.div
            className="grid md:grid-cols-5 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:col-span-3 md:order-1">
              <div className="h-px w-12 bg-gray-200 mb-6" />
              <h3 className="text-xl font-light mb-6 tracking-wide">Experiência Personalizada</h3>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                Entendemos que cada cliente é único. Nossos consultores especializados dedicam tempo para compreender
                suas necessidades e preferências, oferecendo soluções sob medida.
              </p>
              <ul className="space-y-3 text-gray-600 font-light">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Consultoria individualizada</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Test-drives em locais exclusivos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Programa de entrega premium</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2 md:order-2">
              <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/6c3d4134-b64b-4de3-89bf-32f2ecb862bb/Leonardo_Kino_XL_Photorealistic_image_capturing_an_exclusive_P_1.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </motion.div>

          {/* Differentiator 3 */}
          <motion.div
            className="grid md:grid-cols-5 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:col-span-2">
              <div className="aspect-[4/3] bg-[url('https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/69533692-5801-4ec0-9617-369725398cdc/Leonardo_Kino_XL_Stylized_image_of_the_Prestige_Motors_custome_3.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="md:col-span-3">
              <div className="h-px w-12 bg-gray-200 mb-6" />
              <h3 className="text-xl font-light mb-6 tracking-wide">Compromisso Pós-Venda</h3>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                Nosso relacionamento não termina na entrega das chaves. Oferecemos um programa completo de pós-venda
                para garantir que sua experiência com o veículo seja tão extraordinária quanto o processo de aquisição.
              </p>
              <ul className="space-y-3 text-gray-600 font-light">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Assistência 24/7</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Programa de manutenção preferencial</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3">—</span>
                  <span>Eventos exclusivos para clientes</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team CTA - Minimal and elegant */}
      <section className="py-24 bg-zinc-950 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl font-light mb-8 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Conheça Nossa Equipe
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
            Por trás da Prestige Motors está um time de especialistas apaixonados por automóveis e comprometidos com a
            excelência.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <button className="border border-white text-white px-10 py-3 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 flex items-center mx-auto group">
              <span>Ver Equipe</span>
              <ArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OurMissionPage
