import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import useVehicle from "~/src/hooks/useVehicle"
import { useAuth } from "~/src/hooks/useAuth"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import useNegotiation from "~/src/hooks/useNegociation"
import { Heart, MessageSquare, Phone, Mail, ChevronRight, Search, ArrowRight, X } from "lucide-react"
import { Textarea } from "~/components/ui/textarea"
import { Skeleton } from "~/components/ui/skeleton"

import { useNavigate } from "react-router-dom"
const NegotiationsPage = () => {
    const { user } = useAuth()
    const { fetchUserFavorites, favorites, loading, removeFavorite } = useVehicle()
    const { clearNegotiations, createNegotiation, currentVehicle } = useNegotiation()
    const [activeTab, setActiveTab] = useState<"favorites" | "negotiations">("favorites")
    const [message, setMessage] = useState("")
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null)
    const [hoveredButton, setHoveredButton] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const navigate = useNavigate()

    useEffect(() => {
    if (user) {
        fetchUserFavorites()
        }
    }, [user]) // Remove fetchUserFavorites from dependency array

    const handleStartNegotiation = async (vehicleId: string) => {
        try {
        // Commented out as per original code
        // await createNegotiation(vehicleId, message);
        alert("Negociação iniciada com sucesso!")
        setMessage("")
        setExpandedVehicle(null)
        } catch (error) {
        console.error("Erro ao iniciar negociação:", error)
        }
    }

    const handleRemoveFavorite = async (vehicleId: string) => {
        try {
        await removeFavorite(vehicleId)
        fetchUserFavorites()
        } catch (error) {
        console.error("Erro ao remover favorito:", error)
        }
    }

    const handleProfile = () => {
        navigate('/dashboard')
    }

    const toggleExpandVehicle = (vehicleId: string) => {
        if (expandedVehicle === vehicleId) {
        setExpandedVehicle(null)
        } else {
        setExpandedVehicle(vehicleId)
        setMessage("")
        }
    }

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        }).format(price)
    }

    // Scroll to message input when expanded
    useEffect(() => {
        if (expandedVehicle && messagesEndRef.current) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 300)
        }
    }, [expandedVehicle])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
        },
    }

    const tabVariants = {
        inactive: { opacity: 0.7, x: 0 },
        active: { opacity: 1, x: 0 },
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 py-16">
        <div className="container mx-auto px-4">
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-gray-100 mb-2"
            >
            MINHA CONTA
            </motion.h1>
            <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-black dark:bg-white mb-12"
            />

            <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full lg:w-64 mb-8 lg:mb-0"
            >
                <div className="border-b border-gray-100 dark:border-gray-900 pb-6 mb-6">
                <h2 className="text-sm font-light text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                    Minha Atividade
                </h2>
                <div className="space-y-1">
                    <motion.div
                    variants={tabVariants}
                    animate={activeTab === "favorites" ? "active" : "inactive"}
                    className="relative"
                    >
                    <Button
                        variant="ghost"
                        className={`w-full justify-start py-2 px-3 rounded-none text-base font-light ${
                        activeTab === "favorites" ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
                        }`}
                        onClick={() => setActiveTab("favorites")}
                    >
                        <Heart
                        className={`mr-3 h-4 w-4 ${
                            activeTab === "favorites" ? "fill-black dark:fill-white" : "fill-none"
                        }`}
                        />
                        Favoritos
                        {favorites.length > 0 && (
                        <Badge
                            className={`ml-auto ${
                            activeTab === "favorites"
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            } rounded-full text-xs font-light`}
                        >
                            {favorites.length}
                        </Badge>
                        )}
                    </Button>
                    {activeTab === "favorites" && (
                        <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 w-0.5 h-full bg-black dark:bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        />
                    )}
                    </motion.div>

                    <motion.div
                    variants={tabVariants}
                    animate={activeTab === "negotiations" ? "active" : "inactive"}
                    className="relative"
                    >
                    <Button
                        variant="ghost"
                        className={`w-full justify-start py-2 px-3 rounded-none text-base font-light ${
                        activeTab === "negotiations" ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
                        }`}
                        onClick={() => setActiveTab("negotiations")}
                    >
                        <MessageSquare className="mr-3 h-4 w-4" />
                        Negociações
                    </Button>
                    {activeTab === "negotiations" && (
                        <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 w-0.5 h-full bg-black dark:bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        />
                    )}
                    </motion.div>
                </div>
                </div>

                <div>
                <h2 className="text-sm font-light text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                    Minha Conta
                </h2>
                <div className="space-y-1">
                    <Button
                    variant="ghost"
                    className="w-full justify-start py-2 px-3 rounded-none text-base font-light text-gray-500 dark:text-gray-400"
                    onClick={handleProfile}
                    >
                    Perfil
                    </Button>
                    <Button
                    variant="ghost"
                    className="w-full justify-start py-2 px-3 rounded-none text-base font-light text-gray-500 dark:text-gray-400"
                    onClick={handleProfile}
                    >
                    Configurações
                    </Button>
                </div>
                </div>
            </motion.div>

            {/* Main content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                {activeTab === "favorites" ? (
                    <motion.div
                    key="favorites"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                    variants={containerVariants}
                    className="space-y-8"
                    >
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Veículos Favoritados</h2>
                        <Link
                        to="/vehicles"
                        className="text-sm font-light text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 group"
                        >
                        Explorar veículos
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <motion.div
                            key={index}
                            variants={itemVariants}
                            className="border border-gray-100 dark:border-gray-900 p-6"
                            >
                            <div className="flex gap-6">
                                <Skeleton className="w-32 h-32 bg-gray-100 dark:bg-gray-900" />
                                <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4 bg-gray-100 dark:bg-gray-900" />
                                <Skeleton className="h-4 w-1/4 bg-gray-100 dark:bg-gray-900" />
                                <Skeleton className="h-6 w-1/3 bg-gray-100 dark:bg-gray-900" />
                                <div className="pt-4">
                                    <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-900" />
                                </div>
                                </div>
                            </div>
                            </motion.div>
                        ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <motion.div
                        variants={itemVariants}
                        className="border border-gray-100 dark:border-gray-900 py-16 px-6 text-center"
                        >
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="h-6 w-6 text-gray-300 dark:text-gray-700" />
                            </div>
                            <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                            Nenhum veículo favoritado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                            Adicione veículos aos favoritos para acompanhar preços e iniciar negociações.
                            </p>
                            <Button
                            asChild
                            className="mt-4 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-none px-8 py-6 h-auto font-light"
                            >
                            <Link to="/vehicles">
                                <Search className="mr-2 h-4 w-4" />
                                Explorar veículos
                            </Link>
                            </Button>
                        </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                        {favorites.map((vehicle, index) => (
                            <motion.div
                            key={vehicle.id}
                            variants={itemVariants}
                            className="border border-gray-100 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-300"
                            >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-32 h-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                                    {vehicle.imagens?.length > 0 ? (
                                    <img
                                        src={vehicle.imagens[0].url || "/placeholder.svg"}
                                        alt={vehicle.modelo}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-gray-300 dark:text-gray-700">Sem imagem</span>
                                    </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-light text-lg text-gray-900 dark:text-gray-100">
                                        {vehicle.marca} {vehicle.modelo}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {vehicle.anoFabricacao}/{vehicle.anoModelo} •{" "}
                                        {vehicle.quilometragem.toLocaleString()} km
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-black dark:hover:text-white"
                                        onClick={() => handleRemoveFavorite(vehicle.id)}
                                    >
                                        <X size={18} />
                                    </Button>
                                    </div>

                                    <div className="mt-auto pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <p className="font-light text-xl text-gray-900 dark:text-gray-100">
                                        {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="group border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-none px-4 py-2 h-auto text-sm font-light"
                                        onClick={() => toggleExpandVehicle(vehicle.id)}
                                    >
                                        <span>{expandedVehicle === vehicle.id ? "Cancelar" : "Iniciar negociação"}</span>
                                        <ChevronRight
                                        size={16}
                                        className={`ml-2 transition-transform duration-300 ${
                                            expandedVehicle === vehicle.id ? "rotate-90" : "group-hover:translate-x-1"
                                        }`}
                                        />
                                    </Button>
                                    </div>
                                </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedVehicle === vehicle.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden border-t border-gray-100 dark:border-gray-900"
                                >
                                    <div className="p-6 space-y-4" ref={messagesEndRef}>
                                    <h4 className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Envie uma mensagem para o vendedor
                                    </h4>
                                    <Textarea
                                        placeholder="Olá, tenho interesse neste veículo. Podemos negociar o preço?"
                                        className="w-full p-3 border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-gray-100 text-sm font-light resize-none focus:ring-0 focus:border-black dark:focus:border-white transition-colors"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={4}
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                        onMouseEnter={() => setHoveredButton("message")}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="relative"
                                        >
                                        <Button
                                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 rounded-none px-4 py-2 h-auto text-sm font-light"
                                            onClick={() => handleStartNegotiation(vehicle.id)}
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Enviar Mensagem
                                        </Button>
                                        <motion.div
                                            className="absolute -inset-px border border-black dark:border-white"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                            x: hoveredButton === "message" ? 2 : 0,
                                            y: hoveredButton === "message" ? 2 : 0,
                                            opacity: hoveredButton === "message" ? 0.3 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        </motion.div>

                                        <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                        onMouseEnter={() => setHoveredButton("phone")}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="relative"
                                        >
                                        <Button
                                            variant="outline"
                                            className="border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-none px-4 py-2 h-auto text-sm font-light"
                                        >
                                            <Phone className="mr-2 h-4 w-4" />
                                            Ligar
                                        </Button>
                                        <motion.div
                                            className="absolute -inset-px border border-black dark:border-white"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                            x: hoveredButton === "phone" ? 2 : 0,
                                            y: hoveredButton === "phone" ? 2 : 0,
                                            opacity: hoveredButton === "phone" ? 0.3 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        </motion.div>

                                        <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                        onMouseEnter={() => setHoveredButton("email")}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="relative"
                                        >
                                        <Button
                                            variant="outline"
                                            className="border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-none px-4 py-2 h-auto text-sm font-light"
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Email
                                        </Button>
                                        <motion.div
                                            className="absolute -inset-px border border-black dark:border-white"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                            x: hoveredButton === "email" ? 2 : 0,
                                            y: hoveredButton === "email" ? 2 : 0,
                                            opacity: hoveredButton === "email" ? 0.3 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        </motion.div>
                                    </div>
                                    </div>
                                </motion.div>
                                )}
                            </AnimatePresence>
                            </motion.div>
                        ))}
                        </div>
                    )}
                    </motion.div>
                ) : (
                    <motion.div
                    key="negotiations"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                    variants={containerVariants}
                    className="space-y-8"
                    >
                    <motion.h2 variants={itemVariants} className="text-2xl font-light text-gray-900 dark:text-gray-100">
                        Minhas Negociações
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="border border-gray-100 dark:border-gray-900 py-16 px-6 text-center"
                    >
                        <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                            <MessageSquare className="h-6 w-6 text-gray-300 dark:text-gray-700" />
                        </div>
                        <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                            Sistema em desenvolvimento
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                            Em breve você poderá acompanhar todas as suas negociações aqui.
                        </p>
                        <div className="pt-4">
                            <span className="inline-block px-3 py-1 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs font-light">
                            Em breve
                            </span>
                        </div>
                        </div>
                    </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            </div>
        </div>
        </div>
    )
}

export default NegotiationsPage
