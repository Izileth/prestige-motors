const isServer = typeof window === 'undefined';

// Implementação de storage que funciona tanto no cliente quanto no servidor
const storage = {
  getItem: (key: string): Promise<string | null> => {
    // No servidor, sempre retornamos null para evitar erros
    if (isServer) {
      console.log(`[Redux Storage] Ambiente de servidor detectado, retornando null para: ${key}`);
      return Promise.resolve(null);
    }
    
    try {
      console.log(`[Redux Storage] Tentando buscar item: ${key}`);
      const item = window.localStorage.getItem(key);
      if (item === null) {
        console.log(`[Redux Storage] Item não encontrado: ${key}`);
      } else {
        console.log(`[Redux Storage] Item recuperado com sucesso: ${key}`);
      }
      return Promise.resolve(item);
    } catch (error) {
      console.error(`[Redux Storage] Erro ao buscar item ${key}:`, error);
      return Promise.resolve(null);
    }
  },
  
  setItem: (key: string, value: string): Promise<void> => {
    // No servidor, apenas simulamos o sucesso
    if (isServer) {
      console.log(`[Redux Storage] Ambiente de servidor detectado, ignorando setItem para: ${key}`);
      return Promise.resolve();
    }
    
    try {
      console.log(`[Redux Storage] Salvando item: ${key}`);
      window.localStorage.setItem(key, value);
      console.log(`[Redux Storage] Item salvo com sucesso: ${key}`);
      return Promise.resolve();
    } catch (error) {
      console.error(`[Redux Storage] Erro ao salvar item ${key}:`, error);
      return Promise.resolve();
    }
  },
  
  removeItem: (key: string): Promise<void> => {
    // No servidor, apenas simulamos o sucesso
    if (isServer) {
      console.log(`[Redux Storage] Ambiente de servidor detectado, ignorando removeItem para: ${key}`);
      return Promise.resolve();
    }
    
    try {
      console.log(`[Redux Storage] Removendo item: ${key}`);
      window.localStorage.removeItem(key);
      console.log(`[Redux Storage] Item removido com sucesso: ${key}`);
      return Promise.resolve();
    } catch (error) {
      console.error(`[Redux Storage] Erro ao remover item ${key}:`, error);
      return Promise.resolve();
    }
  }
};

export default storage;