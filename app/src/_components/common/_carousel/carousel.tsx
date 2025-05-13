import { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/src/lib/cn";

type CarouselProps = {
  items: {
    id: string | number;
    image: string;
    title: string;
    description: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
};

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Carousel({
  items,
  autoPlay = true,
  interval = 5000,
  className,
}: CarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback(
    (newDirection: number) => {
      const newPage = page + newDirection;
      if (newPage < 0) {
        setPage([items.length - 1, newDirection]);
      } else if (newPage >= items.length) {
        setPage([0, newDirection]);
      } else {
        setPage([newPage, newDirection]);
      }
    },
    [page, items.length]
  );

  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setTimeout(() => {
      paginate(1);
    }, interval);

    return () => clearTimeout(timer);
  }, [page, autoPlay, interval, isPaused, paginate]);

  const currentItem = items[page];

  return (
    <div
      className={cn("relative overflow-hidden ", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="relative h-[500px] md:h-[600px] lg:h-[800px] overflow-hidden rounded-none">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img
                src={currentItem.image || "/placeholder.svg"}
                alt={currentItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-10 lg:items-start lg:pl-24 z-20 text-white">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl md:text-4xl lg:text-7xl font-bold mb-2"
                >
                  {currentItem.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-sm md:text-base lg:text-xl max-w-md opacity-90 text-center md:text-left"
                >
                  {currentItem.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-30">
            <Button
              onClick={() => paginate(-1)}
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              onClick={() => paginate(1)}
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/10"
            >
              <ArrowRight className="h-5 w-5" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
          <div className="mt-4 z-10 flex justify-center gap-2  absolute bottom-0 mb-12 left-0 right-0">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > page ? 1 : -1])}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === page ? "w-8 bg-neutral-50" : "w-4 bg-neutral-300"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </MotionConfig>
    </div>
  );
}
