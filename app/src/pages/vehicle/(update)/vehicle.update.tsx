import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useVehicle from "~/src/hooks/useVehicle"
import { FileUpload } from "~/src/_components/common/_file/file"
import {
  Loader2,
  Trash2,
  ChevronLeft,
  Car,
  ImageIcon,
  Settings,
  Tag,
  Plus,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
} from "lucide-react"
import { Switch } from "~/components/ui/switch"
import type { Accept } from "react-dropzone"
import type { VehicleFormValues } from "../(create)/vehicle.create"
import { vehicleFormSchema } from "../(create)/vehicle.create"
import type { UseFormReturn } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog"

import type { VehicleImage } from "~/src/types/vehicle"


import { FuelType, TransmissionType, BodyType, VehicleCategory, VehicleClass } from "../(create)/vehicle.create"

const acceptedFileTypes: Accept = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
}

type FormImage = VehicleImage | File // Tipo união para imagens existentes ou novas

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

export function EditVehiclePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    currentVehicle,
    fetchVehicleById,
    updateVehicle,
    uploadVehicleImages,
    deleteVehicleImage,
    loading,
    error: apiError,
  } = useVehicle()
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formProgress, setFormProgress] = useState(25)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  const loadVehicleData = useCallback(() => {
    if (id && !isDataLoaded) {
      fetchVehicleById(id)
      setIsDataLoaded(true)
    }
  }, [id, fetchVehicleById, isDataLoaded])

  // Carrega os dados do veículo
  useEffect(() => {
    loadVehicleData()
  }, [loadVehicleData])

  // Preenche o formulário quando os dados são carregados
  useEffect(() => {
    if (currentVehicle) {
      // Reset com o objeto completo do veículo, exceto imagens que são tratadas separadamente
      form.reset({
        marca: currentVehicle.marca,
        modelo: currentVehicle.modelo,
        anoFabricacao: currentVehicle.anoFabricacao,
        anoModelo: currentVehicle.anoModelo,
        preco: currentVehicle.preco,
        precoPromocional: currentVehicle.precoPromocional || undefined,
        descricao: currentVehicle.descricao || "",
        quilometragem: currentVehicle.quilometragem,
        tipoCombustivel: currentVehicle.tipoCombustivel,
        cambio: currentVehicle.cambio,
        cor: currentVehicle.cor,
        portas: currentVehicle.portas,
        finalPlaca: currentVehicle.finalPlaca || undefined,
        carroceria: currentVehicle.carroceria,
        potencia: currentVehicle.potencia || undefined,
        motor: currentVehicle.motor || "",
        categoria: currentVehicle.categoria,
        classe: currentVehicle.classe,
        destaque: currentVehicle.destaque || false,
        seloOriginal: currentVehicle.seloOriginal || false,
        aceitaTroca: currentVehicle.aceitaTroca || false,
        parcelamento: currentVehicle.parcelamento || undefined,
      })

      // Atualiza o estado das imagens existentes apenas se houver mudança
      if (currentVehicle.imagens?.length !== existingImages.length) {
        setExistingImages(currentVehicle.imagens || [])
      }
    }
  }, [currentVehicle, form])

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
    if (existingImages.length > 0 || files.length > 0) {
      completedFields++
    }
    totalFields++

    const progress = Math.round((completedFields / totalFields) * 100)
    setFormProgress(progress)
  }, [form, files, existingImages])

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  const handleRemoveExistingImage = async (imageId: string) => {
    if (!id) return

    try {
      await deleteVehicleImage(id, imageId)
      setExistingImages(existingImages.filter((img) => img.id !== imageId))
    } catch (error) {
      console.error("Erro ao remover imagem:", error)
      setFormError("Erro ao remover imagem. Por favor, tente novamente.")
    }
  }

  const onSubmit = async (data: VehicleFormValues) => {
    if (!id) return

    try {
      setIsSubmitting(true)
      setFormError(null)
      setFormSuccess(null)

      // 1. Atualizar dados básicos (sem imagens)
      const { imagens, ...vehicleData } = data
      await updateVehicle({ id, data: vehicleData })

      // 2. Upload de novas imagens (apenas Files)
      const newImages = files.filter((file) => file instanceof File)
      if (newImages.length > 0) {
        await uploadVehicleImages(id, newImages)
      }

      // 3. Verificar imagens removidas
      const currentImageIds = currentVehicle?.imagens?.map((img) => img.id) || []
      const remainingImageIds = existingImages.map((img) => img.id)
      const imagesToRemove = currentImageIds.filter((id) => !remainingImageIds.includes(id))

      await Promise.all(imagesToRemove.map((imageId) => deleteVehicleImage(id, imageId)))

      setFormSuccess("Veículo atualizado com sucesso!")
      setTimeout(() => {
        navigate(`/vehicles/${id}`)
      }, 1500)
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error)
      setFormError("Ocorreu um erro ao atualizar o veículo. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleCancel = () => {
    if (form.formState.isDirty || files.length > 0) {
      setConfirmCancel(true)
    } else {
      navigate(`/vehicles/${id}`)
    }
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

  if (loading && !currentVehicle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Carregando informações do veículo...</p>
        </div>
      </div>
    )
  }

  if (!currentVehicle && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <div className="text-gray-900 dark:text-gray-100 mb-4 text-lg">Veículo não encontrado</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            O veículo que você está procurando não está disponível ou foi removido.
          </p>
          <Button onClick={() => navigate("/vehicles")} className="bg-black text-white dark:bg-white dark:text-black">
            <ChevronLeft size={16} className="mr-2" /> Voltar para a listagem
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleCancel}
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
                className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
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
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-2">Editar Veículo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atualize os detalhes do veículo{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentVehicle?.marca} {currentVehicle?.modelo}
            </span>
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
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg mb-6">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md flex items-center gap-2"
                >
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Informações Básicas</span>
                  <span className="sm:hidden">Básico</span>
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Imagens</span>
                  <span className="sm:hidden">Fotos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Detalhes Técnicos</span>
                  <span className="sm:hidden">Técnico</span>
                </TabsTrigger>
                <TabsTrigger
                  value="additional"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md flex items-center gap-2"
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
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                          >
                            Próximo: Imagens
                            <ArrowRight className="h-4 w-4" />
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
                        Gerencie as imagens do veículo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Imagens existentes */}
                      {existingImages.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Imagens atuais</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {existingImages.map((img) => (
                              <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative group"
                              >
                                <div
                                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 cursor-pointer transition-transform hover:scale-[1.02]"
                                  onClick={() => setPreviewImage(img.url)}
                                >
                                  <img
                                    src={img.url || "/placeholder.svg"}
                                    alt={`Imagem ${img.ordem || ""}`}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-300" />
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveExistingImage(img.id)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Remover imagem</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {img.isMain && (
                                  <Badge className="absolute bottom-2 left-2 bg-black text-white dark:bg-white dark:text-black border-0">
                                    Principal
                                  </Badge>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload de novas imagens */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                          Adicionar novas imagens
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6">
                          <FileUpload
                            value={files.map((file) => URL.createObjectURL(file))}
                            onChange={handleFileChange}
                            onRemove={(url) => {
                              setFiles(files.filter((file) => URL.createObjectURL(file) !== url))
                            }}
                            maxFiles={10 - existingImages.length}
                            accept={acceptedFileTypes}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                            Formatos aceitos: JPEG, PNG, WEBP. Você pode adicionar até {10 - existingImages.length}{" "}
                            imagens adicionais.
                          </p>
                          {files.length > 0 && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-black dark:text-white mr-2" />
                              {files.length}{" "}
                              {files.length === 1 ? "nova imagem adicionada" : "novas imagens adicionadas"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:flex-row justify-between mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("basic")}
                          className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Voltar: Informações Básicas
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setActiveTab("technical")}
                          className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                        >
                          Próximo: Detalhes Técnicos
                          <ArrowRight className="h-4 w-4" />
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
                            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 gap-2"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar: Imagens
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setActiveTab("additional")}
                            className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                          >
                            Próximo: Opções Adicionais
                            <ArrowRight className="h-4 w-4" />
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
                          className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Voltar: Detalhes Técnicos
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Salvar Alterações
                            </>
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

      {/* Diálogo de confirmação para cancelar */}
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent className="bg-white dark:bg-gray-900 border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Descartar alterações?</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Você tem alterações não salvas. Tem certeza que deseja sair sem salvar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmCancel(false)}
              className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Continuar editando
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate(`/vehicles/${id}`)}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Descartar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visualizador de imagem */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="bg-transparent border-0 shadow-none max-w-4xl">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
            >
              <X className="h-5 w-5" />
            </Button>
            {previewImage && (
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Visualização da imagem"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
