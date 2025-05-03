import { useAppDispatch, useAppSelector } from '~/src/store/hooks';
import * as saleActions from '~/src/store/slices/sales';
import type { SaleData, UpdateSaleData } from '../services/sale';
import type { Sale } from '../store/slices/sales';

const useSale = () => {
    const dispatch = useAppDispatch();
    const saleState = useAppSelector((state) => state.sales);

    return {
        ...saleState,
        
        // Operações básicas de vendas
        createSale: (data: SaleData) => dispatch(saleActions.createSale(data)),
        fetchSaleById: (id: string) => dispatch(saleActions.fetchSaleById(id)),
        updateSale: (id: string, data: UpdateSaleData) => dispatch(saleActions.updateSale({ id, data })),

        // Históricos
        fetchPurchasesByUser: (userId: string) => dispatch(saleActions.fetchPurchasesByUser(userId)),
        fetchSalesBySeller: (userId: string) => dispatch(saleActions.fetchSalesBySeller(userId)),
        fetchSalesByVehicle: (vehicleId: string) => dispatch(saleActions.fetchSalesByVehicle(vehicleId)),

        // Estatísticas
        fetchGlobalSalesStats: () => dispatch(saleActions.fetchGlobalSalesStats()),
        fetchUserSalesStats: (userId: string) => dispatch(saleActions.fetchUserSalesStats(userId)),
        clearStats: () => dispatch(saleActions.clearStats()),

        // Utilitários
        resetSaleState: () => dispatch(saleActions.resetSaleState()),
        setCurrentSale: (sale: Sale | null) => dispatch(saleActions.setCurrentSale(sale)),
    };
};

export default useSale;