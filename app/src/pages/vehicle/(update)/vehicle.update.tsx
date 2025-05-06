import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useVehicle from "~/src/hooks/useVehicle";
import { FileUpload } from "~/src/_components/common/_file/file";
import { Loader2, Trash2 } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import type { Accept } from "react-dropzone";
import type { VehicleFormValues } from "../(create)/vehicle.create";
import { vehicleFormSchema } from "../(create)/vehicle.create";
import type { UseFormReturn } from "react-hook-form";
import type { Resolver } from "react-hook-form";

import type { VehicleImage } from "~/src/store/slices/vehicle";

import {
  FuelType,
  TransmissionType,
  BodyType,
  VehicleCategory,
  VehicleClass,
} from "../(create)/vehicle.create";

const acceptedFileTypes: Accept = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

type FormImage = VehicleImage | File; // Tipo união para imagens existentes ou novas

export function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentVehicle,
    fetchVehicleById,
    updateVehicle,
    uploadVehicleImages,
    deleteVehicleImage,
    loading,
    error: apiError,
  } = useVehicle();
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const form: UseFormReturn<VehicleFormValues> = useForm<VehicleFormValues>({
    resolver: zodResolver(
      vehicleFormSchema
    ) as unknown as Resolver<VehicleFormValues>,
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
  });
  const loadVehicleData = useCallback(() => {
    if (id && !isDataLoaded) {
      fetchVehicleById(id);
      setIsDataLoaded(true);
    }
  }, [id, fetchVehicleById, isDataLoaded]);

  // Carrega os dados do veículo
  useEffect(() => {
    loadVehicleData();
  }, [loadVehicleData]);
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
      });
      
      // Atualiza o estado das imagens existentes apenas se houver mudança
      if (currentVehicle.imagens?.length !== existingImages.length) {
        setExistingImages(currentVehicle.imagens || []);
      }
    }
  }, [currentVehicle, form]);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  

  const handleRemoveExistingImage = async (imageId: string) => {
    if (!id) return;

    try {
      await deleteVehicleImage(id, imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);

      // 1. Atualizar dados básicos (sem imagens)
      const { imagens, ...vehicleData } = data;
      await updateVehicle({ id, data: vehicleData });

      // 2. Upload de novas imagens (apenas Files)
      const newImages = files.filter((file) => file instanceof File);
      if (newImages.length > 0) {
        await uploadVehicleImages(id, newImages);
      }

      // 3. Verificar imagens removidas
      const currentImageIds =
        currentVehicle?.imagens?.map((img) => img.id) || [];
      const remainingImageIds = existingImages.map((img) => img.id);
      const imagesToRemove = currentImageIds.filter(
        (id) => !remainingImageIds.includes(id)
      );

      await Promise.all(
        imagesToRemove.map((imageId) => deleteVehicleImage(id, imageId))
      );

      console.log("Form errors:", form.formState.errors);
      console.log("Current images:", currentVehicle?.imagens);
      console.log("Existing images state:", existingImages);
      console.log("New files:", files);

      navigate(`/vehicles/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !currentVehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Carregando...
      </div>
    );
  }

  if (!currentVehicle && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Veículo não encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Veículo</h1>
        <p className="text-muted-foreground">
          Atualize os detalhes do veículo {currentVehicle?.marca}{" "}
          {currentVehicle?.modelo}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Seção de Informações Básicas */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Detalhes essenciais sobre o veículo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Ford, Toyota, BMW..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Mustang, Corolla, X5..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="anoFabricacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano de Fabricação*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1886}
                            max={new Date().getFullYear() + 1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anoModelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano do Modelo*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1886}
                            max={new Date().getFullYear() + 1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="precoPromocional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Promocional (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o veículo em detalhes..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Seção de Imagens */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
                <CardDescription>
                  Gerencie as imagens do veículo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Imagens existentes */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Imagens atuais</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.url}
                            alt={`Imagem ${img.ordem || ""}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveExistingImage(img.id)} // Agora usa img.id
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload de novas imagens */}
                <div className="mt-4">
                  <FileUpload
                    value={files.map((file) => URL.createObjectURL(file))}
                    onChange={handleFileChange}
                    onRemove={(url) => {
                      setFiles(
                        files.filter(
                          (file) => URL.createObjectURL(file) !== url
                        )
                      );
                    }}
                    maxFiles={10 - existingImages.length}
                    accept={acceptedFileTypes}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Você pode adicionar até {10 - existingImages.length} imagens
                    adicionais
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes Técnicos</CardTitle>
                <CardDescription>Especificações do veículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quilometragem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quilometragem*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipoCombustivel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Combustível*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o combustível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(FuelType).map((fuel) => (
                              <SelectItem key={fuel} value={fuel}>
                                {fuel === "GASOLINA" && "Gasolina"}
                                {fuel === "ETANOL" && "Etanol"}
                                {fuel === "FLEX" && "Flex"}
                                {fuel === "DIESEL" && "Diesel"}
                                {fuel === "ELETRICO" && "Elétrico"}
                                {fuel === "HIBRIDO" && "Híbrido"}
                                {fuel === "GNV" && "GNV"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cambio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Câmbio*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o câmbio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(TransmissionType).map(
                              (transmission) => (
                                <SelectItem
                                  key={transmission}
                                  value={transmission}
                                >
                                  {transmission === "MANUAL" && "Manual"}
                                  {transmission === "AUTOMATICO" &&
                                    "Automático"}
                                  {transmission === "SEMI_AUTOMATICO" &&
                                    "Semi-automático"}
                                  {transmission === "CVT" && "CVT"}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carroceria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carroceria*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a carroceria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(BodyType).map((body) => (
                              <SelectItem key={body} value={body}>
                                {body === "HATCH" && "Hatch"}
                                {body === "SEDAN" && "Sedã"}
                                {body === "SUV" && "SUV"}
                                {body === "PICAPE" && "Picape"}
                                {body === "COUPE" && "Cupê"}
                                {body === "CONVERSIVEL" && "Conversível"}
                                {body === "PERUA" && "Perua"}
                                {body === "MINIVAN" && "Minivan"}
                                {body === "VAN" && "Van"}
                                {body === "BUGGY" && "Buggy"}
                                {body === "OFFROAD" && "Off-road"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Preto, Branco, Vermelho..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portas*</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="potencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potência (cv)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motor (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 2.0 Turbo, V8 5.0..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorização</CardTitle>
                <CardDescription>Classificação do veículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VehicleCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "HYPERCAR" && "Hypercar"}
                              {category === "SUPERCAR" && "Supercar"}
                              {category === "SPORTS_CAR" && "Sports Car"}
                              {category === "CLASSIC_MUSCLE" &&
                                "Classic Muscle"}
                              {category === "MODERN_MUSCLE" && "Modern Muscle"}
                              {category === "RETRO_SUPER" && "Retro Super"}
                              {category === "DRIFT_CAR" && "Drift Car"}
                              {category === "TRACK_TOY" && "Track Toy"}
                              {category === "OFFROAD" && "Offroad"}
                              {category === "BUGGY" && "Buggy"}
                              {category === "PICKUP_4X4" && "Pickup 4x4"}
                              {category === "SUV" && "SUV"}
                              {category === "HOT_HATCH" && "Hot Hatch"}
                              {category === "SALOON" && "Saloon"}
                              {category === "GT" && "GT"}
                              {category === "RALLY" && "Rally"}
                              {category === "CONCEPT" && "Concept"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VehicleClass).map((classe) => (
                            <SelectItem key={classe} value={classe}>
                              {classe === "D" && "Classe D (Básico)"}
                              {classe === "C" && "Classe C (Intermediário)"}
                              {classe === "B" && "Classe B (Avançado)"}
                              {classe === "A" && "Classe A (Especialista)"}
                              {classe === "S1" && "Classe S1 (Super)"}
                              {classe === "S2" && "Classe S2 (Ultra)"}
                              {classe === "X" && "Classe X (Extremo)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finalPlaca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final da Placa (opcional)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : undefined)
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o final" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">Não informado</SelectItem>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              Final {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Opções Adicionais</CardTitle>
                <CardDescription>
                  Configurações extras para o anúncio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="destaque"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Destaque</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Destacar este veículo nos resultados de busca
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seloOriginal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Selo Original</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Veículo possui todas as peças originais
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aceitaTroca"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Aceita Troca</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Disponível para troca por outro veículo
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                      <FormLabel>Parcelamento (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          placeholder="Número máximo de parcelas"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/vehicles/${id}`)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
