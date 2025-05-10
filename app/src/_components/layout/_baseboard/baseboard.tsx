import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const promos = [
    {
        id: 1,
        text: "Cadastre-se para anunciar ainda hoje",
        link: "/promo/frete-gratis",
        cta: "Saiba mais",
    },
    {
        id: 2,
        text: "Oferta relâmpago! 5% de desconto em veículos espotivos",
        link: "/promo/desconto-a-vista",
        cta: "Aproveite",
    },
    {
        id: 3,
        text: "Garantia estendida de 5 anos em todos os importados",
        link: "/promo/garantia-estendida",
        cta: "Confira",
    },
]

export function Baseboard() {
    const [isVisible, setIsVisible] = useState(true)
    const [currentPromo, setCurrentPromo] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Auto-rotate promos
    useEffect(() => {
        if (!isPaused && isVisible) {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promos.length)
        }, 5000)
        return () => clearInterval(interval)
        }
    }, [isPaused, isVisible])

    const nextPromo = () => {
        setCurrentPromo((prev) => (prev + 1) % promos.length)
    }

    const prevPromo = () => {
        setCurrentPromo((prev) => (prev - 1 + promos.length) % promos.length)
    }

    if (!isVisible) return null

    return (
        <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-gray-100 dark:border-gray-900 bg-zinc-950 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        >
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between relative">
            {/* Close button */}
            <button
            onClick={() => setIsVisible(false)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-950 transition-colors duration-300"
            aria-label="Fechar banner"
            >
            <X size={16} strokeWidth={1.5} />
            </button>

            {/* Banner content */}
            <div className="flex-1 overflow-hidden mx-8 md:mx-12">
            <AnimatePresence mode="wait">
                <motion.div
                key={promos[currentPromo].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
                >
                <a href={promos[currentPromo].link} className="inline-flex items-center justify-center gap-1 group">
                    <span className="text-xs md:text-sm font-light tracking-wide">{promos[currentPromo].text}</span>
                    <motion.span
                    className="ml-2 text-xs md:text-sm font-light tracking-wide border-b border-transparent group-hover:border-gray-900 dark:group-hover:border-gray-100 transition-colors duration-300"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.3 }}
                    >
                    {promos[currentPromo].cta}
                    </motion.span>
                    <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xs group-hover:translate-x-1 transition-transform duration-300"
                    >
                    →
                    </motion.span>
                </a>
                </motion.div>
            </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
            <button
                onClick={prevPromo}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                aria-label="Promoção anterior"
            >
                <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <div className="hidden md:flex gap-2 items-center">
                {promos.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPromo(index)}
                    aria-label={`Ir para promoção ${index + 1}`}
                    className="group"
                >
                    <motion.div
                    animate={{
                        width: currentPromo === index ? "1.5rem" : "0.5rem",
                        backgroundColor: currentPromo === index ? "currentColor" : "rgba(156, 163, 175, 0.5)",
                    }}
                    whileHover={{
                        backgroundColor: "currentColor",
                        opacity: currentPromo === index ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-px rounded-full bg-gray-400"
                    />
                </button>
                ))}
            </div>

            <button
                onClick={nextPromo}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                aria-label="Próxima promoção"
            >
                <ChevronRight size={16} strokeWidth={1.5} />
            </button>
            </div>
        </div>
        </motion.div>
    )
}
