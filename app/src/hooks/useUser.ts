import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { 
    fetchUserById, 
    updateUser, 
    deleteUser,
    fetchUserAddresses,
    addAddress,
    fetchUserStats,
    updateAddress,
    deleteAddress,
    uploadAvatar,
    resetUserState
} from '~/src/store/slices/user';

import type { RootState } from '../store/store';

import type { UserUpdateData } from '../types/user';
import type { AddressData } from '../types/adress';

import type { UserState } from '../store/slices/user';

interface UseUserStoreReturn extends Omit<UserState, 'loading' | 'error' | 'success'> {
    // Estado
    loading: boolean;
    error: string | null;
    success: boolean;
    
    // Ações
    getUserById: (id: string) => Promise<void>;
    updateUserData: (id: string, userData: UserUpdateData) => Promise<void>;
    removeUser: (id: string) => Promise<void>;
    getUserStats: (id: string) => Promise<void>
    getUserAddresses: (userId: string) => Promise<void>;
    createAddress: (userId: string, addressData: AddressData) => Promise<void>;
    modifyAddress: (addressId: string, addressData: AddressData) => Promise<void>;
    removeAddress: (addressId: string) => Promise<void>;
    uploadUserAvatar: (userId: string, file: File) => Promise<void>;
    resetUserStore: () => void;
    
    // Estado computado
    hasAddresses: boolean;
    isAuthenticated: boolean;
    }

    const useUserStore = (): UseUserStoreReturn => {
    const dispatch = useAppDispatch();
    const state = useSelector((state: RootState) => state.user);
    
    // Ações
    const getUserById = async (id: string) => {
        await dispatch(fetchUserById(id));
    };
    
    const updateUserData = async (id: string, userData: UserUpdateData) => {
        await dispatch(updateUser({ id, userData }));
    };
    
    const removeUser = async (id: string) => {
        await dispatch(deleteUser(id));
    };
    const getUserStats = async (id: string) => {
        await dispatch(fetchUserStats(id));
    };

    const getUserAddresses = async (userId: string) => {
        await dispatch(fetchUserAddresses(userId));
    };
    
    const createAddress = async (userId: string, addressData: AddressData) => {
        await dispatch(addAddress({ userId, addressData }));
    };
    
    const modifyAddress = async (addressId: string, addressData: AddressData) => {
        await dispatch(updateAddress({ addressId, addressData }));
    };
    
    const removeAddress = async (addressId: string) => {
        await dispatch(deleteAddress(addressId));
    };
    
    const uploadUserAvatar = async (userId: string, file: File) => {
        await dispatch(uploadAvatar({ userId, file }));
    };
    
    const resetUserStore = () => {
        dispatch(resetUserState());
    };
    
    // Estado computado
    const hasAddresses = state.addresses.length > 0;
    const isAuthenticated = !!state.currentUser;
    
    return {
        ...state,
        getUserById,
        updateUserData,
        removeUser,
        getUserStats,
        getUserAddresses,
        createAddress,
        modifyAddress,
        removeAddress,
        uploadUserAvatar,
        resetUserStore,
        hasAddresses,
        isAuthenticated
    };
};

export default useUserStore;