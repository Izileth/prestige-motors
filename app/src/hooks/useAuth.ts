import { useAppDispatch, useAppSelector } from '~/src/store/hooks';
import {
    loginUser,
    logoutUser,
    registerUser,
    checkSession,
    forgotPassword,
    resetPassword,
    clearResetPasswordStatus,
    selectCurrentUser,
    selectAuthStatus,
    selectResetPasswordStatus,
    selectAuthError,
    setUser // Importar a ação setUser para uso manual se necessário
} from '~/src/store/slices/auth';
import { useCallback, useEffect, useState } from 'react';

// Interfaces de Teste
interface LoginData {
    email: string;
    senha: string;
}

interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cpf?: string;
    dataNascimento?:  string;
}

interface ResetPasswordData {
    token: string;
    senha: string;
}


export function useAuth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const status = useAppSelector(selectAuthStatus);
    const resetPasswordState = useAppSelector(selectResetPasswordStatus);
    const error = useAppSelector(selectAuthError);
    const [internalUser, setInternalUser] = useState(user);

    useEffect(() => {
        console.log("User changed in Redux:", user);
        setInternalUser(user);
    }, [user]);

    // Efeito para debug - remove em produção
    useEffect(() => {
        console.log("User updated in useAuth:", user);
    }, [user]);


    // Determinar o estado de autenticação baseado no usuário

    const [sessionChecked, setSessionChecked] = useState(false);
    const isAuthenticated = !!user; // Use diretamente o user do Redux

    // Efeito para verificar a sessão na montagem e quando o status muda
    useEffect(() => {
        if (status === 'idle' && !sessionChecked) {
            dispatch(checkSession())
                .unwrap()
                .finally(() => setSessionChecked(true));
        }
    }, [dispatch, status, sessionChecked]);


    // Função de login com logs detalhados
    const login = useCallback(async (credentials: LoginData) => {
        try {
            const result = await dispatch(loginUser(credentials)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    // Função para definir manualmente o usuário (útil para debugging)
    const manuallySetUser = useCallback(
        (userData: string) => {
            console.log("Definindo usuário manualmente:", userData);
            dispatch(setUser(userData));
        },
        [dispatch]
    );

    const logout = useCallback(async () => {
        console.log("Iniciando logout...");
        try {
            await dispatch(logoutUser()).unwrap();
            console.log("Logout bem-sucedido");
        } catch (error) {
            console.error("Erro durante logout:", error);
            throw error;
        }
    }, [dispatch]);

    const register = useCallback(
        async (userData: RegisterData) => {
            console.log("Tentando registrar usuário:", userData.email);
            try {
                const result = await dispatch(registerUser(userData)).unwrap();
                console.log("Registro bem-sucedido:", result);
                return result;
            } catch (error) {
                console.error("Erro no registro:", error);
                throw error;
            }
        },
        [dispatch]
    );

    const requestPasswordReset = useCallback(
        async (email: string) => {
            return dispatch(forgotPassword(email)).unwrap();
        },
        [dispatch]
    );

    const confirmPasswordReset = useCallback(
        async (data: ResetPasswordData) => {
            return dispatch(resetPassword(data)).unwrap();
        },
        [dispatch]
    );

    const clearPasswordResetStatus = useCallback(() => {
        dispatch(clearResetPasswordStatus());
    }, [dispatch]);

    const hasRole = useCallback(
        (role: string) => {
            return user?.role === role;
        },
        [user]
    );

    // Adicionar dados extras para debugging
    useEffect(() => {
        console.log("Auth Status:", status);
        console.log("Is Authenticated:", isAuthenticated);
        console.log("User Data:", user);
    }, [status, isAuthenticated, user]);

    return {
        user,
        isAuthenticated,
        status,
        resetPasswordState,
        error,
        sessionChecked, // Novo: indica se a verificação inicial foi concluída
        hasRole,
        login,
        logout,
        register,
        requestPasswordReset,
        confirmPasswordReset,
        clearPasswordResetStatus,
        manuallySetUser, // Novo: permite definir o usuário manualmente para debugging
    };
}