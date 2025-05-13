import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  SunIcon,
  Trophy,
  Truck,
  Zap,
  Car,
  RocketIcon,
  Rocket,
  Flame,
  Key,
  Mountain,
  Disc,
  Eye,
  Wrench,
  Flashlight,
} from "lucide-react";
import { useIsMobile } from "~/src/hooks/use-mobile";

const categories = [
  {
    id: "SUV",
    name: "SUVs Incríveis",
    icon: <SunIcon size={24} />,
    description: "Veículos utilitários esportivos com robustez e conforto.",
  },
  {
    id: "SPORTS_CAR",
    name: "Máquinas de Velocidade",
    icon: <Trophy size={24} />,
    description:
      "Carros de alto desempenho projetados para velocidade extrema.",
  },
  {
    id: "DRIFT_CAR",
    name: "Drift Machines",
    icon: <Car size={24} />,
    description: "Carros japoneses icônicos, feitos para derrapar nas curvas.",
  },
  {
    id: "HYPERCAR",
    name: "Hiper Máquinas",
    icon: <Rocket size={24} />,
    description: "Supercarros ultra rápidos com tecnologia de ponta.",
  },
  {
    id: "RETRO_SUPER",
    name: "Super Clássicos",
    icon: <Car size={24} />,
    description: "Carros clássicos com potência e design vintage.",
  },
  {
    id: "SUPERCAR",
    name: "Supercarros",
    icon: <Flashlight size={24} />,
    description: "Potência extrema com visual impressionante.",
  },
  {
    id: "CLASSIC_MUSCLE",
    name: "Muscle Clássico",
    icon: <Flame size={24} />,
    description: "Muscle cars históricos com motores potentes.",
  },
  {
    id: "MODERN_MUSCLE",
    name: "Muscle Moderno",
    icon: <RocketIcon size={24} />,
    description: "Modelos contemporâneos que mantêm a essência Muscle.",
  },
  {
    id: "TRACK_TOY",
    name: "Brinquedos de Pista",
    icon: <Disc size={24} />,
    description: "Veículos projetados para velocidade e diversão nas pistas.",
  },
  {
    id: "OFFROAD",
    name: "Aventureiros",
    icon: <Mountain size={24} />,
    description: "Veículos preparados para trilhas e terrenos acidentados.",
  },
  {
    id: "BUGGY",
    name: "Buggy Radical",
    icon: <Truck size={24} />,
    description: "Leves, ágeis e perfeitos para terrenos arenosos.",
  },
  {
    id: "PICKUP_4X4",
    name: "Potência 4x4",
    icon: <Truck size={24} />,
    description: "Caminhonetes robustas para qualquer tipo de terreno.",
  },
  {
    id: "HOT_HATCH",
    name: "Hot Hatches",
    icon: <Zap size={24} />,
    description: "Compactos rápidos com espírito esportivo.",
  },
  {
    id: "SALON",
    name: "Sedans de Luxo",
    icon: <Car size={24} />,
    description: "Conforto e elegância com desempenho sofisticado.",
  },
  {
    id: "GT",
    name: "Gran Turismo",
    icon: <Key size={24} />,
    description: "Carros de longa distância com estilo e desempenho.",
  },
  {
    id: "RALLY",
    name: "Rally Beasts",
    icon: <Wrench size={24} />,
    description: "Projetados para resistir a terrenos adversos.",
  },
  {
    id: "CONCEPT",
    name: "Conceitos Futuristas",
    icon: <Eye size={24} />,
    description: "Protótipos que mostram o futuro da indústria automotiva.",
  },
];

export const CategoryGrid = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // For touch interactions
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleCategoryClick = (categoryId: string) => {
    if (isDragging) return;

    navigate(
      {
        pathname: "/vehicles/category",
        search: `?categoria=${categoryId}`,
      },
      {
        replace: true,
        state: { fromCategoryGrid: true },
      }
    );
  };

  const nextCategory = () => {
    if (activeIndex < categories.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const prevCategory = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(categories.length - 1);
    }
  };

  // Update carousel position when activeIndex changes
  useEffect(() => {
    if (carouselRef.current && isMobile) {
      const scrollAmount =
        activeIndex * (carouselRef.current.scrollWidth / categories.length);
      controls.start({
        x: -scrollAmount,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  }, [activeIndex, controls, isMobile]);

  // Handle touch interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;
    setDragDistance(distance);

    // Update the carousel position during drag
    if (carouselRef.current) {
      const basePosition =
        activeIndex * (carouselRef.current.scrollWidth / categories.length);
      x.set(-basePosition + distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Determine if we should navigate to the next/previous category
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        prevCategory();
      } else {
        nextCategory();
      }
    } else {
      // Reset to current position if the drag wasn't far enough
      if (carouselRef.current) {
        const scrollAmount =
          activeIndex * (carouselRef.current.scrollWidth / categories.length);
        controls.start({
          x: -scrollAmount,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
      }
    }

    setDragDistance(0);
  };

  return (
    <section className="container mx-auto px-4 py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-gray-100 mb-3"
        >
          NAVEGUE POR CATEGORIAS
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40px" }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-0.5 bg-black dark:bg-white mx-auto"
        />
      </motion.div>

      {isMobile ? (
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              ref={carouselRef}
              className="flex"
              animate={controls}
              style={{ x }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className="min-w-[80%] sm:min-w-[40%] px-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: activeIndex === index ? 1 : 0.9,
                    y: activeIndex === index ? 0 : 10,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden border border-gray-200 dark:border-gray-800 p-8 cursor-pointer transition-all duration-300 h-full bg-white dark:bg-gray-900 ${
                      activeIndex === index
                        ? "shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.04)]"
                        : ""
                    }`}
                    onClick={() =>
                      !isDragging && handleCategoryClick(category.id)
                    }
                  >
                    <div className="flex flex-col items-center gap-5 relative z-10">
                      <motion.div
                        animate={{
                          scale: activeIndex === index ? 1.1 : 1,
                          rotateY: activeIndex === index ? [0, 10, 0] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat:
                            activeIndex === index
                              ? Number.POSITIVE_INFINITY
                              : 0,
                          repeatType: "reverse",
                          repeatDelay: 2,
                        }}
                        className={`p-4 rounded-full border border-gray-200 dark:border-gray-800 transition-colors duration-300 ${
                          activeIndex === index
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {category.icon}
                      </motion.div>
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 transition-colors">
                          {category.name}
                        </h3>
                        <AnimatePresence>
                          {activeIndex === index && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2"
                            >
                              {category.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-black dark:bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: activeIndex === index ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Carousel navigation
                <div className="flex justify-center mt-6 gap-2">
                    <button
                    onClick={prevCategory}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label="Categoria anterior"
                    >
                    <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-1.5">
                    {categories.map((_, index) => (
                        <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            activeIndex === index ? "bg-black dark:bg-white w-4" : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        aria-label={`Ir para categoria ${index + 1}`}
                        />
                    ))}
                    </div>
                    <button
                    onClick={nextCategory}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label="Próxima categoria"
                    >
                    <ChevronRight size={16} />
                    </button>
                </div>
            */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4"
          >
            Deslize para navegar entre as categorias
          </motion.p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 rounded-none p-8 cursor-pointer transition-all duration-300 h-full bg-white dark:bg-gray-900 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)]"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex flex-col items-center gap-5 relative z-10">
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="p-4 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300"
                  >
                    {category.icon}
                  </motion.div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <AnimatePresence>
                      {hoveredCategory === category.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                          >
                            <span className="mr-1">Ver veículos</span>
                            <ArrowRight size={12} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-black dark:bg-white"
                  initial={{ width: 0 }}
                  animate={{
                    width: hoveredCategory === category.id ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Botão para Navegar para a Página de Vehiculos
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-10 text-center"
        >
            <button
            onClick={() => navigate("/vehicles")}
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
            <span>Ver todos os veículos</span>
            <motion.span
                initial={{ x: 0 }}
                animate={{ x: 5 }}
                transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 0.8,
                }}
                className="ml-2 group-hover:translate-x-1 transition-transform"
            >
                <ArrowRight size={16} />
            </motion.span>
            </button>
        </motion.div> */}
    </section>
  );
};
