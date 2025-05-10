
import { Carousel } from "./src/_components/common/_carousel/carousel";
import { DestactsCars } from '~/src/data/static/carousel';
import { Testimonials } from "./src/_components/_page/_started/_testmonial/testmonial";
import { PartnerBrands } from "./src/_components/_page/_started/_brands/brands";
import { SignupCTA } from "./src/_components/_page/_started/_cta/signup";
import { CategoryGrid } from "./src/_components/_page/_vehicle/_grid/grid";
import { RandomVehicles } from "./src/_components/_page/_started/_random/random.vehicles";
export function Started() {
  return (
    <main className="flex flex-col items-center justify-center  pb-4 w-full max-w-full">
      <Carousel items={DestactsCars} className="max-w-full w-full"/>
      <CategoryGrid/>
      <RandomVehicles/>
      <Testimonials/>
      <PartnerBrands/>
      <SignupCTA/>
    </main>
  );
}
