import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useVehicle from '~/src/hooks/useVehicle';

import type { Accept } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { FileUpload } from '~/src/_components/common/_file/file';
import {
    Loader2,
    ChevronLeft,
    Car,
    ImageIcon,
    Settings,
    Tag,
    Plus,
    Info,
    AlertCircle,
    CheckCircle2,
 } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import type { UseFormReturn } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
export const FuelType = {
    GASOLINA: 'GASOLINA',
    ETANOL: 'ETANOL',
    FLEX: 'FLEX',
    DIESEL: 'DIESEL',
    ELETRICO: 'ELETRICO',
    HIBRIDO: 'HIBRIDO',
    GNV: 'GNV'
} as const;

export const TransmissionType = {
    MANUAL: 'MANUAL',
    AUTOMATICO: 'AUTOMATICO',
    SEMI_AUTOMATICO: 'SEMI_AUTOMATICO',
    CVT: 'CVT'
} as const;

export const BodyType = {
    HATCH: 'HATCH',
    SEDAN: 'SEDAN',
    SUV: 'SUV',
    PICAPE: 'PICAPE',
    COUPE: 'COUPE',
    CONVERSIVEL: 'CONVERSIVEL',
    PERUA: 'PERUA',
    MINIVAN: 'MINIVAN',
    VAN: 'VAN',
    BUGGY: 'BUGGY',
    OFFROAD: 'OFFROAD'
} as const;

export const VehicleCategory = {
    HYPERCAR: 'HYPERCAR',
    SUPERCAR: 'SUPERCAR',
    SPORTS_CAR: 'SPORTS_CAR',
    CLASSIC_MUSCLE: 'CLASSIC_MUSCLE',
    MODERN_MUSCLE: 'MODERN_MUSCLE',
    RETRO_SUPER: 'RETRO_SUPER',
    DRIFT_CAR: 'DRIFT_CAR',
    TRACK_TOY: 'TRACK_TOY',
    OFFROAD: 'OFFROAD',
    BUGGY: 'BUGGY',
    PICKUP_4X4: 'PICKUP_4X4',
    SUV: 'SUV',
    HOT_HATCH: 'HOT_HATCH',
    SALOON: 'SALOON',
    GT: 'GT',
    RALLY: 'RALLY',
    CONCEPT: 'CONCEPT'
} as const;

export const VehicleClass = {
    D: 'D',
    C: 'C',
    B: 'B',
    A: 'A',
    S1: 'S1',
    S2: 'S2',
    X: 'X'
} as const;


const acceptedFileTypes: Accept = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
};

export const vehicleFormSchema = z.object({
    marca: z.string().min(1, 'Marca é obrigatória'),
    modelo: z.string().min(1, 'Modelo é obrigatório'),
    anoFabricacao: z.number().int().min(1886, 'Ano inválido').max(new Date().getFullYear() + 1),
    anoModelo: z.number().int().min(1886, 'Ano inválido').max(new Date().getFullYear() + 1),
    preco: z.number().positive('Preço deve ser positivo'),
    precoPromocional: z.number().positive('Preço promocional deve ser positivo').optional(),
    descricao: z.string().optional(),
    quilometragem: z.number().min(0, 'Quilometragem não pode ser negativa'),
    tipoCombustivel: z.nativeEnum(FuelType),
    cambio: z.nativeEnum(TransmissionType),
    cor: z.string().min(1, 'Cor é obrigatória'),
    portas: z.number().int().min(2).max(5),
    finalPlaca: z.number().int().min(0).max(9).optional(),
    carroceria: z.nativeEnum(BodyType),
    potencia: z.number().int().positive().optional(),
    motor: z.string().optional(),
    categoria: z.nativeEnum(VehicleCategory),
    classe: z.nativeEnum(VehicleClass),
    destaque: z.boolean().default(false),
    seloOriginal: z.boolean().default(false),
    aceitaTroca: z.boolean().default(false),
    parcelamento: z.number().int().positive().optional(),

    imagens: z.array(z.union([z.object({
        id: z.string(),
        url: z.string()
    }), z.instanceof(File)])).optional()
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>
;


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


const CreateVehiclePage = () => {
    const { createVehicle, uploadVehicleImages, loading } = useVehicle()
    const navigate = useNavigate()
    const [files, setFiles] = useState<File[]>([])
    const [activeTab, setActiveTab] = useState("basic")
    const [formProgress, setFormProgress] = useState(25)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form: UseFormReturn<VehicleFormValues> = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleFormSchema) as unknown as Resolver<VehicleFormValues>,
        defaultValues: {
        marca: "",
        modelo: "",
        anoFabricacao: new Date().getFullYear(),
        anoModelo: new Date().getFullYear(),
        preco: 0,
        quilometragem: 0,
        tipoCombustivel: "GASOLINA",
        cambio: "MANUAL",
        cor: "",
        portas: 4,
        carroceria: "SEDAN",
        categoria: "SPORTS_CAR",
        classe: "B",
        destaque: false,
        seloOriginal: false,
        aceitaTroca: false,
        },
    })

    useEffect(() => {
        // Update progress based on form completion
        const values = form.getValues()
        let completedFields = 0
        let totalFields = 0

        // Count required fields that have values
        Object.entries(values).forEach(([key, value]) => {
        if (key !== "imagens" && key !== "precoPromocional" && key !== "descricao" && key !== "finalPlaca") {
            totalFields++
            if (value !== undefined && value !== "" && value !== 0) {
            completedFields++
            }
        }
        })

        // Add image progress
        if (files.length > 0) {
        completedFields++
        }
        totalFields++

        const progress = Math.round((completedFields / totalFields) * 100)
        setFormProgress(progress)
    }, [form, files])

    const onSubmit = async (data: VehicleFormValues) => {
        setIsSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
        const vehicle = await createVehicle(data)

        if (files.length > 0 && vehicle?.id) {
            await uploadVehicleImages(vehicle.id, files)
        }

        setFormSuccess("Veículo criado com sucesso!")
        setTimeout(() => {
            navigate(`/vehicles/${vehicle.id}`)
        }, 1500)
        } catch (error) {
        console.error("Erro ao criar veículo:", error)
        setFormError("Ocorreu um erro ao criar o veículo. Por favor, tente novamente.")
        setIsSubmitting(false)
        }
    }

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles)
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    const getFuelTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
        GASOLINA: "Gasolina",
        ETANOL: "Etanol",
        FLEX: "Flex",
        DIESEL: "Diesel",
        ELETRICO: "Elétrico",
        HIBRIDO: "Híbrido",
        GNV: "GNV",
        }
        return labels[type] || type
    }

    const getTransmissionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
        MANUAL: "Manual",
        AUTOMATICO: "Automático",
        SEMI_AUTOMATICO: "Semi-automático",
        CVT: "CVT",
        }
        return labels[type] || type
    }

    const getBodyTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
        HATCH: "Hatch",
        SEDAN: "Sedã",
        SUV: "SUV",
        PICAPE: "Picape",
        COUPE: "Cupê",
        CONVERSIVEL: "Conversível",
        PERUA: "Perua",
        MINIVAN: "Minivan",
        VAN: "Van",
        BUGGY: "Buggy",
        OFFROAD: "Off-road",
        }
        return labels[type] || type
    }

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
        HYPERCAR: "Hypercar",
        SUPERCAR: "Supercar",
        SPORTS_CAR: "Sports Car",
        CLASSIC_MUSCLE: "Classic Muscle",
        MODERN_MUSCLE: "Modern Muscle",
        RETRO_SUPER: "Retro Super",
        DRIFT_CAR: "Drift Car",
        TRACK_TOY: "Track Toy",
        OFFROAD: "Offroad",
        BUGGY: "Buggy",
        PICKUP_4X4: "Pickup 4x4",
        SUV: "SUV",
        HOT_HATCH: "Hot Hatch",
        SALOON: "Saloon",
        GT: "GT",
        RALLY: "Rally",
        CONCEPT: "Concept",
        }
        return labels[category] || category
    }

    const getClassLabel = (vehicleClass: string) => {
        const labels: Record<string, string> = {
        D: "Classe D (Básico)",
        C: "Classe C (Intermediário)",
        B: "Classe B (Avançado)",
        A: "Classe A (Especialista)",
        S1: "Classe S1 (Super)",
        S2: "Classe S2 (Ultra)",
        X: "Classe X (Extremo)",
        }
        return labels[vehicleClass] || vehicleClass
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm py-4">
            <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
                <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                <ChevronLeft size={16} className="mr-2" /> Voltar
                </Button>
                <div className="flex items-center gap-2">
                <div className="hidden md:block">
                    <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                    >
                    Progresso: {formProgress}%
                    </Badge>
                </div>
                <Button
                    type="button"
                    onClick={() => form.handleSubmit(onSubmit)()}
                    disabled={isSubmitting}
                    className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                >
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                    </>
                    ) : (
                    "Salvar Veículo"
                    )}
                </Button>
                </div>
            </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
            >
            <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">Adicionar Novo Veículo</h1>
            <p className="text-gray-600 font-extralight dark:text-gray-400">
                Preencha os detalhes do veículo que deseja anunciar em nossa loja.
            </p>
            </motion.div>

            <div className="md:hidden mb-6">
            <Progress value={formProgress} className="h-2 bg-gray-200 dark:bg-gray-800" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">{formProgress}% completo</p>
            </div>

            <AnimatePresence>
            {formError && (
                <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
                >
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertTitle className="text-red-600 dark:text-red-400">Erro</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">{formError}</AlertDescription>
                </Alert>
                </motion.div>
            )}

            {formSuccess && (
                <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
                >
                <Alert className="bg-black text-white dark:bg-white dark:text-black border-0">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>{formSuccess}</AlertDescription>
                </Alert>
                </motion.div>
            )}
            </AnimatePresence>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent dark:bg-gray-900 p-1 rounded-lg mb-6">
                    <TabsTrigger
                    value="basic"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white  flex items-center gap-2"
                    >
                    <Car className="h-4 w-4" />
                    <span className="hidden sm:inline">Informações Básicas</span>
                    <span className="sm:hidden">Básico</span>
                    </TabsTrigger>
                    <TabsTrigger
                    value="images"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white  flex items-center gap-2"
                    >
                    <ImageIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Imagens</span>
                    <span className="sm:hidden">Fotos</span>
                    </TabsTrigger>
                    <TabsTrigger
                    value="technical"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white  flex items-center gap-2"
                    >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Detalhes Técnicos</span>
                    <span className="sm:hidden">Técnico</span>
                    </TabsTrigger>
                    <TabsTrigger
                    value="additional"
                    className="data-[state=active]:border-b-zinc-950 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white  flex items-center gap-2"
                    >
                    <Tag className="h-4 w-4" />
                    <span className="hidden sm:inline">Opções Adicionais</span>
                    <span className="sm:hidden">Opções</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                    <motion.div variants={fadeIn} className="md:col-span-2">
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Info className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Informações Básicas
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                            Detalhes essenciais sobre o veículo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Marca*</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Ex: Ford, Toyota, BMW..."
                                        {...field}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="modelo"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Modelo*</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Ex: Mustang, Corolla, X5..."
                                        {...field}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="anoFabricacao"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Ano de Fabricação*</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        min={1886}
                                        max={new Date().getFullYear() + 1}
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="anoModelo"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Ano do Modelo*</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        min={1886}
                                        max={new Date().getFullYear() + 1}
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="preco"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Preço*</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="precoPromocional"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                    Preço Promocional (opcional)
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...field}
                                        onChange={(e) =>
                                        field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                                        }
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Descrição</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Descreva o veículo em detalhes..."
                                    className="min-h-[120px] border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                            />

                            <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={() => setActiveTab("images")}
                                className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            >
                                Próximo: Imagens
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="images">
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                        <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Imagens
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Adicione fotos do veículo (até 10 imagens)
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6">
                            <FileUpload
                            value={files.map((file) => URL.createObjectURL(file))}
                            onChange={handleFileChange}
                            onRemove={(url) => {
                                setFiles(files.filter((file) => URL.createObjectURL(file) !== url))
                            }}
                            maxFiles={10}
                            accept={acceptedFileTypes}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                            Formatos aceitos: JPEG, PNG, WEBP. A primeira imagem será a principal.
                            </p>
                            {files.length > 0 && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-black dark:text-white mr-2" />
                                {files.length} {files.length === 1 ? "imagem adicionada" : "imagens adicionadas"}
                            </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:flex-row justify-between">
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("basic")}
                            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                            >
                            Voltar: Informações Básicas
                            </Button>
                            <Button
                            type="button"
                            onClick={() => setActiveTab("technical")}
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            >
                            Próximo: Detalhes Técnicos
                            </Button>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="technical">
                    <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                    <motion.div variants={fadeIn}>
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 h-full">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Detalhes Técnicos
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                            Especificações do veículo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="quilometragem"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Quilometragem*</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tipoCombustivel"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Tipo de Combustível*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione o combustível" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(FuelType).map((fuel) => (
                                        <SelectItem key={fuel} value={fuel}>
                                            {getFuelTypeLabel(fuel)}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="cambio"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Câmbio*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione o câmbio" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(TransmissionType).map((transmission) => (
                                        <SelectItem key={transmission} value={transmission}>
                                            {getTransmissionTypeLabel(transmission)}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carroceria"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Carroceria*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione a carroceria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(BodyType).map((body) => (
                                        <SelectItem key={body} value={body}>
                                            {getBodyTypeLabel(body)}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="cor"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Cor*</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Ex: Preto, Branco, Vermelho..."
                                        {...field}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="portas"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Portas*</FormLabel>
                                    <Select
                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                    defaultValue={field.value.toString()}
                                    >
                                    <FormControl>
                                        <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione o número de portas" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {[2, 3, 4, 5].map((doors) => (
                                        <SelectItem key={doors} value={doors.toString()}>
                                            {doors} portas
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="potencia"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Potência (cv)</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) =>
                                        field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)
                                        }
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="motor"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Motor (opcional)</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Ex: 2.0 Turbo, V8 5.0..."
                                        {...field}
                                        className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                    />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                                )}
                            />
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 h-full">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Tag className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Categorização
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                            Classificação do veículo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                            control={form.control}
                            name="categoria"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Categoria*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione a categoria" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {Object.values(VehicleCategory).map((category) => (
                                        <SelectItem key={category} value={category}>
                                        {getCategoryLabel(category)}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="classe"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Classe*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione a classe" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {Object.values(VehicleClass).map((classe) => (
                                        <SelectItem key={classe} value={classe}>
                                        {getClassLabel(classe)}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="finalPlaca"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                    Final da Placa (opcional)
                                </FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value ? Number.parseInt(value) : undefined)}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                                        <SelectValue placeholder="Selecione o final" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="default">Não informado</SelectItem>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                        Final {num}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                            />

                            <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setActiveTab("images")}
                                className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                            >
                                Voltar: Imagens
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setActiveTab("additional")}
                                className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            >
                                Próximo: Opções Adicionais
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="additional">
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                        <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Opções Adicionais
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Configurações extras para o anúncio
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                            control={form.control}
                            name="destaque"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-gray-900 dark:text-gray-100">Destaque</FormLabel>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Destacar este veículo nos resultados de busca
                                    </p>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-black data-[state=checked]:dark:bg-white"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="seloOriginal"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-gray-900 dark:text-gray-100">Selo Original</FormLabel>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Veículo possui todas as peças originais
                                    </p>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-black data-[state=checked]:dark:bg-white"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="aceitaTroca"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-gray-900 dark:text-gray-100">Aceita Troca</FormLabel>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Disponível para troca por outro veículo
                                    </p>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-black data-[state=checked]:dark:bg-white"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="parcelamento"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Parcelamento (opcional)</FormLabel>
                                <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    max="60"
                                    placeholder="Número máximo de parcelas"
                                    {...field}
                                    onChange={(e) =>
                                    field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)
                                    }
                                    className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                                />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                            </FormItem>
                            )}
                        />

                        <div className="flex justify-between mt-8">
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("technical")}
                            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                            >
                            Voltar: Detalhes Técnicos
                            </Button>
                            <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                            >
                            {isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                                </>
                            ) : (
                                "Salvar Veículo"
                            )}
                            </Button>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                </TabsContent>
                </Tabs>
            </form>
            </Form>
        </div>
        </div>
    )
}

export default CreateVehiclePage
