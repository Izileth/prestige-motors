import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import {
    Loader2,
    Edit,
    Trash2,
    PlusCircle,
    Heart,
    Zap,
    ShieldCheck,
    Gauge,
    Calendar,
    Search,
    Filter,
    X,
    Eye,
} from "lucide-react"
import useVehicle from "~/src/hooks/useVehicle"
import { useAuth } from "~/src/hooks/useAuth"
import type { Vehicle } from "~/src/store/slices/vehicle"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Skeleton } from "~/components/ui/skeleton"
import { formatPrice } from "~/src/lib/ultils"
import { Input } from "~/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
        staggerChildren: 0.1,
        },
    },
}

export function UserVehicleList() {
    const { user } = useAuth()
    const {
        userVehicles = [], // Valor padrão garantido
        loading,
        error,
        fetchUserVehicles, // Nova função específica para veículos do usuário
        deleteVehicle,
        fetchUserFavorites,
        addFavorite,
        removeFavorite,
        favorites,
        updateStatus, // Nova função para atualizar status
        userStats, // Estatísticas do usuário (opcional)
    } = useVehicle()

    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<Vehicle | null>(null)
    const [viewMode, setViewMode] = useState<"table" | "grid">("table")
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        if (user?.id) {
        fetchUserVehicles() // Substitui o fetchVehicles com userId
        fetchUserFavorites()
        }
    }, [user?.id])

    const vehiclesToRender = Array.isArray(userVehicles)
        ? userVehicles
            .filter((vehicle) => {
            const searchMatch =
                searchTerm === "" || `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(searchTerm.toLowerCase())
            const statusMatch = statusFilter === null || vehicle.status === statusFilter
            return searchMatch && statusMatch
            })
            .sort((a, b) => {
            // Sort by featured first, then by most recent
            if (a.destaque && !b.destaque) return -1
            if (!a.destaque && b.destaque) return 1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
        : []

    const handleDelete = async (vehicleId: string) => {
        setIsDeleting(vehicleId)
        try {
        await deleteVehicle(vehicleId)
        setConfirmDelete(null)
        } catch (error) {
        console.error("Erro ao excluir veículo:", error)
        } finally {
        setIsDeleting(null)
        }
    }

    const toggleFavorite = async (vehicleId: string) => {
        try {
        if (isFavorite(vehicleId)) {
            await removeFavorite(vehicleId)
        } else {
            await addFavorite(vehicleId)
        }
        // Força atualização imediata do estado
        await fetchUserFavorites()
        } catch (error) {
        console.error("Erro ao atualizar favoritos:", error)
        }
    }

    const handleStatusChange = async (vehicleId: string, newStatus: string) => {
        try {
        await updateStatus({ id: vehicleId, status: newStatus })
        // O estado é atualizado automaticamente pelo Redux
        } catch (error) {
        console.error("Erro ao atualizar status:", error)
        }
    }

    const isFavorite = (vehicleId: string) => {
        return Array.isArray(favorites) && favorites.some((v) => v.id === vehicleId)
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
        case "DISPONIVEL":
            return "bg-black text-white dark:bg-white dark:text-black border-0"
        case "RESERVADO":
            return "bg-gray-500 text-white border-0"
        case "VENDIDO":
            return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-0"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
        case "DISPONIVEL":
            return "Disponível"
        case "RESERVADO":
            return "Reservado"
        case "VENDIDO":
            return "Vendido"
        default:
            return status
        }
    }

    if (loading && !userVehicles.length) {
        return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-40" />
            </div>
            {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
        </div>
        )
    }

    if (error) {
        return (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertTitle className="text-red-600 dark:text-red-400">Erro</AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
        </Alert>
        )
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-col space-y-4 pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                <CardTitle className="text-2xl font-medium text-gray-900 dark:text-gray-100">Meus Veículos</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    {userVehicles.length} veículo{userVehicles.length !== 1 ? "s" : ""} cadastrado
                    {userVehicles.length !== 1 ? "s" : ""}
                    {userStats && <span className="ml-2">• {userStats.totalVehicles} no total</span>}
                </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    showFilters ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                >
                    <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </Button>
                <Button
                    asChild
                    className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                >
                    <Link to="/vehicles/create">
                    <PlusCircle className="h-4 w-4" />
                    Adicionar Veículo
                    </Link>
                </Button>
                </div>
            </div>

            <AnimatePresence>
                {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-600" />
                        <Input
                        placeholder="Buscar por marca ou modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                        />
                        {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <X className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                        </button>
                        )}
                    </div>
                    <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                        <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                        <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                        <SelectItem value="RESERVADO">Reservado</SelectItem>
                        <SelectItem value="VENDIDO">Vendido</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button
                        variant={viewMode === "table" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("table")}
                        className={
                            viewMode === "table"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "border-gray-200 dark:border-gray-800"
                        }
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M3 15h18" />
                            <path d="M9 3v18" />
                            <path d="M15 3v18" />
                        </svg>
                        </Button>
                        <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className={
                            viewMode === "grid"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "border-gray-200 dark:border-gray-800"
                        }
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        </Button>
                    </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            </CardHeader>
            <CardContent>
            {userVehicles.length === 0 ? (
                <motion.div
                variants={fadeIn}
                className="flex flex-col items-center justify-center py-16 gap-6 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <Zap className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum veículo cadastrado</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Você ainda não tem veículos cadastrados. Comece anunciando seu primeiro veículo para alcançar
                    potenciais compradores.
                    </p>
                </div>
                <Button
                    className="mt-2 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                    asChild
                >
                    <Link to="/vehicles/create">
                    <PlusCircle className="h-4 w-4" />
                    Criar primeiro veículo
                    </Link>
                </Button>
                </motion.div>
            ) : vehiclesToRender.length === 0 ? (
                <motion.div
                variants={fadeIn}
                className="flex flex-col items-center justify-center py-16 gap-6 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <Search className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Não encontramos veículos que correspondam aos seus filtros. Tente ajustar os critérios de busca.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                    setSearchTerm("")
                    setStatusFilter(null)
                    }}
                    className="mt-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Limpar filtros
                </Button>
                </motion.div>
            ) : viewMode === "table" ? (
                <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Veículo</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Detalhes</TableHead>
                        <TableHead className="text-right text-gray-700 dark:text-gray-300 font-medium">Preço</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Status</TableHead>
                        <TableHead className="text-right text-gray-700 dark:text-gray-300 font-medium">Ações</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    <AnimatePresence>
                        {vehiclesToRender.map((vehicle, index) => (
                        <motion.tr
                            key={vehicle.id}
                            variants={fadeIn}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            onMouseEnter={() => setHoveredVehicle(vehicle.id)}
                            onMouseLeave={() => setHoveredVehicle(null)}
                        >
                            <TableCell>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                {vehicle.imagens?.length > 0 ? (
                                    <img
                                    src={vehicle.imagens.find((img) => img.isMain)?.url || vehicle.imagens[0].url}
                                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                                    className="h-16 w-24 rounded-md object-cover border border-gray-100 dark:border-gray-800"
                                    loading="lazy"
                                    />
                                ) : (
                                    <div className="h-16 w-24 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <span className="text-xs text-gray-400 dark:text-gray-600">Sem imagem</span>
                                    </div>
                                )}
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`absolute -top-2 -left-2 h-8 w-8 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-all ${
                                            hoveredVehicle === vehicle.id ? "opacity-100" : "opacity-0"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFavorite(vehicle.id)
                                        }}
                                        >
                                        <Heart
                                            className={`h-4 w-4 transition-colors ${
                                            isFavorite(vehicle.id)
                                                ? "fill-black text-black dark:fill-white dark:text-white"
                                                : "text-gray-400 dark:text-gray-600"
                                            }`}
                                        />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isFavorite(vehicle.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                </div>
                                <div>
                                <p className="font-medium line-clamp-1 text-gray-900 dark:text-gray-100">
                                    {vehicle.marca} {vehicle.modelo}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {vehicle.anoFabricacao}/{vehicle.anoModelo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                    <Gauge className="h-3 w-3" />
                                    {vehicle.quilometragem.toLocaleString("pt-BR")} km
                                    </span>
                                </div>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell>
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                variant="outline"
                                className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                                >
                                {vehicle.tipoCombustivel}
                                </Badge>
                                <Badge
                                variant="outline"
                                className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                {vehicle.cambio}
                                </Badge>
                                {vehicle.seloOriginal && (
                                <Badge
                                    variant="outline"
                                    className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                                >
                                    <ShieldCheck className="h-3 w-3" />
                                    Original
                                </Badge>
                                )}
                            </div>
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                                </span>
                                {vehicle.precoPromocional && (
                                <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                                    {formatPrice(vehicle.preco)}
                                </span>
                                )}
                            </div>
                            </TableCell>
                            <TableCell>
                            <div className="flex flex-col gap-2">
                                {vehicle.destaque && (
                                <Badge className="w-fit bg-black text-white dark:bg-white dark:text-black border-0 flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    Destaque
                                </Badge>
                                )}
                                <Select
                                value={vehicle.status}
                                onValueChange={(value) => handleStatusChange(vehicle.id, value)}
                                >
                                <SelectTrigger className="w-[120px] border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                                    <SelectItem value="RESERVADO">Reservado</SelectItem>
                                    <SelectItem value="VENDIDO">Vendido</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        asChild
                                    >
                                        <Link to={`/vehicles/${vehicle.id}`}>
                                        <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver veículo</TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        asChild
                                    >
                                        <Link to={`/vehicles/update/${vehicle.id}`}>
                                        <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar veículo</TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setConfirmDelete(vehicle)}
                                        disabled={isDeleting === vehicle.id}
                                        className="border-red-200 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-400"
                                    >
                                        {isDeleting === vehicle.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                        <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Excluir veículo</TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            </div>
                            </TableCell>
                        </motion.tr>
                        ))}
                    </AnimatePresence>
                    </TableBody>
                </Table>
                </div>
            ) : (
                <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                {vehiclesToRender.map((vehicle, index) => (
                    <motion.div
                    key={vehicle.id}
                    variants={fadeIn}
                    custom={index}
                    className="relative"
                    onMouseEnter={() => setHoveredVehicle(vehicle.id)}
                    onMouseLeave={() => setHoveredVehicle(null)}
                    >
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        {vehicle.imagens?.length > 0 ? (
                            <img
                            src={vehicle.imagens.find((img) => img.isMain)?.url || vehicle.imagens[0].url}
                            alt={`${vehicle.marca} ${vehicle.modelo}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 dark:text-gray-600">Sem imagem disponível</span>
                            </div>
                        )}

                        <div className="absolute top-2 left-2 flex gap-2">
                            {vehicle.destaque && (
                            <Badge className="bg-black text-white dark:bg-white dark:text-black border-0 flex items-center gap-1 shadow-sm">
                                <Zap className="h-3 w-3" />
                                Destaque
                            </Badge>
                            )}
                            <Badge className={`${getStatusBadgeVariant(vehicle.status)} shadow-sm`}>
                            {getStatusLabel(vehicle.status)}
                            </Badge>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black shadow-sm transition-all ${
                            hoveredVehicle === vehicle.id ? "opacity-100" : "opacity-0"
                            }`}
                            onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(vehicle.id)
                            }}
                        >
                            <Heart
                            className={`h-4 w-4 transition-colors ${
                                isFavorite(vehicle.id)
                                ? "fill-black text-black dark:fill-white dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                            }`}
                            />
                        </Button>
                        </div>

                        <CardContent className="p-5 space-y-4">
                        <div>
                            <h3 className="font-medium text-lg line-clamp-1 text-gray-900 dark:text-gray-100">
                            {vehicle.marca} {vehicle.modelo}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {vehicle.anoFabricacao}/{vehicle.anoModelo}
                            </span>
                            <span className="flex items-center gap-1">
                                <Gauge className="h-3 w-3" />
                                {vehicle.quilometragem.toLocaleString("pt-BR")} km
                            </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                            >
                            {vehicle.tipoCombustivel}
                            </Badge>
                            <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                            >
                            {vehicle.cambio}
                            </Badge>
                            {vehicle.seloOriginal && (
                            <Badge
                                variant="outline"
                                className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                            >
                                <ShieldCheck className="h-3 w-3" />
                                Original
                            </Badge>
                            )}
                        </div>

                        <div>
                            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                            </p>
                            {vehicle.precoPromocional && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 line-through">
                                {formatPrice(vehicle.preco)}
                            </p>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <Select value={vehicle.status} onValueChange={(value) => handleStatusChange(vehicle.id, value)}>
                            <SelectTrigger className="w-[120px] border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                                <SelectItem value="RESERVADO">Reservado</SelectItem>
                                <SelectItem value="VENDIDO">Vendido</SelectItem>
                            </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                asChild
                            >
                                <Link to={`/vehicles/update/${vehicle.id}`}>
                                <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setConfirmDelete(vehicle)}
                                disabled={isDeleting === vehicle.id}
                                className="border-red-200 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-400"
                            >
                                {isDeleting === vehicle.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                ))}
                </motion.div>
            )}
            </CardContent>
        </Card>

        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
            <DialogContent className="bg-white dark:bg-gray-900 border-0 shadow-lg">
            <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">Confirmar exclusão</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                Tem certeza que deseja excluir o veículo{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                    {confirmDelete?.marca} {confirmDelete?.modelo}
                </span>
                ? Esta ação não pode ser desfeita.
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
                <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
                className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                Cancelar
                </Button>
                <Button
                variant="destructive"
                onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
                disabled={!!isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                {isDeleting ? (
                    <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Excluindo...
                    </>
                ) : (
                    <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir veículo
                    </>
                )}
                </Button>
            </div>
            </DialogContent>
        </Dialog>
        </motion.div>
  )
}
