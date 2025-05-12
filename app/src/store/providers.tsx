
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '~/src/store/store';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

// Wrapper que verifica se estamos no cliente ou no servidor
export function ReduxProviders({ children }: { children: React.ReactNode }) {
  // Verificar se estamos no servidor
  const isServer = typeof window === 'undefined';
  
  // Estado para controlar se o componente está montado no cliente
  const [isClient, setIsClient] = useState(!isServer);
  
  // Efeito para garantir que a renderização aconteça apenas no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // No servidor, renderizamos apenas o Provider sem o PersistGate
  if (isServer || !isClient) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }
  
  // No cliente, usamos o PersistGate normalmente
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Carregando...</div>} persistor={persistor!}>
        {children}
      </PersistGate>
    </Provider>
  );
}

// Componente opcional para debug do Redux
// Movido para fora do ReduxProviders para evitar problemas
export function StateDebugger() {
  // Verificar se estamos no cliente
  const isClient = typeof window !== 'undefined';
  
  // Não renderizar nada no servidor
  if (!isClient) {
    return null;
  }
  
  // Usar useSelector apenas no cliente
  const { user } = useAuth();
  
  useEffect(() => {
    console.log('Redux State - User:', user);
  }, [user]);
  
  return null;
}