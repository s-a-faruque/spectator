type EntityType = 'tournaments' | 'teams' | 'players' | 'matches' | 'schedules' | 'courts';

export const localStorageService = {
  getAll: <T>(entity: EntityType): T[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(entity);
    return data ? JSON.parse(data) : [];
  },

  getById: <T>(entity: EntityType, id: string): T | undefined => {
    const list = localStorageService.getAll<T>(entity);
    return list.find((item: any) => item.id === id);
  },

  create: <T>(entity: EntityType, newItem: T & { id: string }): void => {
    const list = localStorageService.getAll<T>(entity);
    localStorage.setItem(entity, JSON.stringify([...list, newItem]));
  },

  update: <T>(entity: EntityType, updatedItem: T & { id: string }): void => {
    const list = localStorageService.getAll<T>(entity);
    const updatedList = list.map((item: any) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    localStorage.setItem(entity, JSON.stringify(updatedList));
  },

  delete: (entity: EntityType, id: string): void => {
    const list = localStorageService.getAll(entity);
    const updatedList = list.filter((item: any) => item.id !== id);
    localStorage.setItem(entity, JSON.stringify(updatedList));
  },

  clear: (entity: EntityType): void => {
    localStorage.removeItem(entity);
  }
};
