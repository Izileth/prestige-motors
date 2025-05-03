import { useState } from 'react';
import { Menu, Home, Search, ShoppingCart, User, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Slider } from '~/components/ui/slider';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';


const StartedItem = () => {
  const [sliderValue, setSliderValue] = useState([33]);
  
  // Dados simulados para carrosséis
  const featuredProducts = [
    { id: 1, title: 'Produto 1', description: 'Uma ótima escolha para você', price: 'R$ 99,90', rating: 4.5 },
    { id: 2, title: 'Produto 2', description: 'Qualidade incomparável', price: 'R$ 149,90', rating: 5.0 },
    { id: 3, title: 'Produto 3', description: 'O mais vendido', price: 'R$ 79,90', rating: 4.8 },
    { id: 4, title: 'Produto 4', description: 'Nova coleção', price: 'R$ 199,90', rating: 4.2 },
  ];

  const categories = [
    { id: 1, name: 'Eletrônicos', count: 245 },
    { id: 2, name: 'Móveis', count: 132 },
    { id: 3, name: 'Roupas', count: 427 },
    { id: 4, name: 'Esportes', count: 89 },
  ];
  
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full">
      
      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Banner com Slider */}
        <section className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-lg bg-white shadow">
              <div className="relative h-64 bg-blue-600 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white text-center px-6">Ofertas Especiais da Semana</h2>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      className="w-48"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-4 -translate-y-1/2">
                <Button variant="outline" size="icon" className="rounded-full bg-white bg-opacity-70">
                  <ChevronLeft size={20} />
                </Button>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <Button variant="outline" size="icon" className="rounded-full bg-white bg-opacity-70">
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tabs Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="featured">Destaques</TabsTrigger>
                <TabsTrigger value="new">Novidades</TabsTrigger>
                <TabsTrigger value="sale">Promoções</TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200"></div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 px-4">
                        <div className="flex items-center text-amber-500">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-4">
                        <p className="font-bold">{product.price}</p>
                        <Button size="sm">Adicionar</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="new">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Conteúdo da aba Novidades</p>
                </div>
              </TabsContent>
              
              <TabsContent value="sale">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Conteúdo da aba Promoções</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
                >
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  <Badge variant="secondary" className="mt-2">{category.count} itens</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>
      
      </main>
      
    </div>
  );
};

export default StartedItem;