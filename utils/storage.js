import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTask = async (task) => {
  const dateKey = task.date;
  const existing = await AsyncStorage.getItem(dateKey);
  const tasks = existing ? JSON.parse(existing) : [];
  tasks.push(task);
  await AsyncStorage.setItem(dateKey, JSON.stringify(tasks));
};

// Convierte "DD-MM-YYYY" → "YYYY-MM-DD"
const convertDMYtoISO = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}T00:00:00`;
};

export const getTasksInRange = async (startDate, endDate) => {
  // Convertimos las fechas recibidas
  const start = new Date(convertDMYtoISO(startDate));
  const end = new Date(convertDMYtoISO(endDate));

  const keys = await AsyncStorage.getAllKeys();

  const filtered = keys.filter(key => {
    const iso = convertDMYtoISO(key);
    const date = new Date(iso);
    return date >= start && date <= end;
  });

  let results = [];
  for (const key of filtered) {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      const tasks = JSON.parse(value);
      results.push(...tasks);
    }
  }

  return results;
};

