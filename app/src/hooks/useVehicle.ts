import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchVehicles,
  fetchVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  fetchFeaturedVehicles,
  fetchUserFavorites,
  addFavorite,
  removeFavorite,
  fetchVehicleReviews,
  createReview,
  uploadVehicleImages,
  uploadVehicleVideos,
  fetchVehicleStats,
  fetchUserVehicleStats,
  fetchUserVehicles,
  fetchVehiclesByVendor,
  registerVehicleView,
  fetchVehicleViews,
  updateStatus,
  deleteVehicleImage,
  resetVehicleState,
  setCurrentVehicle
} from '~/src/store/slices/vehicle';


import type { Vehicle, VehicleCreateInput, VehicleSearchParams } from '../types/vehicle';
import type { VehicleUpdateInput, ReviewCreateInput } from '../types/inputs';

/**
 * Hook personalizado para gerenciar operações relacionadas a veículos
 */
const useVehicle = () => {
  const dispatch = useAppDispatch();
  const vehicleState = useAppSelector((state) => state.vehicles);

  return {
    ...vehicleState,
    // Buscar veículos com parâmetros tipados

    fetchVehicles: (params?: VehicleSearchParams) => {
      const normalizedParams = params
        ? Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
          )
        : {};
      
      return dispatch(fetchVehicles(normalizedParams));
    },
    
    // Buscar veículos do usuário atual
    fetchUserVehicles: () => 
      dispatch(fetchUserVehicles()),
    
    // Buscar veículos por vendedor
    fetchVehiclesByVendor: (vendorId: string) => 
      dispatch(fetchVehiclesByVendor(vendorId)),
    
    // Buscar veículo por ID
    fetchVehicleById: async (id: string) => {
      const result = await dispatch(fetchVehicleById(id));
      return result.payload;
    },
    
    // Criar novo veículo
    createVehicle: async (data: VehicleCreateInput) => {
      const result = await dispatch(createVehicle(data));
      if (createVehicle.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.error?.message || 'Failed to create vehicle');
    },
    
    // Atualizar veículo
    updateVehicle: async ({ id, data }: { id: string; data: VehicleUpdateInput }) => {
      const result = await dispatch(updateVehicle({ id, data }));
      if (updateVehicle.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.error?.message || 'Failed to update vehicle');
    },
    
    // Atualizar status do veículo
    updateStatus: async ({ id, status }: { id: string; status: string }) => {
      const result = await dispatch(updateStatus({ id, status }));
      if (updateStatus.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.error?.message || 'Failed to update vehicle status');
    },

    // Excluir veículo
    deleteVehicle: (id: string) => 
      dispatch(deleteVehicle(id)),
    
    // Buscar veículos em destaque
    fetchFeaturedVehicles: () => 
      dispatch(fetchFeaturedVehicles()),
    
    // Buscar favoritos do usuário
    fetchUserFavorites: () => 
      dispatch(fetchUserFavorites()),
    
    // Adicionar veículo aos favoritos
    addFavorite: (vehicleId: string) => 
      dispatch(addFavorite(vehicleId)),
    
    // Remover veículo dos favoritos
    removeFavorite: (vehicleId: string) => 
      dispatch(removeFavorite(vehicleId)),
    
    // Buscar avaliações de um veículo
    fetchVehicleReviews: (vehicleId: string) => 
      dispatch(fetchVehicleReviews(vehicleId)),

    
    
    // Criar nova avaliação
    createReview: (vehicleId: string, data: ReviewCreateInput) => 
      dispatch(createReview({ vehicleId, data })),
    
    // Fazer upload de imagens para um veículo
    uploadVehicleImages: (vehicleId: string, files: File[]) => 
      dispatch(uploadVehicleImages({ vehicleId, files })),
    
    // Fazer upload de vídeos para um veículo
    uploadVehicleVideos: (vehicleId: string, file: File) => 
      dispatch(uploadVehicleVideos({ vehicleId, file })),
    
    // Remover imagem do veículo
    deleteVehicleImage: async (vehicleId: string, imageUrl: string) => {
      try {
        await dispatch(deleteVehicleImage({ vehicleId, imageUrl })).unwrap();
      } catch (error) {
        console.error('Erro ao remover imagem:', error);
        throw error;
      }
    },
    
    // Buscar estatísticas gerais dos veículos
    fetchVehicleStats: () => 
      dispatch(fetchVehicleStats()),
    
    // Buscar estatísticas dos veículos do usuário
    fetchUserVehicleStats: () => 
      dispatch(fetchUserVehicleStats()),
    
    // Registrar visualização do veículo
    registerVehicleView: (vehicleId: string) => 
      dispatch(registerVehicleView(vehicleId)),
    
    // Buscar contagem de visualizações
    fetchVehicleViews: () => 
      dispatch(fetchVehicleViews()),
    
    // Resetar o estado
    resetVehicleState: () => 
      dispatch(resetVehicleState()),
    
    // Definir veículo atual
    setCurrentVehicle: (vehicle: Vehicle | null) => 
      dispatch(setCurrentVehicle(vehicle)),
  };
};

export default useVehicle;