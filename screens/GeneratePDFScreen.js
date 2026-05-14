import React, { useState } from "react";
import { View, StyleSheet, Platform, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
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
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const generatePDF = async () => {
    const start = formatDate2(startDate);
    const end = formatDate2(endDate);

    const tasks = await getTasksInRange(start, end);

    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #F4F7FB;
              padding: 25px;
              color: #1E293B;
            }

            .container {
              background-color: white;
              border-radius: 18px;
              padding: 25px;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
              border-bottom: 3px solid #022267;
              padding-bottom: 15px;
            }

            .title {
              font-size: 34px;
              font-weight: bold;
              color: #022267;
              margin: 0;
            }

            .subtitle {
              margin-top: 10px;
              font-size: 18px;
              color: #64748B;
            }

            .summary {
              background-color: #EEF4FF;
              border-radius: 14px;
              padding: 18px;
              margin-bottom: 25px;
            }

            .summary-row {
              margin-bottom: 8px;
              font-size: 18px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            thead {
              background-color: #022267;
              color: white;
            }

            th {
              padding: 14px;
              font-size: 18px;
              text-align: left;
            }

            td {
              padding: 14px;
              font-size: 16px;
              border-bottom: 1px solid #E2E8F0;
            }

            tr:nth-child(even) {
              background-color: #F8FAFC;
            }

            .amount {
              color: #0F766E;
              font-weight: bold;
            }

            .hours {
              color: #334155;
              font-weight: bold;
            }

            .description {
              font-weight: 600;
              color: #1E293B;
            }

            .total-section {
              margin-top: 25px;
              background-color: #022267;
              color: white;
              border-radius: 14px;
              padding: 18px;
              text-align: right;
            }

            .total-label {
              font-size: 20px;
              font-weight: bold;
            }

            .total-value {
              font-size: 30px;
              font-weight: bold;
              margin-top: 5px;
            }

            .footer {
              margin-top: 30px;
              text-align: center;
              color: #94A3B8;
              font-size: 14px;
            }
          </style>
        </head>

        <body>
          <div class="container">

            <div class="header">
              <h1 class="title">Gestión de Tareas</h1>

              <div class="subtitle">
                Reporte de tareas facturables
              </div>
            </div>

            <div class="summary">
              <div class="summary-row">
                📅 Desde: <strong>${formatDate2(startDate)}</strong>
              </div>

              <div class="summary-row">
                📅 Hasta: <strong>${formatDate2(endDate)}</strong>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Horas</th>
                  <th>Monto</th>
                </tr>
              </thead>

              <tbody>
                ${tasks
                  .map((task) => {
                    const isoString =
                      task.date
                        .split("-")
                        .reverse()
                        .join("-") + "T00:00:00";

                    return `
                      <tr>
                        <td>
                          ${formatDate2(new Date(isoString))}
                        </td>

                        <td class="description">
                          ${task.description}
                        </td>

                        <td class="hours">
                          ${task.hours || 0} h
                        </td>

                        <td class="amount">
                          ${formatCurrency(task.rate)}
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-label">
                Total generado
              </div>

              <div class="total-value">
                ${formatCurrency(
                  tasks.reduce((acc, task) => acc + (task.rate || 0), 0)
                )}
              </div>
            </div>

            <div class="footer">
              Generado automáticamente por Gestionate
            </div>

          </div>
        </body>
      </html>
    `;

    await Print.printAsync({
      html: htmlContent,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.screen}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Generar reporte PDF
        </Text>

        <Text style={styles.subtitle}>
          Selecciona un rango de fechas para generar el reporte.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Selección de fechas
          </Text>
          <Button
            mode="contained-tonal"
            onPress={() => setShowStartPicker(true)}
            style={styles.dateButton}
            contentStyle={styles.dateButtonContent}
            labelStyle={styles.dateButtonLabel}
          >
            📅 Desde: {formatDate2(startDate)}
          </Button>

          <Button
            mode="contained-tonal"
            onPress={() => setShowEndPicker(true)}
            style={styles.dateButton}
            contentStyle={styles.dateButtonContent}
            labelStyle={styles.dateButtonLabel}
          >
            📅 Hasta: {formatDate2(endDate)}
          </Button>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);

              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);

              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        <Button
          mode="contained"
          icon="file-pdf-box"
          onPress={generatePDF}
          style={styles.generateButton}
          contentStyle={styles.generateButtonContent}
          labelStyle={styles.generateButtonLabel}
        >
          Generar PDF
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },

  container: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#022267",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  dateButton: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
  },

  dateButtonContent: {
    paddingVertical: 10,
  },

  dateButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#022267",
  },

  summaryCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#FFD95C",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#022267",
    marginBottom: 12,
  },

  summaryText: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 6,
  },

  generateButton: {
    marginTop: 30,
    borderRadius: 18,
    backgroundColor: "#FFD95C",
    elevation: 4,
  },

  generateButtonContent: {
    paddingVertical: 10,
  },

  generateButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#022267",
  },
});