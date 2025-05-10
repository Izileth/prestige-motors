import { useAppDispatch, useAppSelector } from '~/src/store/hooks';
import { createNegotiation, fetchUserNegotiations, clearNegotiations } from '../store/slices/negociation';
const useNegotiation = () => {
    const dispatch = useAppDispatch();
    const negociationState = useAppSelector((state) => state.vehicles);

    return {
        ...negociationState,
    
        
        // Negociações
        createNegotiation: async (vehicleId: string, message: string) => {
        try {
            const result = await dispatch(createNegotiation({ vehicleId, message }));
            if (createNegotiation.fulfilled.match(result)) {
            return result.payload;
            }
            throw new Error(result.error?.message || 'Failed to create negotiation');
        } catch (error) {
            console.error('Negotiation error:', error);
            throw error;
        }
        },
        
        fetchUserNegotiations: async () => {
        try {
            const result = await dispatch(fetchUserNegotiations());
            if (fetchUserNegotiations.fulfilled.match(result)) {
            return result.payload;
            }
            throw new Error(result.error?.message || 'Failed to fetch negotiations');
        } catch (error) {
            console.error('Fetch negotiations error:', error);
            throw error;
        }
        },
        
        clearNegotiations: () => dispatch(clearNegotiations())
    };
};

export default useNegotiation