import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FavoritePokemon = {
  id: number;
  name: string;
};

type FavoritesContextValue = {
  favorites: FavoritePokemon[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => void;
};

const STORAGE_KEY = "favorites";

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavorites(JSON.parse(raw));
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, loaded]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((pokemon) => pokemon.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === pokemon.id)
        ? prev.filter((item) => item.id !== pokemon.id)
        : [...prev, pokemon]
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
