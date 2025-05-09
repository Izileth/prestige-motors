import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "~/src/hooks/useAuth"
import useUserStore from "~/src/hooks/useUser"
import useVehicle from "~/src/hooks/useVehicle"
import useSale from "~/src/hooks/useSale"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Address } from "~/src/store/slices/user"
import { motion, AnimatePresence } from "framer-motion"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ComposedChart,
    AreaChart,
    Area,
} from "recharts"
import {
    Check,
    AlertCircle,
    Car,
    User,
    ShoppingCart,
    Trash2,
    Heart,
    Star,
    FileText,
    LogOut,
    Key,
    MapPin,
    Camera,
    ChevronRight,
    BarChart2,
    Plus,
    X,
    Edit,
} from "lucide-react"

// Importando componentes do shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Badge } from "~/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

import type { UserUpdateData } from "~/src/services/user"

// Define o esquema de cores para os gráficos
const COLORS = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F5F5F5"]

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

export default function Dashboard() {
    const { user, logout, isAuthenticated, status: authStatus } = useAuth()
    const {
        currentUser,
        addresses,
        loading: userLoading,
        stats: userStats, // As estatísticas do usuário (veículos)
        getUserById,
        getUserStats,
        getUserAddresses,
        updateUserData,
        createAddress,
        modifyAddress,
        removeAddress,
        uploadUserAvatar,
        removeUser,
    } = useUserStore()
    const {
        vehicles,
        favorites,
        stats: saleStats, // As estatísticas de vendas (global/user)
        stats: vehicleStats,
        loading: vehicleLoading,
        fetchUserFavorites,
        fetchVehicleStats,
    } = useVehicle()

    const {
        purchases, // Histórico de compras (substitui userSales)
        sellerSales, // Novo - Histórico como vendedor
        stats, // Agora contém { global, user }
        loading: saleLoading,
        error: saleError,
        fetchPurchasesByUser, // Substitui fetchSalesByUser
        fetchSalesBySeller, // Novo
        fetchGlobalSalesStats, // Substitui fetchSalesStats
        fetchUserSalesStats,
    } = useSale()

    const [activeTab, setActiveTab] = useState("perfil")
    const [isEditing, setIsEditing] = useState(false)
    const [editFormData, setEditFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
    })

    const [passwordData, setPasswordData] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    })
    const [addressFormData, setAddressFormData] = useState({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "Brasil",
    })

    const [editAddressId, setEditAddressId] = useState<string | null>(null)
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState("")
    const [showPasswordAlert, setShowPasswordAlert] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showAddressForm, setShowAddressForm] = useState(false)

    // Carrega os dados do usuário quando o componente monta
    useEffect(() => {
        if (isAuthenticated && user?.id) {
        getUserById(user.id)
        getUserAddresses(user.id)
        fetchUserFavorites()
        fetchVehicleStats()
        fetchPurchasesByUser(user.id)
        fetchSalesBySeller(user.id) // Novo
        fetchGlobalSalesStats()
        fetchUserSalesStats(user.id) // Novo
        getUserStats(user.id) // Adicione esta linha
        }
    }, [isAuthenticated, user?.id])

    // Atualiza o formulário quando os dados do usuário forem carregados
    useEffect(() => {
        if (currentUser) {
        setEditFormData({
            nome: currentUser.nome || "",
            email: currentUser.email || "",
            telefone: currentUser.telefone || "",
            cpf: currentUser.cpf || "",
            dataNascimento: currentUser.dataNascimento ? currentUser.dataNascimento.split("T")[0] : "",
        })
        }
    }, [currentUser])

    // Handlers para edição de perfil
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditFormData({ ...editFormData, [name]: value })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData({ ...passwordData, [name]: value })
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setAddressFormData({ ...addressFormData, [name]: value })
    }

    const handleEditProfile = () => {
        setIsEditing(true)
    }

    const [notification, setNotification] = useState<{
        show: boolean
        message: string
        type: "success" | "error"
    }>({
        show: false,
        message: "",
        type: "success",
    })

    const [loading, setLoading] = useState({
        profile: false,
        password: false,
        delete: false,
    })

    const handleSaveProfile = async () => {
        if (user?.id) {
        setLoading((prev) => ({ ...prev, profile: true }))

        try {
            // Preparar os dados, validando cada campo individualmente
            const updateData: UserUpdateData = {}

            // Apenas incluir campos que não estão vazios
            if (editFormData.nome && editFormData.nome.trim()) {
            updateData.nome = editFormData.nome.trim()
            }

            if (editFormData.email && editFormData.email.trim()) {
            updateData.email = editFormData.email.trim()
            }

            // Formatar telefone conforme esperado pelo backend (apenas dígitos)
            if (editFormData.telefone) {
            // Remove todos os caracteres não numéricos
            const telefoneFormatado = editFormData.telefone.replace(/\D/g, "")
            if (telefoneFormatado.length >= 10 && telefoneFormatado.length <= 11) {
                updateData.telefone = telefoneFormatado
            } else if (telefoneFormatado === "") {
                // Se o usuário apagou o telefone, enviar null
                updateData.telefone = null
            } else {
                throw new Error("Telefone deve ter entre 10 e 11 dígitos")
            }
            }

            // Formatar CPF conforme esperado pelo backend (11 dígitos)
            if (editFormData.cpf) {
            const cpfFormatado = editFormData.cpf.replace(/\D/g, "")
            if (cpfFormatado.length === 11 || cpfFormatado === "") {
                updateData.cpf = cpfFormatado || null
            } else {
                throw new Error("CPF deve ter 11 dígitos")
            }
            }

            // Tratar a data de nascimento adequadamente
            if (editFormData.dataNascimento) {
            // Garantir que é uma data válida antes de converter
            const dateObj = new Date(editFormData.dataNascimento)
            if (!isNaN(dateObj.getTime())) {
                // O backend espera uma string no formato YYYY-MM-DD
                const year = dateObj.getFullYear()
                const month = String(dateObj.getMonth() + 1).padStart(2, "0")
                const day = String(dateObj.getDate()).padStart(2, "0")
                updateData.dataNascimento = `${year}-${month}-${day}`
            }
            } else if (editFormData.dataNascimento === null) {
            // Se o usuário removeu a data, enviar null explicitamente
            updateData.dataNascimento = null
            }

            // Verificar se há dados para atualizar
            if (Object.keys(updateData).length === 0) {
            throw new Error("Nenhum dado para atualizar")
            }

            console.log("Dados sendo enviados:", updateData)

            // Enviar para o servidor
            await updateUserData(user.id, updateData)

            // Atualizar UI
            setIsEditing(false)
            setNotification({
            show: true,
            message: "Perfil atualizado com sucesso!",
            type: "success",
            })

            // Atualizar dados locais
            if (user?.id) {
            getUserById(user.id)
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error)
            setNotification({
            show: true,
            message: `Erro ao atualizar perfil: ${error instanceof Error ? error.message : "Tente novamente."}`,
            type: "error",
            })
        } finally {
            setLoading((prev) => ({ ...prev, profile: false }))
        }
        }
    }

    const handleSavePassword = async () => {
        // Validação local - verifica se as senhas coincidem
        if (passwordData.novaSenha !== passwordData.confirmarSenha) {
        setShowPasswordAlert(true)
        return
        }

        if (!passwordData.senhaAtual || !passwordData.novaSenha) {
        setNotification({
            show: true,
            message: "Senhas atuais e novas são obrigatórias",
            type: "error",
        })
        return
        }

        // Iniciar loading
        setLoading((prev) => ({ ...prev, password: true }))

        try {
        if (!user?.id) {
            throw new Error("ID do usuário não encontrado")
        }

        // Preparar dados para envio
        const updateData: UserUpdateData = {
            senhaAtual: passwordData.senhaAtual,
            senha: passwordData.novaSenha, // 'senha' é o campo esperado pelo backend, não 'novaSenha'
        }

        console.log("Enviando alteração de senha...")

        // Reutilizar a mesma função que atualiza o usuário
        await updateUserData(user.id, updateData)

        // Feedback ao usuário
        setNotification({
            show: true,
            message: "Senha alterada com sucesso!",
            type: "success",
        })

        // Resetar o formulário
        setPasswordData({
            senhaAtual: "",
            novaSenha: "",
            confirmarSenha: "",
        })

        setShowPasswordAlert(false)
        } catch (error) {
        console.error("Erro ao alterar senha:", error)

        // Feedback de erro específico para o usuário
        let errorMessage = "Erro ao alterar senha."

        // Se o erro for relacionado à senha atual incorreta (comum neste caso)
        if (error instanceof Error && error.message.includes("senha atual")) {
            errorMessage = "Senha atual incorreta. Por favor, verifique."
        }

        setNotification({
            show: true,
            message: errorMessage,
            type: "error",
        })
        } finally {
        setLoading((prev) => ({ ...prev, password: false }))
        }
    }

    const handleAddAddress = async () => {
        if (user?.id) {
        if (editAddressId) {
            await modifyAddress(editAddressId, addressFormData)
        } else {
            await createAddress(user.id, addressFormData)
        }

        // Resetar o formulário
        setAddressFormData({
            cep: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            pais: "Brasil",
        })
        setEditAddressId(null)
        setShowAddressForm(false)
        }
    }

    const handleEditAddress = (address: Address) => {
        setAddressFormData({
        cep: address.cep,
        logradouro: address.logradouro,
        numero: address.numero,
        complemento: address.complemento || "",
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        pais: address.pais || "Brasil",
        })
        setEditAddressId(address.id)
        setShowAddressForm(true)
    }

    const handleDeleteAddress = async (addressId: string) => {
        await removeAddress(addressId)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0])
        }
    }

    const handleUploadAvatar = async () => {
        if (selectedFile && user?.id) {
        await uploadUserAvatar(user.id, selectedFile)
        setSelectedFile(null)
        }
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirmation === currentUser?.email && user?.id) {
        await removeUser(user.id)
        await logout()
        }
    }

    if (authStatus === "loading" || userLoading) {
        return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">Carregando...</p>
            </div>
        </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
            >
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                <CardHeader>
                <CardTitle className="text-center text-gray-900 dark:text-gray-100">Acesso Restrito</CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                    Você precisa estar logado para acessar esta página.
                </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                <Button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                >
                    Ir para o Login
                </Button>
                </CardFooter>
            </Card>
            </motion.div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
        <AnimatePresence>
            {notification.show && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                notification.type === "success"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-red-500 text-white"
                }`}
            >
                <div className="flex items-center gap-2">
                {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
                <p>{notification.message}</p>
                <button
                    onClick={() => setNotification({ ...notification, show: false })}
                    className="ml-2 text-white dark:text-black"
                >
                    <X size={18} />
                </button>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        <div className="container mx-auto px-4 py-8">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            >
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-sm">
                <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.nome} />
                <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black text-lg">
                    {currentUser?.nome?.charAt(0) || "U"}
                </AvatarFallback>
                </Avatar>
                <div>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    Olá, {currentUser?.nome?.split(" ")[0] || "Usuário"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Bem-vindo ao seu dashboard</p>
                </div>
            </div>
            <Button
                variant="outline"
                onClick={logout}
                className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
            </Button>
            </motion.div>

            <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
            <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-sm rounded-none bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total de Veículos
                    </CardTitle>
                    <Car className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    {userStats?.totalVehicles || 0}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                    {((userStats?.totalVehicles || 0) / (vehicleStats?.totalVehicles || 1)) * 100 > 0
                        ? ((userStats?.totalVehicles || 0) / (vehicleStats?.totalVehicles || 1)) * 100 < 0.1
                        ? "< 0.1% do catálogo"
                        : `${(((userStats?.totalVehicles || 0) / (vehicleStats?.totalVehicles || 1)) * 100).toFixed(1)}% do catálogo`
                        : "0% do catálogo"}
                    </p>
                </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-sm rounded-none bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</CardTitle>
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    R$ {userStats?.valorTotalInventario?.toLocaleString("pt-BR") || 0}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Em inventário</p>
                </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-sm rounded-none bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Preço Médio</CardTitle>
                    <Star className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    R$ {userStats?.precoMedio?.toLocaleString("pt-BR") || 0}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Por veículo</p>
                </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-sm rounded-none bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Faixa de Preços</CardTitle>
                    <ShoppingCart className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    R$ {userStats?.precoMinimo?.toLocaleString("pt-BR") || 0} - R${" "}
                    {userStats?.precoMaximo?.toLocaleString("pt-BR") || 0}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Min - Max</p>
                </CardContent>
                </Card>
            </motion.div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
            <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent  dark:bg-transparent p-1 rounded-lg">
                <TabsTrigger
                    value="perfil"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent rounded-none dark:data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white transition-all"
                >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                </TabsTrigger>
                <TabsTrigger
                    value="veiculos"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent rounded-none dark:data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white transition-all"
                >
                    <Car className="w-4 h-4 mr-2" />
                    Veículos
                </TabsTrigger>
                <TabsTrigger
                    value="compras"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent rounded-none dark:data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white transition-all"
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Compras
                </TabsTrigger>
                <TabsTrigger
                    value="enderecos"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent rounded-none dark:data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white transition-all"
                >
                    <MapPin className="w-4 h-4 mr-2" />
                    Endereços
                </TabsTrigger>
                <TabsTrigger
                    value="estatisticas"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent rounded-none dark:data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white transition-all"
                >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Estatísticas
                </TabsTrigger>
                </TabsList>

                {/* Aba de perfil */}
                <TabsContent value="perfil" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Informações Pessoais</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Gerencie suas informações pessoais e dados de conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="text-gray-700 dark:text-gray-300">
                                Nome completo
                                </Label>
                                <Input
                                id="nome"
                                name="nome"
                                value={editFormData.nome}
                                onChange={handleInputChange}
                                className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Email
                                </Label>
                                <Input
                                id="email"
                                name="email"
                                type="email"
                                value={editFormData.email}
                                onChange={handleInputChange}
                                className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                            </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="telefone" className="text-gray-700 dark:text-gray-300">
                                Telefone
                                </Label>
                                <Input
                                id="telefone"
                                name="telefone"
                                value={editFormData.telefone}
                                onChange={handleInputChange}
                                className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf" className="text-gray-700 dark:text-gray-300">
                                CPF
                                </Label>
                                <Input
                                id="cpf"
                                name="cpf"
                                value={editFormData.cpf}
                                onChange={handleInputChange}
                                disabled
                                className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="dataNascimento" className="text-gray-700 dark:text-gray-300">
                                Data de Nascimento
                            </Label>
                            <Input
                                id="dataNascimento"
                                name="dataNascimento"
                                type="date"
                                value={editFormData.dataNascimento}
                                onChange={handleInputChange}
                                className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                            />
                            </div>
                        </motion.div>
                        ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Nome completo</p>
                                <p className="text-gray-900 dark:text-gray-100">{currentUser?.nome || "Não informado"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Email</p>
                                <p className="text-gray-900 dark:text-gray-100">{currentUser?.email || "Não informado"}</p>
                            </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Telefone</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                {currentUser?.telefone || "Não informado"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">CPF</p>
                                <p className="text-gray-900 dark:text-gray-100">{currentUser?.cpf || "Oculto"}</p>
                            </div>
                            </div>
                            <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
                                Data de Nascimento
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {currentUser?.dataNascimento
                                ? format(new Date(currentUser.dataNascimento), "dd/MM/yyyy", { locale: ptBR })
                                : "Não informada"}
                            </p>
                            </div>
                            <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Função</p>
                            <Badge className="bg-black text-white dark:bg-white dark:text-black border-0">
                                {currentUser?.role || "Usuário"}
                            </Badge>
                            </div>
                        </motion.div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {isEditing ? (
                        <>
                            <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="mr-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                            >
                            Cancelar
                            </Button>
                            <Button
                            onClick={handleSaveProfile}
                            disabled={loading.profile}
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            >
                            {loading.profile ? (
                                <>
                                <span className="animate-spin mr-2">
                                    <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                    </svg>
                                </span>
                                Salvando...
                                </>
                            ) : (
                                "Salvar Alterações"
                            )}
                            </Button>
                        </>
                        ) : (
                        <Button
                            onClick={handleEditProfile}
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Perfil
                        </Button>
                        )}
                    </CardFooter>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Foto de Perfil</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Atualize sua foto de perfil
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <Avatar className="h-32 w-32 border-4 border-gray-100 dark:border-gray-800 shadow-sm">
                        <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.nome} />
                        <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black text-2xl">
                            {currentUser?.nome?.charAt(0) || "U"}
                        </AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                        <Label htmlFor="avatar" className="text-gray-700 dark:text-gray-300 mb-2 block">
                            Selecionar nova imagem
                        </Label>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                        />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                        className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        onClick={handleUploadAvatar}
                        disabled={!selectedFile}
                        >
                        <Camera className="w-4 h-4 mr-2" />
                        Atualizar Avatar
                        </Button>
                    </CardFooter>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Alterar Senha</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Altere sua senha de acesso
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {showPasswordAlert && (
                        <Alert
                            variant="destructive"
                            className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertTitle className="text-red-600 dark:text-red-400">Erro</AlertTitle>
                            <AlertDescription className="text-red-600 dark:text-red-400">
                            As senhas não coincidem. Por favor, verifique.
                            </AlertDescription>
                        </Alert>
                        )}
                        <div className="space-y-2">
                        <Label htmlFor="senhaAtual" className="text-gray-700 dark:text-gray-300">
                            Senha Atual
                        </Label>
                        <Input
                            id="senhaAtual"
                            name="senhaAtual"
                            type="password"
                            value={passwordData.senhaAtual}
                            onChange={handlePasswordChange}
                            className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="novaSenha" className="text-gray-700 dark:text-gray-300">
                            Nova Senha
                        </Label>
                        <Input
                            id="novaSenha"
                            name="novaSenha"
                            type="password"
                            value={passwordData.novaSenha}
                            onChange={handlePasswordChange}
                            className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="confirmarSenha" className="text-gray-700 dark:text-gray-300">
                            Confirmar Nova Senha
                        </Label>
                        <Input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            value={passwordData.confirmarSenha}
                            onChange={handlePasswordChange}
                            className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                        />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                        className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        onClick={handleSavePassword}
                        disabled={
                            !passwordData.senhaAtual ||
                            !passwordData.novaSenha ||
                            !passwordData.confirmarSenha ||
                            loading.password
                        }
                        >
                        {loading.password ? (
                            <>
                            <span className="animate-spin mr-2">
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                                </svg>
                            </span>
                            Alterando...
                            </>
                        ) : (
                            <>
                            <Key className="w-4 h-4 mr-2" />
                            Alterar Senha
                            </>
                        )}
                        </Button>
                    </CardFooter>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">Excluir Conta</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Ao excluir sua conta, você perderá acesso a todos os veículos favoritados, histórico de compras e
                        informações pessoais.
                        </p>
                        <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
                        <DialogTrigger asChild>
                            <Button
                            variant="destructive"
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Minha Conta
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-900 border-0 shadow-lg">
                            <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-gray-100">Você tem certeza?</DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400">
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus
                                dados dos nossos servidores.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                                Para confirmar, digite seu email:{" "}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.email}</span>
                            </p>
                            <Input
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Digite seu email"
                                className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                            />
                            </div>
                            <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteAccountDialog(false)}
                                className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== currentUser?.email || loading.delete}
                                className="bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                                {loading.delete ? (
                                <>
                                    <span className="animate-spin mr-2">
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        ></circle>
                                        <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    </span>
                                    Excluindo...
                                </>
                                ) : (
                                "Excluir Permanentemente"
                                )}
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    </CardContent>
                    </Card>
                </div>
                </TabsContent>

                {/* Aba de veículos */}
                <TabsContent value="veiculos" className="space-y-6">
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Meus Veículos Favoritos</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Veículos que você adicionou aos favoritos
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {favorites && favorites.length > 0 ? (
                        <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                        {favorites.map((vehicle, index) => (
                            <motion.div key={vehicle.id} variants={fadeIn} custom={index}>
                            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                                <div className="h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                {vehicle.imagens && vehicle.imagens.length > 0 ? (
                                    <img
                                    src={vehicle.imagens[0].url || "/placeholder.svg"}
                                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                    <Car className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2 bg-black text-white dark:bg-white dark:text-black border-0">
                                    {vehicle.categoria}
                                </Badge>
                                </div>
                                <CardHeader className="p-4">
                                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                                    {vehicle.marca} {vehicle.modelo} ({vehicle.anoFabricacao}/{vehicle.anoModelo})
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {vehicle?.quilometragem?.toLocaleString("pt-BR")} km • {vehicle.cambio} •{" "}
                                    {vehicle.tipoCombustivel}
                                </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                    <p className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                        R$ {vehicle?.preco?.toLocaleString("pt-BR")}
                                    </p>
                                    {vehicle.precoPromocional && (
                                        <p className="text-sm text-gray-500 dark:text-gray-500 line-through">
                                        R$ {vehicle?.precoPromocional?.toLocaleString("pt-BR")}
                                        </p>
                                    )}
                                    </div>
                                    <Badge
                                    variant={
                                        vehicle.classe === "S1" || vehicle.classe === "S2" || vehicle.classe === "X"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className={
                                        vehicle.classe === "S1" || vehicle.classe === "S2" || vehicle.classe === "X"
                                        ? "bg-black text-white dark:bg-white dark:text-black border-0"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-0"
                                    }
                                    >
                                    Classe {vehicle.classe}
                                    </Badge>
                                </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100 group"
                                    onClick={() => (window.location.href = `/vehicles/${vehicle.id}`)}
                                >
                                    Ver Detalhes
                                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                </CardFooter>
                            </Card>
                            </motion.div>
                        ))}
                        </motion.div>
                    ) : (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                        >
                        <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Nenhum veículo favorito
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Você ainda não adicionou nenhum veículo aos seus favoritos.
                        </p>
                        <Button
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            onClick={() => (window.location.href = "/veiculos")}
                        >
                            Explorar Veículos
                        </Button>
                        </motion.div>
                    )}
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Aba de compras */}
                <TabsContent value="compras" className="space-y-6">
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Minhas Compras</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Histórico de compras de veículos
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {purchases && purchases.length > 0 ? (
                        <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900">
                                <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Veículo</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Data</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Valor</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Pagamento</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Status</TableHead>
                                <TableHead className="text-right text-gray-700 dark:text-gray-300 font-medium">
                                Ações
                                </TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {purchases.map((sale) => (
                                <TableRow
                                key={sale.id}
                                className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                    {sale.vehicle
                                    ? `${sale.vehicle.marca} ${sale.vehicle.modelo} (${sale.vehicle.anoFabricacao})`
                                    : "Veículo não encontrado"}
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">
                                    {format(new Date(sale.dataVenda), "dd/MM/yyyy", { locale: ptBR })}
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300"></TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">
                                    <Badge
                                    variant="outline"
                                    className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                    {/*{sale?.metodoPagamento}*/}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                    variant={
                                        sale.status === "CONCLUIDA"
                                        ? "default"
                                        : sale.status === "CANCELADA"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                    className={
                                        sale.status === "CONCLUIDA"
                                        ? "bg-black text-white dark:bg-white dark:text-black border-0"
                                        : sale.status === "CANCELADA"
                                            ? "bg-red-600 text-white border-0"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-0"
                                    }
                                    >
                                    {sale.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => (window.location.href = `/compras/${sale.id}`)}
                                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                                    >
                                    Detalhes
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </div>
                    ) : (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                        >
                        <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Nenhuma compra realizada
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Você ainda não realizou nenhuma compra em nosso site.
                        </p>
                        <Button
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            onClick={() => (window.location.href = "/veiculos")}
                        >
                            Explorar Veículos
                        </Button>
                        </motion.div>
                    )}
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Aba de endereços */}
                <TabsContent value="enderecos" className="space-y-6">
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Meus Endereços</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Gerencie seus endereços de entrega e cobrança
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                    >
                        {showAddressForm ? (
                        <>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </>
                        ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Endereço
                        </>
                        )}
                    </Button>
                    </CardHeader>
                    <CardContent>
                    <AnimatePresence>
                        {showAddressForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mb-6"
                        >
                            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-100">
                                {editAddressId ? "Editar Endereço" : "Adicionar Endereço"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cep" className="text-gray-700 dark:text-gray-300">
                                    CEP
                                    </Label>
                                    <Input
                                    id="cep"
                                    name="cep"
                                    value={addressFormData.cep}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numero" className="text-gray-700 dark:text-gray-300">
                                    Número
                                    </Label>
                                    <Input
                                    id="numero"
                                    name="numero"
                                    value={addressFormData.numero}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                </div>
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="logradouro" className="text-gray-700 dark:text-gray-300">
                                    Logradouro
                                </Label>
                                <Input
                                    id="logradouro"
                                    name="logradouro"
                                    value={addressFormData.logradouro}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="complemento" className="text-gray-700 dark:text-gray-300">
                                    Complemento
                                </Label>
                                <Input
                                    id="complemento"
                                    name="complemento"
                                    value={addressFormData.complemento}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bairro" className="text-gray-700 dark:text-gray-300">
                                    Bairro
                                    </Label>
                                    <Input
                                    id="bairro"
                                    name="bairro"
                                    value={addressFormData.bairro}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cidade" className="text-gray-700 dark:text-gray-300">
                                    Cidade
                                    </Label>
                                    <Input
                                    id="cidade"
                                    name="cidade"
                                    value={addressFormData.cidade}
                                    onChange={handleAddressChange}
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="estado" className="text-gray-700 dark:text-gray-300">
                                    Estado
                                    </Label>
                                    <Select
                                    value={addressFormData.estado}
                                    onValueChange={(value) => setAddressFormData({ ...addressFormData, estado: value })}
                                    >
                                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                        "AC",
                                        "AL",
                                        "AP",
                                        "AM",
                                        "BA",
                                        "CE",
                                        "DF",
                                        "ES",
                                        "GO",
                                        "MA",
                                        "MT",
                                        "MS",
                                        "MG",
                                        "PA",
                                        "PB",
                                        "PR",
                                        "PE",
                                        "PI",
                                        "RJ",
                                        "RN",
                                        "RS",
                                        "RO",
                                        "RR",
                                        "SC",
                                        "SP",
                                        "SE",
                                        "TO",
                                        ].map((uf) => (
                                        <SelectItem key={uf} value={uf}>
                                            {uf}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pais" className="text-gray-700 dark:text-gray-300">
                                    País
                                    </Label>
                                    <Input
                                    id="pais"
                                    name="pais"
                                    value={addressFormData.pais}
                                    onChange={handleAddressChange}
                                    disabled
                                    className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
                                    />
                                </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                                onClick={handleAddAddress}
                                disabled={
                                    !addressFormData.cep ||
                                    !addressFormData.logradouro ||
                                    !addressFormData.numero ||
                                    !addressFormData.bairro ||
                                    !addressFormData.cidade ||
                                    !addressFormData.estado
                                }
                                >
                                <MapPin className="w-4 h-4 mr-2" />
                                {editAddressId ? "Atualizar Endereço" : "Adicionar Endereço"}
                                </Button>
                            </CardFooter>
                            </Card>
                        </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-6">
                        {addresses && addresses.length > 0 ? (
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                            {addresses.map((address, index) => (
                            <motion.div key={address.id} variants={fadeIn} custom={index}>
                                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {address.logradouro}, {address.numero}
                                        {address.complemento && `, ${address.complemento}`}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {address.bairro} - {address.cidade}/{address.estado}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address.cep}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditAddress(address)}
                                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                                        >
                                        <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                                        >
                                        <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    </div>
                                </CardContent>
                                </Card>
                            </motion.div>
                            ))}
                        </motion.div>
                        ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                        >
                            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Nenhum endereço cadastrado
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Adicione um endereço para facilitar suas compras futuras.
                            </p>
                            <Button
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            onClick={() => setShowAddressForm(true)}
                            >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Endereço
                            </Button>
                        </motion.div>
                        )}
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Aba de estatísticas */}
                <TabsContent value="estatisticas" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico 1: Distribuição de Preços (Barra Horizontal) */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Distribuição de Preços</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Comparação entre mínimo, médio e máximo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            layout="vertical"
                            data={[
                                { name: "Mínimo", value: userStats?.precoMinimo || 0 },
                                { name: "Médio", value: userStats?.precoMedio || 0 },
                                { name: "Máximo", value: userStats?.precoMaximo || 0 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis type="number" stroke="#888888" />
                            <YAxis dataKey="name" type="category" stroke="#888888" />
                            <Tooltip
                                formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]}
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#000000" name="Preço (R$)" />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Gráfico 2: Média de Anos (Barra Cluster) */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Comparação de Anos</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Média de ano de fabricação vs modelo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            data={[
                                {
                                name: "Anos",
                                Fabricação: userStats?.anoFabricacaoMedio || 0,
                                Modelo: userStats?.anoModeloMedio || 0,
                                },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip
                                formatter={(value) => [value, "Ano"]}
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            <Bar dataKey="Fabricação" fill="#000000" />
                            <Bar dataKey="Modelo" fill="#666666" />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico 3: Valor Total vs Quantidade (Combo) */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Inventário</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Relação entre quantidade e valor total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                            data={[
                                {
                                name: "Inventário",
                                quantidade: userStats?.totalVehicles || 0,
                                valor: (userStats?.valorTotalInventario || 0) / 1000, // Em milhares
                                },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis yAxisId="left" orientation="left" stroke="#888888" />
                            <YAxis yAxisId="right" orientation="right" stroke="#888888" />
                            <Tooltip
                                formatter={(value, name) =>
                                name === "valor"
                                    ? [`R$ ${Number(value).toLocaleString("pt-BR")} mil`, "Valor"]
                                    : [value, "Quantidade"]
                                }
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="quantidade" fill="#000000" name="Quantidade" />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="valor"
                                stroke="#666666"
                                name="Valor (mil R$)"
                            />
                            </ComposedChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Gráfico 4: Proporção Preço Médio (Pizza) */}
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Proporção de Valores</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Relação entre mínimo, médio e máximo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={[
                                { name: "Mínimo", value: userStats?.precoMinimo || 1 },
                                {
                                    name: "Médio",
                                    value: (userStats?.precoMedio || 0) - (userStats?.precoMinimo || 0),
                                },
                                {
                                    name: "Máximo",
                                    value: (userStats?.precoMaximo || 0) - (userStats?.precoMedio || 0),
                                },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {["Mínimo", "Médio", "Máximo"].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]}
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Distribuição de Valores</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Comparação entre mínimo, médio e máximo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                            data={[
                                { name: "Mínimo", valor: userStats?.precoMinimo || 0 },
                                { name: "Médio", valor: userStats?.precoMedio || 0 },
                                { name: "Máximo", valor: userStats?.precoMaximo || 0 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip
                                formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]}
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="valor" stroke="#000000" activeDot={{ r: 8 }} name="Preço" />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Evolução dos Anos</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                        Comparação entre ano de fabricação e modelo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                            data={[
                                {
                                name: "Ano",
                                fabricacao: userStats?.anoFabricacaoMedio || 0,
                                modelo: userStats?.anoModeloMedio || 0,
                                },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis stroke="#888888" />
                            <Tooltip
                                formatter={(value) => [value, "Ano"]}
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="fabricacao"
                                stroke="#000000"
                                fill="#000000"
                                fillOpacity={0.2}
                                name="Fabricação"
                            />
                            <Area
                                type="monotone"
                                dataKey="modelo"
                                stroke="#666666"
                                fill="#666666"
                                fillOpacity={0.2}
                                name="Modelo"
                            />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                </TabsContent>
            </Tabs>
            </motion.div>
        </div>
        </div>
    )
}
