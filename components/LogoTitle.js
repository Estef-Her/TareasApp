import React from 'react';
import { Image, View, Text } from 'react-native';

export default function LogoTitle() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('../assets/logo.png')}
        style={{ width: 30, height: 30, marginRight: 2 }}
        resizeMode="contain"
      />
            <Image
        source={require('../assets/title.png')}
        style={{ width: 150, height: 30, marginLeft: 0 }}
        resizeMode="contain"
      />
      {/* <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#003366' }}>
        Gestionate
      </Text> */}
    </View>
  );
}
