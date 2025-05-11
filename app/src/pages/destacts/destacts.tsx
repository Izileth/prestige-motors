import { Carousel } from "~/src/_components/common/_carousel/carousel"
import { FeaturedCars } from "~/src/data/static/carousel"
import { VehiclesDestactsListing } from "~/src/_components/_page/_destacts/grid"

export default function DestactsPage(){
    return(
        <main>
            <Carousel items={FeaturedCars} className="max-w-full w-full"/>
            <VehiclesDestactsListing/>
        </main>
    )
}