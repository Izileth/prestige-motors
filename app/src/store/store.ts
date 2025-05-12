import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from './persist';

import authReducer from './slices/auth';
import vehicleReducer from './slices/vehicle';
import negociationReducer from './slices/negociation'
import reviewReducer from './slices/reviews'
import favoriteReducer from './slices/favorites'
import viewReducer from './slices/view'
import userReducer from './slices/user';
import saleReducer from './slices/sales';

// Verificar se estamos no servidor
const isServer = typeof window === 'undefined';

const rootReducer = combineReducers({
  auth: authReducer,
  vehicles: vehicleReducer,
  review: reviewReducer,
  favorite: favoriteReducer,
  view: viewReducer,
  negociation: negociationReducer,
  user: userReducer,
  sales: saleReducer,
});

// Tipo do estado raiz antes da configuração do persist
export type RootState = ReturnType<typeof rootReducer>;

// Configuração da persistência
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'vehicles', 'user', 'review', 'favorite',  'view'], // Persiste apenas esses estados
  version: 1,
};

// Wrapper para o reducer que limpa o estado no logout
const rootReducerWithReset = (state: RootState | undefined, action: AnyAction) => {
  // Limpa todo o estado persistido no logout
  if (action.type === 'auth/logout') {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('persist:root');
      } catch (e) {
        console.error('Erro ao limpar estado persistido:', e);
      }
    }
    state = undefined;
  }

  // Limpa o estado do usuário no logout
  if (action.type === 'auth/logout' || action.type === 'USER_RESET') {
    return rootReducer(state, {
      ...action,
      type: 'USER_RESET_EXTRA',
    });
  }

  return rootReducer(state, action);
};

// Aplicamos o persistReducer apenas no cliente
const finalReducer = isServer
  ? rootReducerWithReset  // No servidor, usamos o reducer sem persistência
  : persistReducer(persistConfig, rootReducerWithReset);  // No cliente, aplicamos a persistência

// Configuração do store
export const store = configureStore({
  reducer: finalReducer as Reducer<RootState, AnyAction>,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // No ambiente de servidor, desabilitamos o DevTools
  devTools: !isServer,
});

// Criamos o persistor apenas no cliente
export const persistor = isServer ? null : persistStore(store);

// Tipos globais do Redux
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
