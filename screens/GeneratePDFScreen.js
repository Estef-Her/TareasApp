import React, { useState } from "react";
import { View ,StyleSheet,Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { getTasksInRange } from "../utils/storage";
import * as Print from "expo-print";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function GeneratePDFScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const formatDate2 = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2,
    }).format(value);
  };
  const generatePDF = async () => {
    const start = formatDate2(startDate);
    const end = formatDate2(endDate);

    const tasks = await getTasksInRange(start, end);
    console.log(tasks);
    const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #1E0F00;
          }
          h1 {
            text-align: center;
            color: #C78A00;
          }
          p {
            font-size: 22px;
            margin-bottom: 20px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            display: flex; /* Usamos flexbox para que se pueda centrar */
            justify-content: space-between; /* Coloca los elementos al extremo */
            align-items: center; /* Centra los elementos verticalmente */
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          li:last-child {
            border-bottom: none;
          }
          .task-date {
            font-weight: bold;
            font-size: 20px;
          }
          .task-amount {
            color:#022267;
            font-weight: bold;
            font-size: 20px;
          }
          .task-total {
            color:green;
            font-weight: bold;
            font-size: 20px;
          }
          .task-desc {
            font-weight: bold;
            text-align: center; /* Centrado de la descripción */
            flex: 1; /* Esto hará que ocupe el espacio disponible */
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Tareas a facturar</h1>
        <p>Desde: <strong>${formatDate2(startDate)}</strong> &nbsp;&nbsp; Hasta: <strong>${formatDate2(endDate)}</strong></p>
        <ul>
          ${tasks.map(task => {
            const isoString = task.date
            .split('-')           // ["19","05","2025"]
            .reverse()            // ["2025","05","19"]
            .join('-')            // "2025-05-19"
            + 'T00:00:00';        // "2025-05-19T00:00:00"
            
            return `<li>
              <span class="task-date">${formatDate2(new Date(isoString))}</span>
              <span class="task-desc">${task.description}</span>
              <span class="task-amount">${formatCurrency(task.rate)}</span>
            </li>
          `;
        }).join('')}
        <li style="margin-top:10px; font-weight:bold;">
      <span class="task-date"></span>
      <span class="task-desc">Total</span>
      <span class="task-total">${formatCurrency(tasks.reduce((acc, task) => acc + task.rate, 0))}</span>
    </li>
        </ul>
      </body>
    </html>
  `;

    await Print.printAsync({ html: htmlContent });
  };

  return (
<View style={styles.container}>
  <Button
    onPress={() => setShowStartPicker(true)}
    textColor="#4669B4"
    mode="text" icon='calendar'
    style={styles.button}
  >
    Fecha Inicio: {formatDate2(startDate)}
  </Button>
  <Button
    onPress={() => setShowEndPicker(true)}
    textColor="#4669B4" icon='calendar'
    mode="text"
    style={styles.button}
  >
    Fecha Fin: {formatDate2(endDate)}
  </Button>

  {showStartPicker && (
    <DateTimePicker
      value={startDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'inline' : 'default'}
      onChange={(event, selectedDate) => {
        setShowStartPicker(false);
        if (selectedDate) setStartDate(selectedDate);
      }}
    />
  )}

  {showEndPicker && (
    <DateTimePicker
      value={endDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'inline' : 'default'}
      onChange={(event, selectedDate) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
      }}
    />
  )}

  <Button
    mode="contained"
    onPress={generatePDF}
    icon="file"
    style={styles.generateButton}
    textColor="#1E3A8A"
  >
    Generar PDF
  </Button>
</View>
  );
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        flex: 1 ,
      },
      button: {
        marginBottom: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
        elevation: 2,
        fontWeight:'bold',
        borderColor: '#4669B4',
        borderWidth: 1,
      },
      generateButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FFD95C',
        elevation: 4,
      },
  });
