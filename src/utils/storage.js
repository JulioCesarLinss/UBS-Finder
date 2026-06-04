import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ubs_favoritos';

export async function getFavoritos() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function salvarFavorito(ubs) {
  try {
    const lista = await getFavoritos();
    const jaExiste = lista.some((f) => f.id === ubs.id);
    if (!jaExiste) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...lista, ubs]));
    }
  } catch {
    // ignora erros de persistência
  }
}

export async function removerFavorito(id) {
  try {
    const lista = await getFavoritos();
    const nova = lista.filter((f) => f.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nova));
  } catch {
    // ignora erros de persistência
  }
}
