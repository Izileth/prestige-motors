import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Slider } from "~/components/ui/slider"
import { Badge } from "~/components/ui/badge"
import { Heart, ChevronRight, Filter, Zap, ShieldCheck, Calendar, Gauge, MapPin, X, Search } from "lucide-react"
import useVehicle from "~/src/hooks/useVehicle"
import type { Vehicle } from "~/src/store/slices/vehicle"
import type { VehicleSearchParams } from "~/src/services/vehicle"
import { motion, AnimatePresence } from "framer-motion"

const VehicleListingPage = () => {
  const {
    vehicles,
    loading,
    error,
    fetchVehicles,
    fetchFeaturedVehicles,
    addFavorite,
    removeFavorite,
    fetchUserFavorites,
    favorites,
  } = useVehicle()

  const [searchParams, setSearchParams] = useState<VehicleSearchParams>({})
  const [showFilters, setShowFilters] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(searchParams)
    }, 500)

    fetchUserFavorites()

    return () => clearTimeout(timer)
  }, [searchParams])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node) && showFilters) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilters])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, modelo: e.target.value })
  }

  const handlePriceChange = (value: number[]) => {
    setSearchParams({
      ...searchParams,
      precoMin: value[0],
      precoMax: value[1],
    })
  }

  const isFavorite = (vehicleId: string) => {
    return Array.isArray(favorites) && favorites.some((v) => v.id === vehicleId)
  }

  const toggleFavorite = async (vehicle: Vehicle) => {
    try {
      if (isFavorite(vehicle.id)) {
        await removeFavorite(vehicle.id)
      } else {
        await addFavorite(vehicle.id)
      }
      await fetchUserFavorites()
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div
        className={`sticky top-0 z-10 bg-white dark:bg-gray-950 transition-all duration-300 ${
          scrolled ? "shadow-md py-3" : "py-6"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={18}
                />
                <Input
                  placeholder="Buscar por modelo..."
                  value={searchParams.modelo || ""}
                  onChange={handleSearchChange}
                  className="w-full pl-10 border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-400 transition-all"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all ${
                showFilters ? "bg-gray-100 dark:bg-gray-900" : ""
              }`}
            >
              <Filter size={16} />
              Filtros
              {showFilters && <X size={16} className="ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            ref={filtersRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8 border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-gray-100">Filtrar veículos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Preço</label>
                  <Slider
                    defaultValue={[searchParams.precoMin || 0, searchParams.precoMax || 500000]}
                    max={500000}
                    step={1000}
                    onValueChange={handlePriceChange}
                    className="my-6"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatPrice(searchParams.precoMin || 0)}</span>
                    <span>{formatPrice(searchParams.precoMax || 500000)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Combustível</label>
                  <Select
                    value={searchParams.combustivel || ""}
                    onValueChange={(value) => setSearchParams({ ...searchParams, combustivel: value })}
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todos</SelectItem>
                      <SelectItem value="GASOLINA">Gasolina</SelectItem>
                      <SelectItem value="ETANOL">Etanol</SelectItem>
                      <SelectItem value="FLEX">Flex</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="ELETRICO">Elétrico</SelectItem>
                      <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                      <SelectItem value="GNV">GNV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Câmbio</label>
                  <Select
                    value={searchParams.cambio || ""}
                    onValueChange={(value) => setSearchParams({ ...searchParams, cambio: value })}
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todos</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="AUTOMATICO">Automático</SelectItem>
                      <SelectItem value="SEMI_AUTOMATICO">Semi-automático</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoria</label>
                  <Select
                    value={searchParams.categoria || ""}
                    onValueChange={(value) => setSearchParams({ ...searchParams, categoria: value })}
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-400">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todos</SelectItem>
                      <SelectItem value="HYPERCAR">Hypercar</SelectItem>
                      <SelectItem value="SUPERCAR">Supercar</SelectItem>
                      <SelectItem value="SPORTS_CAR">Sports Car</SelectItem>
                      <SelectItem value="CLASSIC_MUSCLE">Classic Muscle</SelectItem>
                      <SelectItem value="MODERN_MUSCLE">Modern Muscle</SelectItem>
                      <SelectItem value="GT">GT</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="PICKUP_4X4">Pickup 4x4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-medium mb-2 text-gray-900 dark:text-gray-100"
          >
            Encontre o veículo perfeito
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Explore nossa seleção de veículos premium e encontre o que melhor se adapta às suas necessidades.
          </motion.p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="text-red-500 mb-2">Erro ao carregar veículos</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {Array.isArray(vehicles) &&
                vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                      <div className="relative overflow-hidden group">
                        {vehicle.imagens && vehicle.imagens.length > 0 ? (
                          <div className="overflow-hidden">
                            <img
                              src={vehicle.imagens.find((img) => img.isMain)?.url || vehicle.imagens[0].url}
                              alt={`${vehicle.marca} ${vehicle.modelo}`}
                              className="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">Sem imagem disponível</span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 flex gap-2">
                          {vehicle.destaque && (
                            <Badge
                              variant="default"
                              className="bg-black text-white dark:bg-white dark:text-black border-0 flex items-center gap-1 shadow-md"
                            >
                              <Zap size={14} /> Destaque
                            </Badge>
                          )}
                          {vehicle.seloOriginal && (
                            <Badge
                              variant="secondary"
                              className="bg-white text-black dark:bg-black dark:text-white flex items-center gap-1 shadow-md"
                            >
                              <ShieldCheck size={14} /> Original
                            </Badge>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black shadow-sm transition-transform duration-300 transform group-hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(vehicle)
                          }}
                          aria-label={isFavorite(vehicle.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <Heart
                            size={18}
                            className={
                              isFavorite(vehicle.id)
                                ? "fill-black text-black dark:fill-white dark:text-white"
                                : "text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors"
                            }
                          />
                        </Button>
                      </div>

                      <CardContent className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg line-clamp-1 text-gray-900 dark:text-gray-100">
                              {vehicle.marca} {vehicle.modelo}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <Calendar size={14} className="opacity-70" />
                              {vehicle.anoFabricacao}/{vehicle.anoModelo} •
                              <Gauge size={14} className="opacity-70 ml-1" />
                              {vehicle.quilometragem.toLocaleString("pt-BR")} km
                            </p>
                          </div>

                          {vehicle.vendedor && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <MapPin size={14} className="opacity-70" />
                              <span>{vehicle.vendedor.id || "Localização"}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {getFuelType(vehicle.tipoCombustivel)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {getTransmissionType(vehicle.cambio)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {vehicle.portas} portas
                          </Badge>
                          {vehicle.potencia && (
                            <Badge
                              variant="outline"
                              className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {vehicle.potencia} cv
                            </Badge>
                          )}
                        </div>

                        <div className="mt-2">
                          <p className="text-xl font-medium text-gray-900 dark:text-white">
                            {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                          </p>
                          {vehicle.precoPromocional && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                                {formatPrice(vehicle.preco)}
                              </p>
                              <Badge
                                variant="destructive"
                                className="bg-black text-white dark:bg-white dark:text-black border-0 text-xs"
                              >
                                {Math.round((1 - vehicle.precoPromocional / vehicle.preco) * 100)}% OFF
                              </Badge>
                            </div>
                          )}
                          {vehicle.parcelamento && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ou {vehicle.parcelamento}x de{" "}
                              {formatPrice((vehicle.precoPromocional || vehicle.preco) / vehicle.parcelamento)}
                            </p>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0">
                        <Button
                          variant="default"
                          className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all duration-300 group"
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        >
                          Ver detalhes
                          <ChevronRight
                            size={16}
                            className="ml-1 opacity-80 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>

            {vehicles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">Nenhum veículo encontrado</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar seus filtros de busca ou volte mais tarde.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default VehicleListingPage
