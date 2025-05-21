import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import LogoTitle from "./components/LogoTitle";

import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import GeneratePDFScreen from './screens/GeneratePDFScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider style={{backgroundColor:'white'}}>
      <NavigationContainer style={{backgroundColor:'white'}}>
        <Stack.Navigator initialRouteName="Inicio" style={{backgroundColor:'white'}}>
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerTitle: () => <LogoTitle />
          ,headerStyle: {
        backgroundColor: '#EAF6FF', // tu color personalizado
      }, }}/>
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerTitle: () => <LogoTitle />,headerStyle: {
        backgroundColor: '#EAF6FF', // tu color personalizado
      }, }}/>
          <Stack.Screen name="Generar PDF" component={GeneratePDFScreen}  options={{ headerTitle: () => <LogoTitle />,headerStyle: {
        backgroundColor: '#EAF6FF', // tu color personalizado
      }, }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: '#6200ee', // Puedes cambiar el color del borde
    flexDirection: 'row', // Alineación horizontal de ícono y texto
    justifyContent: 'center', // Centra el contenido
    alignItems: 'center', // Alinea verticalmente
  },
});