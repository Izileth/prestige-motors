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
  fetchVehicleStats,
  resetVehicleState,
  setCurrentVehicle,
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
  const vehicleState = useAppSelector((state) => state.vehicles);

  return {
    ...vehicleState,
    // Buscar veículos com parâmetros tipados
    fetchVehicles: (params?: VehicleSearchParams) => 
        dispatch(fetchVehicles(params || {})),
      
    // Buscar veículo por ID
    fetchVehicleById: (id: string) => 
      dispatch(fetchVehicleById(id)),
      
    // Criar novo veículo
    createVehicle: (data: VehicleCreateInput) => 
      dispatch(createVehicle(data)),
      
    // Atualizar veículo
    updateVehicle: (id: string, data: VehicleUpdateInput) => 
      dispatch(updateVehicle({ id, data })),
      
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