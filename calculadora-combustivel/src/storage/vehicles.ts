// src/storage/vehicles.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vehicle {
  id:       string;
  nome:     string;  // ex: "Gol 2018"
  consumoEtanol:   number; // km/l com etanol
  consumoGasolina: number; // km/l com gasolina
  createdAt: number;
}

const KEY = '@calculadora:vehicles';

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveVehicle(v: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> {
  const vehicles = await getVehicles();
  const novo: Vehicle = {
    ...v,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify([...vehicles, novo]));
  return novo;
}

export async function updateVehicle(id: string, v: Omit<Vehicle, 'id' | 'createdAt'>): Promise<void> {
  const vehicles = await getVehicles();
  const updated = vehicles.map(x => x.id === id ? { ...x, ...v } : x);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function deleteVehicle(id: string): Promise<void> {
  const vehicles = await getVehicles();
  await AsyncStorage.setItem(KEY, JSON.stringify(vehicles.filter(x => x.id !== id)));
}
