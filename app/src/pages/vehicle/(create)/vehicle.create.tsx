import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useVehicle from '~/src/hooks/useVehicle';

import type { Accept } from 'react-dropzone';

import { FileUpload } from '~/src/_components/common/_file/file';
import { Loader2 } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import type { UseFormReturn } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';

export const FuelType = {
    GASOLINA: 'GASOLINA',
    ETANOL: 'ETANOL',
    FLEX: 'FLEX',
    DIESEL: 'DIESEL',
    ELETRICO: 'ELETRICO',
    HIBRIDO: 'HIBRIDO',
    GNV: 'GNV'
} as const;

export const TransmissionType = {
    MANUAL: 'MANUAL',
    AUTOMATICO: 'AUTOMATICO',
    SEMI_AUTOMATICO: 'SEMI_AUTOMATICO',
    CVT: 'CVT'
} as const;

export const BodyType = {
    HATCH: 'HATCH',
    SEDAN: 'SEDAN',
    SUV: 'SUV',
    PICAPE: 'PICAPE',
    COUPE: 'COUPE',
    CONVERSIVEL: 'CONVERSIVEL',
    PERUA: 'PERUA',
    MINIVAN: 'MINIVAN',
    VAN: 'VAN',
    BUGGY: 'BUGGY',
    OFFROAD: 'OFFROAD'
} as const;

export const VehicleCategory = {
    HYPERCAR: 'HYPERCAR',
    SUPERCAR: 'SUPERCAR',
    SPORTS_CAR: 'SPORTS_CAR',
    CLASSIC_MUSCLE: 'CLASSIC_MUSCLE',
    MODERN_MUSCLE: 'MODERN_MUSCLE',
    RETRO_SUPER: 'RETRO_SUPER',
    DRIFT_CAR: 'DRIFT_CAR',
    TRACK_TOY: 'TRACK_TOY',
    OFFROAD: 'OFFROAD',
    BUGGY: 'BUGGY',
    PICKUP_4X4: 'PICKUP_4X4',
    SUV: 'SUV',
    HOT_HATCH: 'HOT_HATCH',
    SALOON: 'SALOON',
    GT: 'GT',
    RALLY: 'RALLY',
    CONCEPT: 'CONCEPT'
} as const;

export const VehicleClass = {
    D: 'D',
    C: 'C',
    B: 'B',
    A: 'A',
    S1: 'S1',
    S2: 'S2',
    X: 'X'
} as const;


const acceptedFileTypes: Accept = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
};

export const vehicleFormSchema = z.object({
    marca: z.string().min(1, 'Marca é obrigatória'),
    modelo: z.string().min(1, 'Modelo é obrigatório'),
    anoFabricacao: z.number().int().min(1886, 'Ano inválido').max(new Date().getFullYear() + 1),
    anoModelo: z.number().int().min(1886, 'Ano inválido').max(new Date().getFullYear() + 1),
    preco: z.number().positive('Preço deve ser positivo'),
    precoPromocional: z.number().positive('Preço promocional deve ser positivo').optional(),
    descricao: z.string().optional(),
    quilometragem: z.number().min(0, 'Quilometragem não pode ser negativa'),
    tipoCombustivel: z.nativeEnum(FuelType),
    cambio: z.nativeEnum(TransmissionType),
    cor: z.string().min(1, 'Cor é obrigatória'),
    portas: z.number().int().min(2).max(5),
    finalPlaca: z.number().int().min(0).max(9).optional(),
    carroceria: z.nativeEnum(BodyType),
    potencia: z.number().int().positive().optional(),
    motor: z.string().optional(),
    categoria: z.nativeEnum(VehicleCategory),
    classe: z.nativeEnum(VehicleClass),
    destaque: z.boolean().default(false),
    seloOriginal: z.boolean().default(false),
    aceitaTroca: z.boolean().default(false),
    parcelamento: z.number().int().positive().optional(),

    imagens: z.array(z.union([z.object({
        id: z.string(),
        url: z.string()
    }), z.instanceof(File)])).optional()
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>
;
const CreateVehiclePage = () => {
    const { createVehicle, uploadVehicleImages, loading } = useVehicle();
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);

    const form: UseFormReturn<VehicleFormValues> = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleFormSchema) as unknown as Resolver<VehicleFormValues>,
            defaultValues: {
            marca: '',
            modelo: '',
            anoFabricacao: new Date().getFullYear(),
            anoModelo: new Date().getFullYear(),
            preco: 0,
            quilometragem: 0,
            tipoCombustivel: 'GASOLINA',
            cambio: 'MANUAL',
            cor: '',
            portas: 4,
            carroceria: 'SEDAN',
            categoria: 'SPORTS_CAR',
            classe: 'B',
            destaque: false,
            seloOriginal: false,
            aceitaTroca: false
        }
    }) ; 

   
    const onSubmit = async (data: VehicleFormValues) => {
        try {
            const vehicle = await createVehicle(data);
            
            if (files.length > 0 && vehicle?.id) {
            await uploadVehicleImages(vehicle.id, files);
            }
            
            navigate(`/vehicles/${vehicle.id}`);
        } catch (error) {
            console.error('Erro ao criar veículo:', error);
            // Adicione tratamento de erro visual para o usuário
        }
    };

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Adicionar Novo Veículo</h1>
            <p className="text-muted-foreground">
            Preencha os detalhes do veículo que deseja anunciar em nossa loja.
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Seção de Informações Básicas */}
                <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>Detalhes essenciais sobre o veículo</CardDescription>
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
                            <Input placeholder="Ex: Ford, Toyota, BMW..." {...field} />
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
                            <Input placeholder="Ex: Mustang, Corolla, X5..." {...field} />
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
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                    <CardDescription>Adicione fotos do veículo</CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        value={files.map(file => URL.createObjectURL(file))}
                        onChange={handleFileChange}
                        onRemove={(url) => {
                        setFiles(files.filter((file) => URL.createObjectURL(file) !== url));
                        }}
                        maxFiles={10}
                        accept={acceptedFileTypes}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        Adicione até 10 imagens (JPEG, PNG, WEBP). A primeira imagem será a principal.
                    </p>
                </CardContent>   
                </Card>

                {/* Seção de Detalhes Técnicos */}
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
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecione o combustível" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(FuelType).map((fuel) => (
                                <SelectItem key={fuel} value={fuel}>
                                    {fuel === 'GASOLINA' && 'Gasolina'}
                                    {fuel === 'ETANOL' && 'Etanol'}
                                    {fuel === 'FLEX' && 'Flex'}
                                    {fuel === 'DIESEL' && 'Diesel'}
                                    {fuel === 'ELETRICO' && 'Elétrico'}
                                    {fuel === 'HIBRIDO' && 'Híbrido'}
                                    {fuel === 'GNV' && 'GNV'}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecione o câmbio" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(TransmissionType).map((transmission) => (
                                <SelectItem key={transmission} value={transmission}>
                                    {transmission === 'MANUAL' && 'Manual'}
                                    {transmission === 'AUTOMATICO' && 'Automático'}
                                    {transmission === 'SEMI_AUTOMATICO' && 'Semi-automático'}
                                    {transmission === 'CVT' && 'CVT'}
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
                        name="carroceria"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Carroceria*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecione a carroceria" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(BodyType).map((body) => (
                                <SelectItem key={body} value={body}>
                                    {body === 'HATCH' && 'Hatch'}
                                    {body === 'SEDAN' && 'Sedã'}
                                    {body === 'SUV' && 'SUV'}
                                    {body === 'PICAPE' && 'Picape'}
                                    {body === 'COUPE' && 'Cupê'}
                                    {body === 'CONVERSIVEL' && 'Conversível'}
                                    {body === 'PERUA' && 'Perua'}
                                    {body === 'MINIVAN' && 'Minivan'}
                                    {body === 'VAN' && 'Van'}
                                    {body === 'BUGGY' && 'Buggy'}
                                    {body === 'OFFROAD' && 'Off-road'}
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
                            <Input placeholder="Ex: Preto, Branco, Vermelho..." {...field} />
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
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
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                            <Input placeholder="Ex: 2.0 Turbo, V8 5.0..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </CardContent>
                </Card>

                {/* Seção de Categorização */}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {Object.values(VehicleCategory).map((category) => (
                                <SelectItem key={category} value={category}>
                                {category === 'HYPERCAR' && 'Hypercar'}
                                {category === 'SUPERCAR' && 'Supercar'}
                                {category === 'SPORTS_CAR' && 'Sports Car'}
                                {category === 'CLASSIC_MUSCLE' && 'Classic Muscle'}
                                {category === 'MODERN_MUSCLE' && 'Modern Muscle'}
                                {category === 'RETRO_SUPER' && 'Retro Super'}
                                {category === 'DRIFT_CAR' && 'Drift Car'}
                                {category === 'TRACK_TOY' && 'Track Toy'}
                                {category === 'OFFROAD' && 'Offroad'}
                                {category === 'BUGGY' && 'Buggy'}
                                {category === 'PICKUP_4X4' && 'Pickup 4x4'}
                                {category === 'SUV' && 'SUV'}
                                {category === 'HOT_HATCH' && 'Hot Hatch'}
                                {category === 'SALOON' && 'Saloon'}
                                {category === 'GT' && 'GT'}
                                {category === 'RALLY' && 'Rally'}
                                {category === 'CONCEPT' && 'Concept'}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a classe" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {Object.values(VehicleClass).map((classe) => (
                                <SelectItem key={classe} value={classe}>
                                {classe === 'D' && 'Classe D (Básico)'}
                                {classe === 'C' && 'Classe C (Intermediário)'}
                                {classe === 'B' && 'Classe B (Avançado)'}
                                {classe === 'A' && 'Classe A (Especialista)'}
                                {classe === 'S1' && 'Classe S1 (Super)'}
                                {classe === 'S2' && 'Classe S2 (Ultra)'}
                                {classe === 'X' && 'Classe X (Extremo)'}
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
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
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

                {/* Seção de Opções Adicionais */}
                <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Opções Adicionais</CardTitle>
                    <CardDescription>Configurações extras para o anúncio</CardDescription>
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
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/veiculos')}
                disabled={loading}
                >
                Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                {loading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                    </>
                ) : (
                    'Salvar Veículo'
                )}
                </Button>
            </div>
            </form>
        </Form>
        </div>
  );
};

export default CreateVehiclePage;