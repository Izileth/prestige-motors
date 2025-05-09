import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Textarea } from "~/components/ui/textarea"
import {
  Heart,
  Star,
  ChevronLeft,
  Share2,
  Phone,
  MessageSquare,
  MapPin,
  Loader2,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Palette,
  DoorOpen,
  FuelIcon as Engine,
  Zap,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"
import useVehicle from "~/src/hooks/useVehicle"
import type { ReviewCreateInput } from "~/src/services/vehicle"
import { motion, AnimatePresence } from "framer-motion"

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    currentVehicle,
    favorites,
    loading,
    error,
    fetchVehicleById,
    createReview,
    addFavorite,
    removeFavorite,
    fetchUserFavorites,
  } = useVehicle()

  const [activeImage, setActiveImage] = useState<number>(0)
  const [newReview, setNewReview] = useState<ReviewCreateInput>({
    rating: 5,
    comentario: "",
  })
  const [isPostingReview, setIsPostingReview] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!id) return

    let isMounted = true

    const loadData = async () => {
      try {
        await fetchVehicleById(id)
        if (isMounted) await fetchUserFavorites()
      } catch (error) {
        if (isMounted) console.error("Failed to load vehicle data:", error)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isFavorite = (vehicleId: string) => {
    return Array.isArray(favorites) && favorites.some((v) => v.id === vehicleId)
  }

  const toggleFavorite = async () => {
    if (!currentVehicle) return

    try {
      if (isFavorite(currentVehicle.id)) {
        await removeFavorite(currentVehicle.id)
      } else {
        await addFavorite(currentVehicle.id)
      }
      await fetchUserFavorites()
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setIsPostingReview(true)

      await createReview(id, newReview)
      setNewReview({ rating: 5, comentario: "" })

      navigate(`/vehicles/${id}`, {
        state: { activeTab: "reviews" },
        replace: true,
      })

      window.location.reload()
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
      alert("Não foi possível enviar sua avaliação")
    } finally {
      setIsPostingReview(false)
    }
  }

  const handleShare = async () => {
    if (!currentVehicle) return

    const shareUrl = window.location.href

    const mainImage =
      currentVehicle.imagens?.find((img) => img.isMain)?.url ||
      (currentVehicle.imagens?.length > 0 ? currentVehicle.imagens[0].url : null)

    const shareTitle = `${currentVehicle.marca} ${currentVehicle.modelo} (${currentVehicle.anoFabricacao}/${currentVehicle.anoModelo})`
    const shareText = `Confira este ${currentVehicle.marca} ${currentVehicle.modelo}! ${formatPrice(
      currentVehicle.precoPromocional || currentVehicle.preco,
    )}`

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log("Conteúdo compartilhado com sucesso")
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        alert("Link copiado para a área de transferência!")
      } catch (error) {
        console.error("Falha ao copiar o link:", error)
        prompt("Copie o link para compartilhar:", shareUrl)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getFuelType = (type: string) => {
    const fuelTypes: Record<string, string> = {
      GASOLINA: "Gasolina",
      ETANOL: "Etanol",
      FLEX: "Flex",
      DIESEL: "Diesel",
      ELETRICO: "Elétrico",
      HIBRIDO: "Híbrido",
      GNV: "GNV",
    }
    return fuelTypes[type] || type
  }

  const getTransmissionType = (type: string) => {
    const transmissionTypes: Record<string, string> = {
      MANUAL: "Manual",
      AUTOMATICO: "Automático",
      SEMI_AUTOMATICO: "Semi-automático",
      CVT: "CVT",
    }
    return transmissionTypes[type] || type
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Carregando informações do veículo...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <div className="text-red-500 mb-4 text-lg">Erro ao carregar o veículo</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft size={16} className="mr-2" /> Voltar
          </Button>
        </div>
      </div>
    )

  if (!currentVehicle)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <div className="text-gray-900 dark:text-gray-100 mb-4 text-lg">Veículo não encontrado</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            O veículo que você está procurando não está disponível ou foi removido.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft size={16} className="mr-2" /> Voltar para a listagem
          </Button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <div
        className={`sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "shadow-sm py-3" : "py-6"
        }`}
      >
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
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    isFavorite(currentVehicle.id)
                      ? "fill-black text-black dark:fill-white dark:text-white"
                      : "text-gray-500"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <Share2 size={20} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            {currentVehicle.marca} {currentVehicle.modelo}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>
                {currentVehicle.anoFabricacao}/{currentVehicle.anoModelo}
              </span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <div className="flex items-center gap-1">
              <Gauge size={16} />
              <span>{currentVehicle?.quilometragem?.toLocaleString("pt-BR")} km</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <div className="flex items-center gap-1">
              <Fuel size={16} />
              <span>{getFuelType(currentVehicle.tipoCombustivel)}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <div className="flex items-center gap-1">
              <Cog size={16} />
              <span>{getTransmissionType(currentVehicle.cambio)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Galeria de imagens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              {currentVehicle.imagens && currentVehicle.imagens.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[16/9]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={currentVehicle.imagens[activeImage].url}
                        alt={`${currentVehicle.marca} ${currentVehicle.modelo}`}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {currentVehicle.imagens.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-sm"
                          onClick={() =>
                            setActiveImage((prev) => (prev === 0 ? currentVehicle.imagens.length - 1 : prev - 1))
                          }
                        >
                          <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-sm"
                          onClick={() =>
                            setActiveImage((prev) => (prev === currentVehicle.imagens.length - 1 ? 0 : prev + 1))
                          }
                        >
                          <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
                        </Button>
                      </>
                    )}

                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {currentVehicle.destaque && (
                        <Badge
                          variant="default"
                          className="bg-black text-white dark:bg-white dark:text-black border-0 flex items-center gap-1 shadow-md"
                        >
                          <Zap size={14} /> Destaque
                        </Badge>
                      )}
                      {currentVehicle.seloOriginal && (
                        <Badge
                          variant="secondary"
                          className="bg-white text-black dark:bg-black dark:text-white flex items-center gap-1 shadow-md"
                        >
                          <ShieldCheck size={14} /> Original
                        </Badge>
                      )}
                    </div>
                  </div>

                  {currentVehicle.imagens.length > 1 && (
                    <div className="grid grid-cols-6 gap-2">
                      {currentVehicle.imagens.map((img, index) => (
                        <div
                          key={index}
                          className={`relative rounded-md overflow-hidden aspect-square cursor-pointer transition-all ${
                            activeImage === index ? "ring-2 ring-black dark:ring-white" : "opacity-70 hover:opacity-100"
                          }`}
                          onClick={() => setActiveImage(index)}
                        >
                          <img src={img.url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Sem imagens disponíveis</span>
                </div>
              )}
            </motion.div>

            {/* Informações detalhadas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="details" className="mb-8">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md"
                  >
                    Detalhes
                  </TabsTrigger>
                  <TabsTrigger
                    value="specs"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md"
                  >
                    Especificações
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-md"
                  >
                    Avaliações ({currentVehicle?.reviewStats?.totalReviews || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card className="mt-4 border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader className="font-medium text-lg text-gray-900 dark:text-gray-100">Descrição</CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {currentVehicle.descricao || "Nenhuma descrição fornecida."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="specs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                      <CardHeader className="font-medium text-lg text-gray-900 dark:text-gray-100">
                        Informações Gerais
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Ano</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.anoFabricacao}/{currentVehicle.anoModelo}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Gauge size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Quilometragem</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle?.quilometragem?.toLocaleString("pt-BR")} km
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Fuel size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Combustível</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {getFuelType(currentVehicle.tipoCombustivel)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Cog size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Câmbio</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {getTransmissionType(currentVehicle.cambio)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Palette size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Cor</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{currentVehicle.cor}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <DoorOpen size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Portas</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{currentVehicle.portas}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                      <CardHeader className="font-medium text-lg text-gray-900 dark:text-gray-100">Mecânica</CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Engine size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Motor</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.motor || "Não informado"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Zap size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Potência</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.potencia ? `${currentVehicle.potencia} cv` : "Não informado"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span>Carroceria</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.carroceria}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span>Categoria</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.categoria}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span>Classe</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{currentVehicle.classe}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <ShieldCheck size={18} className="text-gray-400 dark:text-gray-500" />
                            <span>Selo original</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {currentVehicle.seloOriginal ? "Sim" : "Não"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="mt-4 space-y-6">
                    {currentVehicle?.avaliacoes && currentVehicle.avaliacoes.length > 0 ? (
                      currentVehicle.avaliacoes.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardContent className="pt-6">
                              <div className="flex items-start md:items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                  {review.user.avatar ? (
                                    <img
                                      src={review.user.avatar || "/placeholder.svg"}
                                      alt={`${review.user.nome}`}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                      {review.user.nome.substring(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{review.user.nome}</h4>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(review.createdAt)?.toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        className={
                                          i < review.rating
                                            ? "fill-black text-black dark:fill-white dark:text-white"
                                            : "text-gray-300 dark:text-gray-700"
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {review.comentario && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                  {review.comentario}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma avaliação ainda.</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Seja o primeiro a avaliar este veículo.</p>
                      </div>
                    )}

                    <Card className="border-0 shadow-none bg-white dark:bg-gray-900">
                      <CardHeader className="font-medium text-lg text-gray-900 dark:text-gray-100">
                        Deixe sua avaliação
                      </CardHeader>
                      <CardContent className="rounded-none shadow-none">
                        <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-none shadow-none">
                          <div className="rounded-none">
                            <label className="block mb-2 font-light text-gray-700 dark:text-gray-300">Sua avaliação</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewReview({ ...newReview, rating: star })}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={12}
                                    className={
                                      star <= newReview.rating
                                        ? "fill-black text-black dark:fill-white dark:text-white"
                                        : "text-gray-300 dark:text-gray-700"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="comment" className="block mb-2 font-light text-gray-700 dark:text-gray-300">
                              Comentário (opcional)
                            </label>
                            <Textarea
                              id="comment"
                              value={newReview.comentario || ""}
                              onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                              placeholder="Conte sua experiência com este veículo..."
                              className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="mt-2 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all duration-300"
                            disabled={isPostingReview}
                          >
                            {isPostingReview ? (
                              <span className="flex items-center">
                                <Loader2 className="animate-spin mr-2" size={18} />
                                Enviando...
                              </span>
                            ) : (
                              "Enviar avaliação"
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar com preço e ações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="sticky top-24">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {formatPrice(currentVehicle.precoPromocional || currentVehicle.preco)}
                    </h2>
                    {currentVehicle.precoPromocional && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                          {formatPrice(currentVehicle.preco)}
                        </p>
                        <Badge
                          variant="destructive"
                          className="bg-black text-white dark:bg-white dark:text-black border-0 text-xs"
                        >
                          {Math.round((1 - currentVehicle.precoPromocional / currentVehicle.preco) * 100)}% OFF
                        </Badge>
                      </div>
                    )}
                    {currentVehicle.parcelamento && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ou {currentVehicle.parcelamento}x de{" "}
                        {formatPrice(
                          (currentVehicle.precoPromocional || currentVehicle.preco) / currentVehicle.parcelamento,
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all duration-300 h-12"
                      asChild
                    >
                      <a href={`tel:${currentVehicle.vendedor?.telefone || ""}`}>
                        <Phone size={18} className="mr-2" /> Entrar em contato
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 h-12"
                      asChild
                    >
                      <a href={`https://wa.me/55${currentVehicle.vendedor?.telefone?.replace(/\D/g, "") || ""}`}>
                        <MessageSquare size={18} className="mr-2" /> Enviar mensagem
                      </a>
                    </Button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Localização</h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={18} className="text-gray-400 dark:text-gray-500" />
                      <span>{currentVehicle.localizacaoId || "São Paulo, SP"}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Vendedor</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {currentVehicle.vendedor?.nome?.substring(0, 2).toUpperCase() || "VD"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {currentVehicle.vendedor?.nome || "Vendedor não informado"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Membro desde {new Date(currentVehicle.createdAt).getFullYear()}
                        </p>
                        {currentVehicle.vendedor?.telefone && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <Phone size={14} />
                            {currentVehicle.vendedor.telefone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailsPage
