import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTask = async (task) => {
  const dateKey = task.date;
  const existing = await AsyncStorage.getItem(dateKey);
  const tasks = existing ? JSON.parse(existing) : [];
  tasks.push(task);
  await AsyncStorage.setItem(dateKey, JSON.stringify(tasks));
};

export const getTasksInRange = async (startDate, endDate) => {
  const keys = await AsyncStorage.getAllKeys();
  const filtered = keys.filter(key => {
    const date = new Date(key);
    return date >= new Date(startDate) && date <= new Date(endDate);
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
