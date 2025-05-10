
import { useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRandomVehicles } from "~/src/hooks/useRandomVehicle"
import { Button } from "~/components/ui/button"
import { VehicleCard } from "~/src/_components/_page/_vehicle/_card/card"
import { Skeleton } from "~/components/ui/skeleton"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function RandomVehicles() {
    const { vehicles, loading, refresh } = useRandomVehicles(4)
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    const handleViewAll = () => {
        navigate("/vehicles")
    }

    const handleRefresh = () => {
        // Feedback visual imediato
        refresh()
    }

    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300 w-full max-w-full px-4">
            <div className="container mx-auto px-4" ref={containerRef}>
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div className="space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-gray-100"
                        >
                            SELEÇÃO ESPECIAL
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: "40px" } : { width: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="h-0.5 bg-black dark:bg-white"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="group border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-300"
                            disabled={loading}
                        >
                            <RefreshCw 
                                size={16} 
                                className={`mr-2 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-90'}`} 
                            />
                            <span className="font-light">Atualizar seleção</span>
                        </Button>
                    </motion.div>
                </div>

                {/* Conteúdo */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="space-y-4">
                                    <Skeleton className="h-64 w-full bg-gray-100 dark:bg-gray-900" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4 bg-gray-100 dark:bg-gray-900" />
                                        <Skeleton className="h-4 w-1/2 bg-gray-100 dark:bg-gray-900" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                    },
                                },
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {vehicles.map((vehicle, index) => (
                                <motion.div
                                    key={vehicle.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.6,
                                                ease: [0.22, 1, 0.36, 1],
                                                delay: index * 0.05,
                                            },
                                        },
                                    }}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Rodapé */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-16 flex justify-center"
                >
                    <Button
                        onClick={handleViewAll}
                        variant="outline"
                        className="group border-0 shadow-none transition-colors duration-300 rounded-none"
                    >
                        <span className="font-light">Ver catálogo completo</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}