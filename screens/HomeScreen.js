import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import {  Button,
  Text,
  TextInput,
  FAB,
  Card,
  Divider, } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskCard from "../components/TaskCard";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("0");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [showForm, setShowForm] = useState(false); // Estado para el desplegable
  const [loading, setLoading] = useState(false); // ✅ Estado para "Cargando"
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadTasks = async () => {
    const dateKey = formatDate2(date);
    const data = await AsyncStorage.getItem(dateKey);
    if (data) {
      setTasks(JSON.parse(data)); // Actualiza el estado con las tareas
    } else {
      setTasks([]);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, [date]);

  useEffect(() => {
    let totall = 0;
    tasks.forEach((task) => {
      totall += task.rate || 0; // por si rate viene undefined
    });

    // aquí puedes guardar el total en un estado
    console.log("Total calculado:", totall);
    setTotal(totall);
  }, [tasks]);

  const handleSave = async () => {
    setLoading(true);
    const date1 = formatDate2(date);
    // const date1 = date.toISOString().split("T")[0]; // Fecha actual 'YYYY-MM-DD'
    const taskDate = date1; // Usamos el estado editable

    const task = {
      description,
      hours: parseFloat(hours),
      rate: parseFloat(rate),
      date: taskDate,
    };

    await saveTask(task);
    loadTasks(); // Vuelve a cargar las tareas después de guardar
    setDescription("");
    setHours("");
    setRate("");
    setShowForm(false);
    setLoading(false);
  };
  const deleteTask = async (indexToDelete) => {
    const dateKey = formatDate2(date);
    const existing = await AsyncStorage.getItem(dateKey);
    const tasks = existing ? JSON.parse(existing) : [];

    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    await AsyncStorage.setItem(dateKey, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };
  const formatDate2 = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Guardar la tarea en AsyncStorage
  const saveTask = async (task) => {
    const dateKey = task.date; // Usamos la fecha como clave
    const existing = await AsyncStorage.getItem(dateKey); // Verifica si ya hay tareas para hoy
    const tasks = existing ? JSON.parse(existing) : [];
    tasks.push(task); // Agrega la nueva tarea
    await AsyncStorage.setItem(dateKey, JSON.stringify(tasks)); // Guarda las tareas
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Hola</Text>

          <Text style={styles.title}>Gestión de tareas</Text>

          <Text style={styles.subtitle}>
            Organiza tu trabajo y controla tus ganancias
          </Text>
        </View>
        <View style={{ marginVertical: 10 }}>

          <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryLabel}>💰 Total del día</Text>

            <Text style={styles.summaryAmount}>
              {formatCurrency(total)}
            </Text>

            <Divider style={{ marginVertical: 15 }} />

            <Button
              mode="contained"
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {formatDate2(date)}
            </Button>
          </Card.Content>
        </Card>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <Button
          mode="contained"
          onPress={() => setShowForm(!showForm)}
          icon={showForm ? "chevron-up" : "chevron-down"}
          style={styles.mainButton}
          textColor="#1E3A8A"
        >
          {showForm ? "Ocultar formulario" : "Agregar nueva tarea"}
        </Button>

        {showForm && (
          <View
            style={{ padding: 16, backgroundColor: "white", borderRadius: 8 }}
          >
            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="clipboard-text" />}
              theme={{
                colors: {
                  placeholder: "#999999", // Color del placeholder
                  text: "#000000", // Texto ingresado
                  primary: "#4669B4", // Borde y label cuando enfocado
                  onSurfaceVariant: "#666666", // Color del label cuando NO está enfocado
                },
              }}
            />
            <TextInput
              label="Horas"
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="clock-outline" />}
              theme={{
                colors: {
                  placeholder: "#999999", // Color del placeholder
                  text: "#000000", // Texto ingresado
                  primary: "#4669B4", // Borde y label cuando enfocado
                  onSurfaceVariant: "#666666", // Color del label cuando NO está enfocado
                },
              }}
            />
            <TextInput
              label="A cobrar"
              keyboardType="numeric"
              value={rate}
              onChangeText={setRate}
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="cash" />}
              theme={{
                colors: {
                  placeholder: "#999999", // Color del placeholder
                  text: "#000000", // Texto ingresado
                  primary: "#4669B4", // Borde y label cuando enfocado
                  onSurfaceVariant: "#666666", // Color del label cuando NO está enfocado
                },
              }}
            />
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#6200ee"
                style={{ marginTop: 10 }}
              />
            ) : (
              <Button
                mode="contained"
                onPress={handleSave}
                icon="plus"
                style={styles.saveButton}
                textColor="#ffffff"
              >
                Guardar Tarea
              </Button>
            )}
          </View>
        )}
        {/* LISTA VACÍA */}
        {tasks.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyEmoji}>📭</Text>

              <Text style={styles.emptyTitle}>
                No hay tareas registradas
              </Text>

              <Text style={styles.emptyText}>
                Agrega una nueva tarea para comenzar.
              </Text>
            </Card.Content>
          </Card>
        )}
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onDelete={() => deleteTask(index)}
          />
        ))}
      </ScrollView>
      <FAB
        icon="file-pdf-box"
        style={styles.fab}
        onPress={() => navigation.navigate("Generar PDF")}
        color="white"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
   header: {
    marginTop: 10,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 18,
    color: "#6d6c6c",
    marginBottom: 5,
  },
 saveButton: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#0e7433",
      paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
     fontWeight: "bold",
     marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#022267",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 18,
    color: "#6d6c6c",
  },
  texto: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#022267",
    padding: 10,
    textAlign: "right",
  },
  input: {
    height: 40,
    fontSize: 18,
    borderColor: "#F0FAFF",
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#F0FAFF",
    paddingLeft: 8,
  },
  taskContainer: { marginBottom: 10, padding: 10, borderWidth: 1 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    fontSize: 22,
    backgroundColor: "#022267",
    borderRadius: 20, // Añadido para redondear el botón, si no está ya redondeado
    width: 65, // Ajuste del tamaño para un FAB estándar
    height: 65, // Ajuste del tamaño para un FAB estándar
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Color de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    elevation: 8, // Elevación para Android
  },
  buttonStyle: {
    marginVertical: 5,
    fontSize: 22,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: "transparent",
    borderRadius: 20,
    backgroundColor: "#FFD95C", // Puedes cambiar el color del borde
    flexDirection: "row", // Alineación horizontal de ícono y texto
    justifyContent: "center", // Centra el contenido
    alignItems: "center", // Alinea verticalmente,
    fontWeight: "bold",
  },
  buttonAdd: {
    marginTop: 10,
    paddingVertical: 5,
    fontSize: 22,
    paddingHorizontal: 5,
    borderColor: "transparent",
    borderRadius: 20,
    backgroundColor: "#7ED6A5", // Puedes cambiar el color del borde
    flexDirection: "row", // Alineación horizontal de ícono y texto
    justifyContent: "center", // Centra el contenido
    alignItems: "center", // Alinea verticalmente
  },
   dateButton: {
    backgroundColor: "#002470",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 18,
     fontWeight: "bold",
  },

  mainButton: {
    borderRadius: 16,
    paddingVertical: 5,
    backgroundColor: "#FFD95C",
    marginBottom: 20,
    fontSize: 18,
     fontWeight: "bold",
  },
   emptyCard: {
    marginTop: 10,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  emptyEmoji: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#022267",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    color: "#666",
  },
  summaryCard: {
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    marginBottom: 20,
  },

  summaryLabel: {
    fontSize: 18,
    color: "#6d6c6c",
  },

  summaryAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#08a542",
    marginTop: 10,
  },

});
