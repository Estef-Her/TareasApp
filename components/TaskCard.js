import React from 'react';
import { Card, Text, Button } from 'react-native-paper';

export default function TaskCard({ task, onDelete }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2,
    }).format(value);
  };
  return (
    <Card style={{ marginVertical: 5,backgroundColor:'#FAF3E0',marginVertical:10}}>
      <Card.Content>
      <Text
      style={{
        position: 'absolute',
        top: 5,
        right: 10,
        fontSize: 12,
        color: '#888',
      }}
    >
      {task.date}
    </Text>
        <Text variant="titleMedium" style={{color:'#255957',fontSize:20,fontWeight:'bold'}}>{task.description}</Text>
        <Text variant="bodyMedium" style={{color:'black',fontSize:16}}>Horas: {task.hours}</Text>
        <Text variant="bodySmall" style={{color:'black',fontSize:16}}>Monto a cobrar: {formatCurrency(task.rate)}</Text>

        {onDelete && (
          <Button
            mode="text"
            onPress={onDelete}
            textColor="white"icon="delete"
            style={{
                marginTop: 10,
                width:'auto',
                backgroundColor: '#C95F4D',
                borderWidth: 1,
                borderRadius: 6,
                alignSelf: 'flex-end',
                paddingHorizontal: 10,
              }}
          >
            Eliminar
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}
