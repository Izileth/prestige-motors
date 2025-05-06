import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useState } from 'react';
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
  fetchVehicleStats,
  resetVehicleState,
  setCurrentVehicle,
  deleteVehicleImage
} from '~/src/store/slices/vehicle';

import type { Vehicle } from '~/src/store/slices/vehicle';

import type {
    VehicleSearchParams,
    VehicleCreateInput,
    VehicleUpdateInput,
    ReviewCreateInput
 } from '~/src/services/vehicle';
/**
 * Hook personalizado para gerenciar operações relacionadas a veículos
 */
const useVehicle = () => {
  const dispatch = useAppDispatch();
  const [singleVehicle, setSingleVehicle] = useState<Vehicle | null>(null);
  const vehicleState = useAppSelector((state) => state.vehicles);


  return {
    ...vehicleState,
    // Buscar veículos com parâmetros tipados
    fetchVehicles: (params?: VehicleSearchParams) => 
        dispatch(fetchVehicles(params || {})),
      
    // Buscar veículo por ID
    
    fetchVehicleById: async (id: string) => {
      const result = await dispatch(fetchVehicleById(id));
      return result.payload; // Retorna diretamente o veículo completo
    },
      
    // Criar novo veículo

    createVehicle: async (data: VehicleCreateInput) => {
      const result = await dispatch(createVehicle(data));
      if (createVehicle.fulfilled.match(result)) {
        return result.payload; // Isso será do tipo Vehicle
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

    deleteVehicleImage: async (vehicleId: string, imageUrl: string) => {
      try {
        await dispatch(deleteVehicleImage({ vehicleId, imageUrl })).unwrap();
      } catch (error) {
        console.error('Erro ao remover imagem:', error);
        throw error; // Pode tratar o erro de forma específica se necessário
      }
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
      
    // Buscar estatísticas dos veículos
    fetchVehicleStats: () => 
      dispatch(fetchVehicleStats()),
      
    // Resetar o estado
    resetVehicleState: () => 
      dispatch(resetVehicleState()),
      
    // Definir veículo atual
    setCurrentVehicle: (vehicle: Vehicle | null) => 
      dispatch(setCurrentVehicle(vehicle)),
  };
};

export default useVehicle;