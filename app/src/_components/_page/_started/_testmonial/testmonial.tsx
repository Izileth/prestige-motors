
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CustomerTestimonials } from "~/src/data/static/testmonial"

export function Testimonials() {
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
                DEPOIMENTOS
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
                    staggerChildren: 0.1,
                },
                },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
            {CustomerTestimonials.map((testimonial, index) => (
                <motion.div
                key={testimonial.id}
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
                className="group border border-gray-100 dark:border-gray-800 p-8 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
                >
                <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 mr-1 ${
                        i < testimonial.rating ? "text-black dark:text-white" : "text-gray-200 dark:text-gray-800"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    ))}
                </div>

                <div className="relative mb-8">
                    <motion.div
                    initial={{ width: "20%" }}
                    whileInView={{ width: "40%" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute top-0 left-0 h-px bg-gray-200 dark:bg-gray-800"
                    />
                    <p className="text-lg font-light italic text-gray-600 dark:text-gray-300 leading-relaxed pt-6">
                    "{testimonial.text}"
                    </p>
                    <motion.div
                    initial={{ width: "20%" }}
                    whileInView={{ width: "40%" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute bottom-0 right-0 h-px bg-gray-200 dark:bg-gray-800"
                    />
                </div>

                <div className="flex items-center">
                    <div className="relative mr-4">
                    <div className="w-12 h-12 border border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-colors duration-300">
                        <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                        {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                    </div>
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 w-0 bg-black dark:bg-white"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                    />
                    </div>
                    <div>
                    <h4 className="font-light text-gray-900 dark:text-gray-100 tracking-wide">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{testimonial.role}</p>
                    </div>
                </div>
                </motion.div>
            ))}
            </motion.div>
        </div>
        </section>
    )
}
