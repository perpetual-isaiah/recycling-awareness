// screens/GuideDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function GuideDetailScreen({ route, navigation }) {
  const { guide } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{guide.icon || '♻️'} {guide.title}</Text>

      <Text style={styles.description}>{guide.description}</Text>

      {guide.images?.[0] && (
        <Image source={{ uri: guide.images[0] }} style={styles.image} />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FullGuide', { guide })}
      >
        <Text style={styles.buttonText}>View Guidelines</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1B5E20',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
