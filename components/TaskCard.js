import React from 'react';
import { Card, Text, Button,Chip } from 'react-native-paper';
import { View, StyleSheet, Alert } from "react-native";

export default function TaskCard({ task, onDelete }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2,
    }).format(value);
  };
   const handleDelete = () => {
    Alert.alert(
      "Eliminar tarea",
      "¿Deseas eliminar esta tarea?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>📅 {task.date}</Text>
        </View>
        <Text variant="titleMedium" style={styles.title}>{task.description}</Text>
       {/* Información */}
        <View style={styles.infoContainer}>
          <Chip icon="clock-outline" style={styles.chip}>
            <Text style={styles.dateText}>{task.hours} horas</Text>
          </Chip>

          <Chip icon="cash" style={styles.moneyChip}>
            <Text style={styles.dateText}>{formatCurrency(task.rate)}</Text>
          </Chip>
        </View>

        {onDelete && (
          <Button
            mode="text"
            onPress={handleDelete}
            textColor="white"icon="delete"
            style={styles.deleteButton}
          >
            Eliminar
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}
const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    overflow: "hidden",
  },

  dateContainer: {
    alignItems: "flex-end",
    marginBottom: 5,
  },

  dateText: {
    fontSize: 15,
    color: "#393737",
    fontWeight: "600",
  },

  title: {
    color: "#022267",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 15,
  },

  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  chip: {
    backgroundColor: "#EAF4FF",
  },

  moneyChip: {
    backgroundColor: "#EAF4FF",
  },

  deleteButton: {
    alignSelf: "flex-end",
    borderRadius: 12,
    backgroundColor: "#D9534F",
    paddingHorizontal: 8,
    marginTop: 5,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});