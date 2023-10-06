import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import ThreeScene from './screens/ThreeScene';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      <ThreeScene />
    </SafeAreaView>
  );
}
