import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CategoryGrid } from "~/src/_components/_page/_vehicle/_grid/grid"
import { VehicleFilters } from "~/src/_components/_page/_vehicle/_filter/filter"
import { VehicleCard, VehicleCardSkeleton } from "~/src/_components/_page/_vehicle/_card/card"
import useVehicle from "~/src/hooks/useVehicle"
import { Button } from "~/components/ui/button"
import { Filter, X, ChevronUp, ArrowRight, Search } from "lucide-react"
import { usePersistentFilters } from "~/src/hooks/usePersitFilters"
import type { Vehicle, VehicleSearchParams } from "~/src/types/vehicle"
import { Badge } from "~/components/ui/badge"

export const VehiclesByCategoryPage = () => {
  const location = useLocation()
  const [filters, setFilters] = usePersistentFilters<VehicleSearchParams>({})
  const [showFilters, setShowFilters] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const { vehicles, loading, error, fetchVehicles, addFavorite, removeFavorite, fetchUserFavorites, favorites } =
    useVehicle()

  // Update search when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  // Clear localStorage if not coming from category grid
  useEffect(() => {
    if (!location.state?.fromCategoryGrid) {
      localStorage.removeItem("vehicleFilters")
    }
  }, [location.key])

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFilterChange = (field: keyof VehicleSearchParams, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "All" ? undefined : value,
    }))

    // Scroll to results after filter change
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const resetFilters = () => {
    setFilters({})
    setShowFilters(false)
  }

  const toggleFavorite = async (vehicle: Vehicle) => {
    if (favorites.some((v) => v.id === vehicle.id)) {
      await removeFavorite(vehicle.id)
    } else {
      await addFavorite(vehicle.id)
    }
    fetchUserFavorites()
  }

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof VehicleSearchParams] !== undefined,
  ).length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Show category grid only if no category filter is active */}
      {!filters.categoria && <CategoryGrid />}

      <div
        ref={resultsRef}
        className={`sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "py-4 shadow-sm" : "py-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <h1 className="text-2xl font-extralight tracking-tight text-gray-900 dark:text-gray-100">
                {filters.categoria
                  ? `VEÍCULOS ${getCategoryName(filters.categoria).toUpperCase()}`
                  : "TODOS OS VEÍCULOS"}
              </h1>
              {vehicles.length > 0 && !loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {vehicles.length} {vehicles.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                </p>
              )}
            </motion.div>

            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    Limpar filtros
                  </Button>
                </motion.div>
              )}

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
              >
                {showFilters ? <X size={16} /> : <Filter size={16} />}
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden mb-8"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-100 dark:border-gray-800 rounded-none bg-white dark:bg-gray-900 p-6 mt-4"
              >
                <VehicleFilters searchParams={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setShowFilters(false)}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-gray-200 dark:border-gray-800"
                  >
                    <ChevronUp size={16} />
                    <span>Fechar filtros</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle listing */}
        <div className="py-8">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border border-gray-100 dark:border-gray-800 rounded-none"
            >
              <div className="max-w-md mx-auto">
                <p className="text-red-500 dark:text-red-400 mb-4">Não foi possível carregar os veículos</p>
                <Button
                  onClick={() => fetchVehicles(filters)}
                  className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                >
                  Tentar novamente
                </Button>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    isFavorite={favorites.some((v) => v.id === vehicle.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border border-gray-100 dark:border-gray-800 rounded-none"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">Nenhum veículo encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Não encontramos veículos que correspondam aos seus critérios de busca.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-4 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  Limpar filtros
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Show more button */}
        {vehicles.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center my-8"
          >
            <Button
              variant="outline"
              className="group border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 gap-2"
            >
              <span>Ver mais veículos</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Helper for category names
const getCategoryName = (id: string) => {
  const map: Record<string, string> = {
    SUV: "SUV",
    SPORTS_CAR: "Esportivos",
    PICKUP_4X4: "Picapes",
    HOT_HATCH: "Hot Hatches",
    ELECTRIC: "Elétricos",
    CLASSIC: "Clássicos",
    RETRO_SUPER: "Retro Super",
  }
  return map[id] || id
}
