
import { Carousel } from "./src/_components/common/_carousel/carousel";
import { DestactsCars } from '~/src/data/static/carousel';
export function Started() {
  return (
    <main className="flex items-center justify-center  pb-4 w-full max-w-full">
      <Carousel items={DestactsCars} className="max-w-full w-full"/>
    </main>
  );
}
