import React, { useState } from 'react';
import { View,StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { saveTask } from '../utils/storage';

export default function AddTaskScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');

  const handleSave = async () => {
    const date = new Date().toISOString().split('T')[0];
    const task = {
      description,
      hours: parseFloat(hours),
      rate: parseFloat(rate),
      date,
    };
    await saveTask(task);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput label="Descripción" value={description} onChangeText={setDescription} />
      <TextInput label="Horas" keyboardType="numeric" value={hours} onChangeText={setHours} />
      <TextInput label="₡ por hora" keyboardType="numeric" value={rate} onChangeText={setRate} />
      <Button mode="contained" onPress={handleSave} style={styles.buttonAdd} textColor="white">
        Guardar Tarea
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonAdd: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor:'transparent',
    borderRadius: 20,
    backgroundColor: '#green', // Puedes cambiar el color del borde
    flexDirection: 'row', // Alineación horizontal de ícono y texto
    justifyContent: 'center', // Centra el contenido
    alignItems: 'center', // Alinea verticalmente
  },
});