import React, { useState, useEffect } from 'react';
import { useAuth } from '~/src/hooks/useAuth';
import useUserStore from '~/src/hooks/useUser';
import useVehicle from '~/src/hooks/useVehicle';
import useSale from '~/src/hooks/useSale';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Address } from '~/src/store/slices/user';
import { motion, AnimatePresence } from "framer-motion";
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
    Area
} from 'recharts';
import { Check, AlertCircle, Car, User, ShoppingCart, Settings, Trash2, Heart, Star, FileText, LogOut, Key, MapPin, Camera } from 'lucide-react';
import _ from 'lodash';



// Importando componentes do shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Badge } from '~/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

import type { UserUpdateData } from '~/src/services/user';

// Define o esquema de cores para os gráficos
const COLORS = ['#121212', '#909090', '#303030', '#404040', '#000000', '#505050', '#100100'];


export default function Dashboard() {
    const { user, logout, isAuthenticated, status: authStatus } = useAuth();
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
        removeUser
    } = useUserStore();
    const { 
        vehicles, 
        favorites, 
        stats: saleStats, // As estatísticas de vendas (global/user)
        stats: vehicleStats, 
        loading: vehicleLoading, 
        fetchUserFavorites, 
        fetchVehicleStats
    } = useVehicle();

    const { 
        purchases,          // Histórico de compras (substitui userSales)
        sellerSales,       // Novo - Histórico como vendedor
        stats,             // Agora contém { global, user }
        loading: saleLoading,
        error: saleError,
        fetchPurchasesByUser,  // Substitui fetchSalesByUser
        fetchSalesBySeller,    // Novo
        fetchGlobalSalesStats, // Substitui fetchSalesStats
        fetchUserSalesStats    
    } = useSale();

    const [activeTab, setActiveTab] = useState('perfil');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dataNascimento: ''
    });

    const [passwordData, setPasswordData] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [addressFormData, setAddressFormData] = useState({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil'
    });

    const [editAddressId, setEditAddressId] = useState<string | null>(null);
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Carrega os dados do usuário quando o componente monta
    useEffect(() => {
        if (isAuthenticated && user?.id) {
        getUserById(user.id);
        getUserAddresses(user.id);
        fetchUserFavorites();
        fetchVehicleStats();
        fetchPurchasesByUser(user.id);
        fetchSalesBySeller(user.id); // Novo
        fetchGlobalSalesStats();
        fetchUserSalesStats(user.id); // Novo
        getUserStats(user.id); // Adicione esta linha
        }
    }, [isAuthenticated, user?.id]);

    // Atualiza o formulário quando os dados do usuário forem carregados
    useEffect(() => {
        if (currentUser) {
        setEditFormData({
            nome: currentUser.nome || '',
            email: currentUser.email || '',
            telefone: currentUser.telefone || '',
            cpf: currentUser.cpf || '',
            dataNascimento: currentUser.dataNascimento ? currentUser.dataNascimento.split('T')[0] : ''
        });
        }
    }, [currentUser]);

    // Handlers para edição de perfil
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressFormData({ ...addressFormData, [name]: value });
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    const [loading, setLoading] = useState({
        profile: false,
        password: false,
        delete: false,
    });

    
    const handleSaveProfile = async () => {
        if (user?.id) {
            setLoading(prev => ({ ...prev, profile: true }));
            
            try {
                // Preparar os dados, validando cada campo individualmente
                const updateData: UserUpdateData = {};
                
                // Apenas incluir campos que não estão vazios
                if (editFormData.nome && editFormData.nome.trim()) {
                    updateData.nome = editFormData.nome.trim();
                }
                
                if (editFormData.email && editFormData.email.trim()) {
                    updateData.email = editFormData.email.trim();
                }
                
                // Formatar telefone conforme esperado pelo backend (apenas dígitos)
                if (editFormData.telefone) {
                    // Remove todos os caracteres não numéricos
                    const telefoneFormatado = editFormData.telefone.replace(/\D/g, '');
                    if (telefoneFormatado.length >= 10 && telefoneFormatado.length <= 11) {
                        updateData.telefone = telefoneFormatado;
                    } else if (telefoneFormatado === '') {
                        // Se o usuário apagou o telefone, enviar null
                        updateData.telefone = null;
                    } else {
                        throw new Error('Telefone deve ter entre 10 e 11 dígitos');
                    }
                }
                
                // Formatar CPF conforme esperado pelo backend (11 dígitos)
                if (editFormData.cpf) {
                    const cpfFormatado = editFormData.cpf.replace(/\D/g, '');
                    if (cpfFormatado.length === 11 || cpfFormatado === '') {
                        updateData.cpf = cpfFormatado || null;
                    } else {
                        throw new Error('CPF deve ter 11 dígitos');
                    }
                }
                
                // Tratar a data de nascimento adequadamente
                if (editFormData.dataNascimento) {
                    // Garantir que é uma data válida antes de converter
                    const dateObj = new Date(editFormData.dataNascimento);
                    if (!isNaN(dateObj.getTime())) {
                        // O backend espera uma string no formato YYYY-MM-DD
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        updateData.dataNascimento = `${year}-${month}-${day}`;
                    }
                } else if (editFormData.dataNascimento === null) {
                    // Se o usuário removeu a data, enviar null explicitamente
                    updateData.dataNascimento = null;
                }
                
                // Verificar se há dados para atualizar
                if (Object.keys(updateData).length === 0) {
                    throw new Error('Nenhum dado para atualizar');
                }
                
                console.log("Dados sendo enviados:", updateData);
                
                // Enviar para o servidor
                await updateUserData(user.id, updateData);
                
                // Atualizar UI
                setIsEditing(false);
                setNotification({
                    show: true,
                    message: "Perfil atualizado com sucesso!",
                    type: "success"
                });
                
                // Atualizar dados locais
                if (user?.id) {
                    getUserById(user.id);
                }
            } catch (error) {
                console.error("Erro ao atualizar perfil:", error);
                setNotification({
                    show: true,
                    message: `Erro ao atualizar perfil: ${error instanceof Error ? error.message : 'Tente novamente.'}`,
                    type: "error"
                });
            } finally {
                setLoading(prev => ({ ...prev, profile: false }));
            }
        }
    };

    const handleSavePassword = async () => {
        // Validação local - verifica se as senhas coincidem
        if (passwordData.novaSenha !== passwordData.confirmarSenha) {
            setShowPasswordAlert(true);
            return;
        }
        
        if (!passwordData.senhaAtual || !passwordData.novaSenha) {
            setNotification({
                show: true,
                message: "Senhas atuais e novas são obrigatórias",
                type: "error"
            });
            return;
        }
        
        // Iniciar loading
        setLoading(prev => ({ ...prev, password: true }));
        
        try {
            if (!user?.id) {
                throw new Error("ID do usuário não encontrado");
            }
            
            // Preparar dados para envio
            const updateData: UserUpdateData = {
                senhaAtual: passwordData.senhaAtual,
                senha: passwordData.novaSenha // 'senha' é o campo esperado pelo backend, não 'novaSenha'
            };
            
            console.log("Enviando alteração de senha...");
            
            // Reutilizar a mesma função que atualiza o usuário
            await updateUserData(user.id, updateData);
            
            // Feedback ao usuário
            setNotification({
                show: true,
                message: "Senha alterada com sucesso!",
                type: "success"
            });
            
            // Resetar o formulário
            setPasswordData({
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            });
            
            setShowPasswordAlert(false);
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            
            // Feedback de erro específico para o usuário
            let errorMessage = "Erro ao alterar senha.";
            
            // Se o erro for relacionado à senha atual incorreta (comum neste caso)
            if (error instanceof Error && error.message.includes("senha atual")) {
                errorMessage = "Senha atual incorreta. Por favor, verifique.";
            }
            
            setNotification({
                show: true,
                message: errorMessage,
                type: "error"
            });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleAddAddress = async () => {
        if (user?.id) {
        if (editAddressId) {
            await modifyAddress(editAddressId, addressFormData);
        } else {
            await createAddress(user.id, addressFormData);
        }
        
        // Resetar o formulário
        setAddressFormData({
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: 'Brasil'
        });
        setEditAddressId(null);
        }
    };

    const handleEditAddress = (address: Address) => {
        setAddressFormData({
        cep: address.cep,
        logradouro: address.logradouro,
        numero: address.numero,
        complemento: address.complemento || '',
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        pais: address.pais || 'Brasil'
        });
        setEditAddressId(address.id);
    };

    const handleDeleteAddress = async (addressId: string) => {
        await removeAddress(addressId);
    };

      
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadAvatar = async () => {
        if (selectedFile && user?.id) {
        await uploadUserAvatar(user.id, selectedFile);
        setSelectedFile(null);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation === currentUser?.email && user?.id) {
        await removeUser(user.id);
        await logout();
        }
    };
 

    if (authStatus === 'loading' || userLoading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Carregando...</p>
            </div>
        </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center">Acesso Restrito</CardTitle>
                <CardDescription className="text-center">
                Você precisa estar logado para acessar esta página.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
                <Button onClick={() => window.location.href = '/login'}>
                Ir para o Login
                </Button>
            </CardFooter>
            </Card>
        </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Car className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{userStats?.totalVehicles || 0}</div>
                <p className="text-xs text-muted-foreground">
                    {((userStats?.totalVehicles || 0) / (vehicleStats?.totalVehicles || 1) * 100).toFixed(1)}% do catálogo
                </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    R$ {userStats?.valorTotalInventario?.toLocaleString('pt-BR') || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                    Em inventário
                </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
                <Star className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    R$ {userStats?.precoMedio?.toLocaleString('pt-BR') || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                    Por veículo
                </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faixa de Preços</CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    R$ {userStats?.precoMinimo?.toLocaleString('pt-BR') || 0} - R$ {userStats?.precoMaximo?.toLocaleString('pt-BR') || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                    Min - Max
                </p>
                </CardContent>
            </Card>
        </div>

        <Tabs
            defaultValue="perfil"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
        >
            <TabsList className="grid grid-cols-5 md:w-[600px]">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="veiculos">Veículos</TabsTrigger>
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="enderecos">Endereços</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>

            {/* Aba de perfil */}
            <TabsContent value="perfil" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                    Gerencie suas informações pessoais e dados de conta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome completo</Label>
                            <Input
                            id="nome"
                            name="nome"
                            value={editFormData.nome}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            />
                        </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                            id="telefone"
                            name="telefone"
                            value={editFormData.telefone}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                            id="cpf"
                            name="cpf"
                            value={editFormData.cpf}
                            onChange={handleInputChange}
                            disabled
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                        <Input
                            id="dataNascimento"
                            name="dataNascimento"
                            type="date"
                            value={editFormData.dataNascimento}
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>
                    ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nome completo</p>
                            <p>{currentUser?.nome}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{currentUser?.email}</p>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                            <p>{currentUser?.telefone || "Não informado"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">CPF</p>
                            <p>{currentUser?.cpf || "Oculto"}</p>
                        </div>
                        </div>
                        <div>
                        <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                        <p>
                            {currentUser?.dataNascimento
                            ? format(new Date(currentUser.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })
                            : "Não informada"}
                        </p>
                        </div>
                        <div>
                        <p className="text-sm font-medium text-muted-foreground">Função</p>
                        <Badge>{currentUser?.role}</Badge>
                        </div>
                    </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {isEditing ? (
                    <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile}>
                        Salvar Alterações
                        </Button>
                    </>
                    ) : (
                    <Button onClick={handleEditProfile}>
                        Editar Perfil
                    </Button>
                    )}
                </CardFooter>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Foto de Perfil</CardTitle>
                    <CardDescription>
                    Atualize sua foto de perfil
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.nome} />
                    <AvatarFallback>{currentUser?.nome?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    />
                </CardContent>
                <CardFooter>
                    <Button
                    className="w-full"
                    onClick={handleUploadAvatar}
                    disabled={!selectedFile}
                    >
                    <Camera className="w-4 h-4 mr-2" />
                    Atualizar Avatar
                    </Button>
                </CardFooter>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                    Altere sua senha de acesso
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showPasswordAlert && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>
                        As senhas não coincidem. Por favor, verifique.
                        </AlertDescription>
                    </Alert>
                    )}
                    <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                        id="senhaAtual"
                        name="senhaAtual"
                        type="password"
                        value={passwordData.senhaAtual}
                        onChange={handlePasswordChange}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                        id="novaSenha"
                        name="novaSenha"
                        type="password"
                        value={passwordData.novaSenha}
                        onChange={handlePasswordChange}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        value={passwordData.confirmarSenha}
                        onChange={handlePasswordChange}
                    />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                    className="w-full"
                    onClick={handleSavePassword}
                    disabled={!passwordData.senhaAtual || !passwordData.novaSenha || !passwordData.confirmarSenha}
                    >
                    <Key className="w-4 h-4 mr-2" />
                    Alterar Senha
                    </Button>
                </CardFooter>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Excluir Conta</CardTitle>
                    <CardDescription>
                    Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                    Ao excluir sua conta, você perderá acesso a todos os veículos favoritados, histórico de compras e informações pessoais.
                    </p>
                    <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Minha Conta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Você tem certeza?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados dos nossos servidores.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                        <p className="mb-2 text-sm">
                            Para confirmar, digite seu email: <span className="font-bold">{currentUser?.email}</span>
                        </p>
                        <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Digite seu email"
                        />
                        </div>
                        <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAccountDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== currentUser?.email}
                        >
                            Excluir Permanentemente
                        </Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                </CardContent>
                </Card>
            </div>
            </TabsContent>

            {/* Aba de veículos */}
            <TabsContent value="veiculos" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Meus Veículos Favoritos</CardTitle>
                <CardDescription>
                    Veículos que você adicionou aos favoritos
                </CardDescription>
                </CardHeader>
                <CardContent>
                {favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((vehicle) => (
                        <Card key={vehicle.id} className="overflow-hidden">
                        <div className="h-48 bg-muted relative">
                            {vehicle.imagens && vehicle.imagens.length > 0 ? (
                            <img
                                src={vehicle.imagens[0]}
                                alt={`${vehicle.marca} ${vehicle.modelo}`}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-12 h-12 text-muted-foreground" />
                            </div>
                            )}
                            <Badge className="absolute top-2 right-2 bg-primary">
                            {vehicle.categoria}
                            </Badge>
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">
                            {vehicle.marca} {vehicle.modelo} ({vehicle.anoFabricacao}/{vehicle.anoModelo})
                            </CardTitle>
                            <CardDescription>
                            {vehicle?.quilometragem?.toLocaleString('pt-BR')} km • {vehicle.cambio} • {vehicle.tipoCombustivel}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">
                                R$ {vehicle?.preco?.toLocaleString('pt-BR')}
                                </p>
                                {vehicle.precoPromocional && (
                                <p className="text-sm text-muted-foreground line-through">
                                    R$ {vehicle?.precoPromocional?.toLocaleString('pt-BR')}
                                </p>
                                )}
                            </div>
                            <Badge variant={vehicle.classe === 'S1' || vehicle.classe === 'S2' || vehicle.classe === 'X' ? "destructive" : "secondary"}>
                                Classe {vehicle.classe}
                            </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full" onClick={() => window.location.href = `/veiculos/${vehicle.id}`}>
                            Ver Detalhes
                            </Button>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhum veículo favorito</h3>
                    <p className="text-muted-foreground">
                        Você ainda não adicionou nenhum veículo aos seus favoritos.
                    </p>
                    <Button className="mt-4" onClick={() => window.location.href = '/veiculos'}>
                        Explorar Veículos
                    </Button>
                    </div>
                )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* Aba de compras */}
            <TabsContent value="compras" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Minhas Compras</CardTitle>
                <CardDescription>
                    Histórico de compras de veículos
                </CardDescription>
                </CardHeader>
                <CardContent>
                {purchases && purchases.length > 0 ? (
                    <Table>
                    <TableCaption>Histórico de compras</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell className="font-medium">
                            {sale.vehicle ? `${sale.vehicle.marca} ${sale.vehicle.modelo} (${sale.vehicle.anoFabricacao})` : "Veículo não encontrado"}
                            </TableCell>
                            <TableCell>
                            {format(new Date(sale.dataVenda), 'dd/MM/yyyy', { locale: ptBR })}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                            {/*R$ {sale?.valorTotal?.toLocaleString('pt-BR')}*/}
                            </TableCell>
                            <TableCell>
                            <Badge variant="outline">
                                {/*{sale?.metodoPagamento}*/}
                            </Badge>
                            </TableCell>
                            <TableCell>
                            <Badge
                                variant={
                                sale.status === 'CONCLUIDA' 
                                    ? 'default' 
                                    : sale.status === 'CANCELADA'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                            >
                                {sale.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.location.href = `/compras/${sale.id}`}
                            >
                                Detalhes
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma compra realizada</h3>
                    <p className="text-muted-foreground">
                        Você ainda não realizou nenhuma compra em nosso site.
                    </p>
                    <Button className="mt-4" onClick={() => window.location.href = '/veiculos'}>
                        Explorar Veículos
                    </Button>
                    </div>
                )}
                </CardContent>
            </Card>
            </TabsContent>

            {/* Aba de endereços */}
            <TabsContent value="enderecos" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Meus Endereços</CardTitle>
                <CardDescription>
                    Gerencie seus endereços de entrega e cobrança
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                    <CardHeader>
                        <CardTitle>
                        {editAddressId ? 'Editar Endereço' : 'Adicionar Endereço'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                            id="cep"
                            name="cep"
                            value={addressFormData.cep}
                            onChange={handleAddressChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="numero">Número</Label>
                            <Input
                            id="numero"
                            name="numero"
                            value={addressFormData.numero}
                            onChange={handleAddressChange}
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="logradouro">Logradouro</Label>
                        <Input
                            id="logradouro"
                            name="logradouro"
                            value={addressFormData.logradouro}
                            onChange={handleAddressChange}
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                            id="complemento"
                            name="complemento"
                            value={addressFormData.complemento}
                            onChange={handleAddressChange}
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input
                            id="bairro"
                            name="bairro"
                            value={addressFormData.bairro}
                            onChange={handleAddressChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input
                            id="cidade"
                            name="cidade"
                            value={addressFormData.cidade}
                            onChange={handleAddressChange}
                            />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado</Label>
                            <Select
                            value={addressFormData.estado}
                            onValueChange={(value) =>
                                setAddressFormData({ ...addressFormData, estado: value })
                            }
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
                                'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
                                'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                                ].map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                    {uf}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pais">País</Label>
                            <Input
                            id="pais"
                            name="pais"
                            value={addressFormData.pais}
                            onChange={handleAddressChange}
                            disabled
                            />
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                        className="w-full"
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
                        {editAddressId ? 'Atualizar Endereço' : 'Adicionar Endereço'}
                        </Button>
                    </CardFooter>
                    </Card>

                    <div className="space-y-4">
                    <h3 className="text-lg font-medium">Endereços Cadastrados</h3>
                    {addresses && addresses.length > 0 ? (
                        <div className="space-y-3">
                        {addresses.map((address) => (
                            <Card key={address.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">
                                    {address.logradouro}, {address.numero}
                                    {address.complemento && `, ${address.complemento}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                    {address.bairro} - {address.cidade}/{address.estado}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                    {address.cep}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAddress(address)}
                                    >
                                    <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Nenhum endereço cadastrado
                        </p>
                        </div>
                    )}
                    </div>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

          {/* Aba de estatísticas */}
            <TabsContent value="estatisticas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico 1: Distribuição de Preços (Barra Horizontal) */}
                <Card>
                <CardHeader>
                    <CardTitle>Distribuição de Preços</CardTitle>
                    <CardDescription>
                    Comparação entre mínimo, médio e máximo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        layout="vertical"
                        data={[
                            { name: 'Mínimo', value: userStats?.precoMinimo || 0 },
                            { name: 'Médio', value: userStats?.precoMedio || 0 },
                            { name: 'Máximo', value: userStats?.precoMaximo || 0 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip 
                            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#121212" name="Preço (R$)" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>

                {/* Gráfico 2: Média de Anos (Barra Cluster) */}
                <Card>
                <CardHeader>
                    <CardTitle>Comparação de Anos</CardTitle>
                    <CardDescription>
                    Média de ano de fabricação vs modelo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        data={[
                            { 
                            name: 'Anos', 
                            Fabricação: userStats?.anoFabricacaoMedio || 0, 
                            Modelo: userStats?.anoModeloMedio || 0 
                            }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [value, 'Ano']}
                        />
                        <Legend />
                        <Bar dataKey="Fabricação" fill="#121212" />
                        <Bar dataKey="Modelo" fill="#909090" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico 3: Valor Total vs Quantidade (Combo) */}
                <Card>
                <CardHeader>
                    <CardTitle>Inventário</CardTitle>
                    <CardDescription>
                    Relação entre quantidade e valor total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                        data={[
                            { 
                            name: 'Inventário', 
                            quantidade: userStats?.totalVehicles || 0, 
                            valor: (userStats?.valorTotalInventario || 0) / 1000 // Em milhares
                            }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                            formatter={(value, name) => 
                            name === 'valor' ? [`R$ ${Number(value).toLocaleString('pt-BR')} mil`, 'Valor'] 
                            : [value, 'Quantidade']
                            }
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="quantidade" fill="#121212" name="Quantidade" />
                        <Line yAxisId="right" type="monotone" dataKey="valor" stroke="#909090" name="Valor (mil R$)" />
                        </ComposedChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>

                {/* Gráfico 4: Proporção Preço Médio (Pizza) */}
                <Card>
                <CardHeader>
                    <CardTitle>Proporção de Valores</CardTitle>
                    <CardDescription>
                    Relação entre mínimo, médio e máximo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={[
                            { name: 'Mínimo', value: userStats?.precoMinimo || 1 },
                            { name: 'Médio', value: (userStats?.precoMedio || 0) - (userStats?.precoMinimo || 0) },
                            { name: 'Máximo', value: (userStats?.precoMaximo || 0) - (userStats?.precoMedio || 0) }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {['Mínimo', 'Médio', 'Máximo'].map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                        />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Distribuição de Valores</CardTitle>
                    <CardDescription>
                    Comparação entre mínimo, médio e máximo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        data={[
                            { name: 'Mínimo', valor: userStats?.precoMinimo || 0 },
                            { name: 'Médio', valor: userStats?.precoMedio || 0 },
                            { name: 'Máximo', valor: userStats?.precoMaximo || 0 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="valor"
                            stroke="#121212"
                            activeDot={{ r: 8 }}
                            name="Preço"
                        />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Evolução dos Anos</CardTitle>
                    <CardDescription>
                    Comparação entre ano de fabricação e modelo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                        data={[
                            { 
                            name: 'Ano', 
                            fabricacao: userStats?.anoFabricacaoMedio || 0, 
                            modelo: userStats?.anoModeloMedio || 0 
                            }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [value, 'Ano']}
                        />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="fabricacao" 
                            stroke="#121212" 
                            fill="#121212" 
                            name="Fabricação" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="modelo" 
                            stroke="#909090" 
                            fill="#909090" 
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
        </div>
    );
}