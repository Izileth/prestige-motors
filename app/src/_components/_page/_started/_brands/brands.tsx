
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { VehicleBrands } from "~/src/data/static/brands"

export function PartnerBrands() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4" ref={containerRef}>
            <div className="text-center mb-16">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-gray-100"
            >
                MARCAS PARCEIRAS
            </motion.h2>
            <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: "40px" } : { width: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-0.5 bg-black dark:bg-white mx-auto mt-4"
            />
            </div>

            <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                transition: {
                    staggerChildren: 0.08,
                },
                },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12"
            >
            {VehicleBrands.map((brand, i) => (
                <motion.a
                key={brand.id}
                href={brand.link}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col items-center"
                >
                <div className="relative overflow-hidden p-6 border border-gray-100 dark:border-gray-800 w-full aspect-[4/3] flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-700">
                    <motion.img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 w-auto object-contain grayscale opacity-70 transition-all duration-300 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    />
                    <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-black dark:bg-white"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    />
                </div>
                <motion.span
                    className="mt-4 text-sm font-light text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                >
                    {brand.name}
                </motion.span>
                </motion.a>
            ))}
            </motion.div>
        </div>
        </section>
    )
}
