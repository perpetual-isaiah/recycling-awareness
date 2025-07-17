import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';

export default function GuideScreen() {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialGuide, setMaterialGuide] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();
  const selectedMaterialKey = route.params?.material;

  const tagColors = {
    'Blue Bin': '#4da6ff',
    'Green Bin': '#33cc33',
    'Organic Bin': '#99cc33',
    'Brown Bin': '#a0522d',
    'Yellow Bin': '#f2c94c',
    'Red Bin': '#e74c3c',
    'Black Bin': '#333333',
    'Gray Bin': '#b0b0b0',
  };

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/guides`);
        const data = await response.json();
        setGuides(data);
        setFilteredGuides(data);

        if (selectedMaterialKey) {
          const match = data.find((g) => g.key === selectedMaterialKey);
          setMaterialGuide(match);
        }
      } catch (error) {
        console.error('Failed to fetch guides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [selectedMaterialKey]);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = guides.filter(
      (guide) =>
        guide.title.toLowerCase().includes(text.toLowerCase()) ||
        guide.category?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGuides(filtered);
  };

  const openModal = (guide) => {
    setSelectedGuide(guide);
    setModalVisible(true);
  };

  // Focused Single Material View
  if (selectedMaterialKey && materialGuide) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.greenTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          
          <Image source={require('../assets/earth.png')} style={styles.earthLogo} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.card}>
            {materialGuide.containerTag && (
              <View
                style={[
                  styles.containerTagBox,
                  { backgroundColor: tagColors[materialGuide.containerTag] || '#999' },
                ]}
              >
                <Text style={styles.containerTagText}>{materialGuide.containerTag}</Text>
              </View>
            )}

            {materialGuide.steps?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>How to Recycle {materialGuide.title}</Text>
                {materialGuide.steps.map((step, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={styles.benefitSection}>
              {materialGuide.environmentalImpact && (
                <>
                  <Text style={styles.benefitTitle}>1. Environmental Impact</Text>
                  <Text style={styles.benefitText}>{materialGuide.environmentalImpact}</Text>
                </>
              )}

              {materialGuide.economicImpact && (
                <>
                  <Text style={styles.benefitTitle}>2. Economic Efficiency</Text>
                  <Text style={styles.benefitText}>{materialGuide.economicImpact}</Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('GuideDetailScreen', { guide: materialGuide })}
            >
              <Text style={styles.ctaText}>View Guidelines</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Full List View
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>♻️ Recycling Guide</Text>

      <TextInput
        placeholder="Search by title or category..."
        style={styles.searchInput}
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00cc66" />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <TouchableOpacity
                key={guide._id || guide.id || guide.title}
                style={styles.cardItem}
                onPress={() => openModal(guide)}
              >
                <Text style={styles.icon}>{guide.icon || '📄'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heading}>{guide.title}</Text>
                  <Text style={styles.text} numberOfLines={2}>
                    {guide.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginTop: 20 }}>No guides found.</Text>
          )}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGuide && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedGuide.icon || '📄'} {selectedGuide.title}
                </Text>

                <Text style={styles.modalDescription}>{selectedGuide.description}</Text>

                {selectedGuide.steps?.length > 0 && (
                  <View style={styles.stepsSection}>
                    <Text style={styles.sectionHeading}>Steps:</Text>
                    {selectedGuide.steps.map((step, i) => (
                      <Text key={i} style={styles.stepText}>
                        {i + 1}. {step}
                      </Text>
                    ))}
                  </View>
                )}

                {selectedGuide.images?.length > 0 && (
                  <View style={styles.imageSection}>
                    <Text style={styles.sectionHeading}>Images:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {selectedGuide.images.map((img, i) => (
                        <View key={i} style={styles.imageWrapper}>
                          <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  container: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#15803d',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e6f7f2',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 4,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#444',
  },
  stepsSection: {
    width: '100%',
    marginTop: 10,
  },
  sectionHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  imageSection: {
    marginTop: 10,
    width: '100%',
  },
  imageWrapper: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  closeButton: {
    backgroundColor: '#15803d',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  // Focused View
  greenTop: {
    height: 300,
    backgroundColor: '#1A691A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    position: 'relative',
  },
  materialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
  },
  backArrow: {
    fontSize: 20,
    color: '#fff',
  },
 earthLogo: {
  width: 275,
  height: 265,
  resizeMode: 'contain',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [
    { translateX: -137.5 }, // Half of width
    { translateY: -132.5 }, // Half of height
  ],
},


  contentContainer: {
    flex: 1,
    marginTop: -30,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  benefitSection: {
    marginTop: 25,
  },
  benefitTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  benefitText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#15803d',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerTagBox: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  containerTagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
