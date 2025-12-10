import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { Plainte } from '../types';
import { colors } from '../theme/colors';

interface PlaintesScreenProps {
  accessToken: string;
  onBack: () => void;
}

export const PlaintesScreen: React.FC<PlaintesScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [plaintes, setPlaintes] = useState<Plainte[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* Form State */
  const [objet, setObjet] = useState('');
  const [description, setDescription] = useState('');
  const [commissariat, setCommissariat] = useState('');

  /* Voice Recording State */
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = React.useRef<NodeJS.Timeout | null>(null);

  /* AI Analysis State */
  const [analyzing, setAnalyzing] = useState(false);
  
  /* Commissariat Selection State */
  const [showCommissariatModal, setShowCommissariatModal] = useState(false);
  const [selectedPlainte, setSelectedPlainte] = useState<Plainte | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter State */
  const [filterType, setFilterType] = useState<'toutes' | 'reçue' | 'déposée' | 'convocation'>('toutes');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'En cours' | 'Résolue' | 'Convoqué'>('tous');
  
  const MOCK_COMMISSARIATS = [
    'Commissariat Central de Dakar',
    'Commissariat de Police de Dieuppeul',
    'Commissariat de Police de Grand Yoff',
    'Commissariat de Police de Parcelles Assainies',
    'Commissariat de Police de Pikine',
    'Commissariat de Police de Guédiawaye',
    'Commissariat de Police de Rufisque',
    'Gendarmerie de Ouakam',
    'Gendarmerie de Thiaroye',
  ];

  const filteredCommissariats = MOCK_COMMISSARIATS.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadMockPlaintes();
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  /* Audio Recording Functions */
  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        const response = await requestPermission();
        if (response.status !== 'granted') return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      toast.error('Impossible de démarrer l\'enregistrement');
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) return;

    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    setRecording(null);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri);
    
    // Trigger AI Analysis automatically
    analyzeAudioContent(uri);
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const analyzeAudioContent = (uri: string | null) => {
    if (!uri) return;
    
    setAnalyzing(true);
    toast.info("Analyse IA de l'audio en cours...");
    
    // Simuler une analyse IA
    setTimeout(() => {
      setObjet("Agression à l'arraché");
      setDescription(
        "Je marchais sur l'allée principale quand un individu en scooter a arraché mon sac. " +
        "Le scooter était de couleur noire, sans plaque immatriculation visible. " +
        "L'incident s'est produit vers 19h30 près de la pharmacie."
      );
      setAnalyzing(false);
      toast.success("Formulaire pré-rempli par l'IA !");
    }, 2000);
  };

  const handleUseLocation = () => {
    // Simuler la géolocalisation
    toast.info("Recherche du commissariat le plus proche...");
    setTimeout(() => {
      setCommissariat("Commissariat de Police de Dieuppeul (Proche de votre position)");
      setShowCommissariatModal(false);
      toast.success("Commissariat localisé !");
    }, 1500);
  };

  const loadMockPlaintes = () => {
    // Simuler un chargement
    setTimeout(() => {
      const mockPlaintes: Plainte[] = [
        {
          id: 'PL-2024-001',
          type: 'reçue',
          objet: 'Tapage nocturne',
          description: 'Plainte pour tapage nocturne répété au quartier Liberté 6.',
          commissariat: 'Commissariat de Dieuppeul',
          status: 'En cours',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // Il y a 2 jours
          amende: 50000,
        },
        {
          id: 'PL-2024-045',
          type: 'déposée',
          objet: 'Vol de téléphone',
          description: 'Vol à l\'arraché sur la corniche Ouest vers 18h.',
          commissariat: 'Commissariat Central',
          status: 'Enregistrée',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // Il y a 5 jours
        },
        {
          id: 'CV-2024-012',
          type: 'convocation',
          objet: 'Audition Témoin',
          description: 'Vous êtes convoqué pour une audition en tant que témoin dans l\'affaire du vol de scooter.',
          commissariat: 'Commissariat Central de Dakar',
          status: 'Convoqué',
          createdAt: new Date(Date.now() + 86400000 * 2).toISOString(), // Dans 2 jours (futur)
        },
        {
          id: 'PL-2024-089',
          type: 'reçue',
          objet: 'Stationnement interdit',
          description: 'Véhicule mal stationné gênant la circulation.',
          commissariat: 'Commissariat du Point E',
          status: 'Résolue',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // Il y a 10 jours
          amende: 15000,
        },
      ];
      setPlaintes(mockPlaintes);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    // Allow submission if description OR recordedUri is present
    if (!objet || (!description && !recordedUri)) {
      toast.error('Veuillez fournir un objet et une description ou un message vocal');
      return;
    }

    setSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
        const newPlainte: Plainte = {
          id: `PL-2024-${Math.floor(Math.random() * 1000)}`,
          type: 'déposée',
          objet,
          description: description + (recordedUri ? '\n(Message vocal joint)' : ''),
          commissariat: commissariat || 'Commissariat le plus proche (Auto)',
          status: 'Enregistrée',
          createdAt: new Date().toISOString(),
        };

        setPlaintes([newPlainte, ...plaintes]);
        setShowForm(false);
        setObjet('');
        setDescription('');
        setCommissariat('');
        setRecordedUri(null);
        setSubmitting(false);
        toast.success('Plainte déposée avec succès');
    }, 1500);
  };

  const filteredPlaintes = plaintes.filter(p => {
    if (filterType !== 'toutes' && p.type !== filterType) return false;
    if (filterStatus !== 'tous' && p.status !== filterStatus) return false; 
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Plaintes</Text>
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {['toutes', 'reçue', 'déposée', 'convocation'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.filterChip,
                filterType === t && styles.filterChipSelected,
                t === 'reçue' && filterType === t && { backgroundColor: colors.destructive },
                t === 'déposée' && filterType === t && { backgroundColor: colors.primary },
                t === 'convocation' && filterType === t && { backgroundColor: '#f59e0b' }
              ]}
              onPress={() => setFilterType(t as any)}
            >
              <Text style={[
                styles.filterChipText, 
                filterType === t && styles.filterChipTextSelected
              ]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.verticalDivider} />
          {['tous', 'En cours', 'Résolue', 'Convoqué'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.filterChip,
                filterStatus === s && styles.filterChipSelected,
                filterStatus === s && { backgroundColor: colors.secondary }
              ]}
              onPress={() => setFilterStatus(s as any)}
            >
              <Text style={[
                styles.filterChipText, 
                filterStatus === s && styles.filterChipTextSelected
              ]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : filteredPlaintes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.mutedForeground}
            />
            <Text style={styles.emptyText}>Aucune plainte trouvée</Text>
            <Text style={styles.emptySubtext}>
               Essayez de modifier vos filtres
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredPlaintes.map((plainte) => (
              <TouchableOpacity
                key={plainte.id}
                onPress={() => setSelectedPlainte(plainte)}
                activeOpacity={0.7}
                style={[
                  styles.card,
                  plainte.type === 'reçue' && styles.cardReceived,
                  plainte.type === 'convocation' && styles.cardConvocation,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    {plainte.type === 'reçue' && (
                      <Ionicons
                        name="alert-circle"
                        size={20}
                        color={colors.destructive}
                        style={styles.alertIcon}
                      />
                    )}
                    {plainte.type === 'convocation' && (
                      <Ionicons
                        name="calendar"
                        size={20}
                        color="#f59e0b"
                        style={styles.alertIcon}
                      />
                    )}
                    <View>
                      <Text style={styles.cardTitle}>{plainte.objet}</Text>
                      <Text style={styles.cardId}>{plainte.id}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          plainte.type === 'reçue'
                            ? colors.destructive
                            : plainte.type === 'convocation'
                            ? '#f59e0b'
                            : colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>
                       {plainte.type === 'reçue' ? 'Reçue' : plainte.type === 'convocation' ? 'Convocation' : 'Déposée'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{plainte.description}</Text>
                
                {/* Note: In a real app we'd show a player here if there was audio */}

                {plainte.commissariat && (
                  <Text style={styles.cardCommissariat}>
                    Commissariat: {plainte.commissariat}
                  </Text>
                )}

                {plainte.amende && (
                  <View style={styles.amendeContainer}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={colors.destructive}
                    />
                    <Text style={styles.amendeText}>
                      Amende: {plainte.amende.toLocaleString()} FCFA
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>
                    {new Date(plainte.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                  <Text style={[
                      styles.cardStatus,
                      { color: plainte.status === 'Résolue' ? colors.secondary : colors.mutedForeground }
                  ]}>{plainte.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Déposer une plainte</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
                            {/* Voice Recording Section */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Message Vocal (IA Analyse)</Text>
                <View style={[styles.recorderContainer, analyzing && styles.analyzingContainer]}>
                  {recordedUri ? (
                    <View style={styles.playbackContainer}>
                       <View style={styles.playbackInfo}>
                         <Ionicons name="mic" size={24} color={colors.primary} />
                         <View>
                           <Text style={styles.playbackText}>Message enregistré</Text>
                           <Text style={styles.aiBadgeText}>✓ Analysé par IA</Text>
                         </View>
                       </View>
                       <TouchableOpacity onPress={() => {
                         setRecordedUri(null);
                         // Optional: Clear AI filled data if deleting?
                       }} style={styles.deleteButton}>
                         <Ionicons name="trash-outline" size={24} color={colors.destructive} />
                       </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.recordButton,
                          isRecording ? styles.recordingButton : styles.idleButton
                        ]}
                        onPress={isRecording ? stopRecording : startRecording}
                        disabled={analyzing}
                      >
                         {analyzing ? (
                           <ActivityIndicator color={colors.white} />
                         ) : (
                           <Ionicons 
                             name={isRecording ? "stop" : "mic"} 
                             size={32} 
                             color={colors.white} 
                           />
                         )}
                      </TouchableOpacity>
                      <Text style={[
                        styles.recordingStatusText,
                        { color: isRecording ? colors.destructive : colors.mutedForeground }
                      ]}>
                        {analyzing 
                          ? 'IA analyse votre récit...' 
                          : isRecording 
                            ? `Enregistrement en cours (${formatDuration(recordingDuration)})...` 
                            : 'Appuyez pour décrire les faits (IA)'}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <Input
                label="Objet de la plainte"
                value={objet}
                onChangeText={setObjet}
                placeholder="Ex: Vol, Agression, Escroquerie..."
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Décrivez les faits en détail ou utilisez le micro..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Commissariat</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowCommissariatModal(true)}
                >
                  <Text style={[
                    styles.selectButtonText,
                    !commissariat && styles.placeholderText
                  ]}>
                    {commissariat || "Choisir un commissariat"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              <Button
                title={submitting ? 'Dépôt en cours...' : 'Déposer la plainte'}
                onPress={handleSubmit}
                disabled={submitting}
                loading={submitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        visible={!!selectedPlainte}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPlainte(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Détails</Text>
              <TouchableOpacity onPress={() => setSelectedPlainte(null)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {selectedPlainte && (
                <>
                  <View style={styles.detailsHeader}>
                    <View style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          selectedPlainte.type === 'reçue'
                            ? colors.destructive
                            : selectedPlainte.type === 'convocation'
                            ? '#f59e0b'
                            : colors.primary,
                        alignSelf: 'flex-start',
                        marginBottom: 12,
                      },
                    ]}>
                      <Text style={styles.typeBadgeText}>
                         {selectedPlainte.type === 'reçue' ? 'Reçue' : selectedPlainte.type === 'convocation' ? 'Convocation' : 'Déposée'}
                      </Text>
                    </View>
                    <Text style={styles.detailsTitle}>{selectedPlainte.objet}</Text>
                    <Text style={styles.detailsDate}>
                      {new Date(selectedPlainte.createdAt).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsLabel}>Description</Text>
                    <Text style={styles.detailsText}>{selectedPlainte.description}</Text>
                  </View>

                  {/* Mock Audio Player if implicit */}
                  {selectedPlainte.description.includes('(Message vocal joint)') && (
                     <View style={styles.audioPlayerPlaceholder}>
                        <Ionicons name="play-circle" size={48} color={colors.primary} />
                        <View style={styles.audioTrack}>
                          <View style={styles.audioProgress} />
                        </View>
                        <Text style={styles.audioTime}>0:45</Text>
                     </View>
                  )}

                  <View style={styles.divider} />

                  <View style={styles.detailsSection}>
                     <View style={styles.detailRow}>
                       <Ionicons name="business-outline" size={20} color={colors.mutedForeground} />
                       <Text style={styles.detailRowText}>{selectedPlainte.commissariat || "Non spécifié"}</Text>
                     </View>
                     
                     <View style={styles.detailRow}>
                       <Ionicons 
                         name={selectedPlainte.status === 'Résolue' ? "checkmark-circle" : "time-outline"} 
                         size={20} 
                         color={selectedPlainte.status === 'Résolue' ? colors.secondary : colors.mutedForeground} 
                       />
                       <Text style={[
                         styles.detailRowText,
                         { fontWeight: '600', color: selectedPlainte.status === 'Résolue' ? colors.secondary : colors.foreground }
                       ]}>Statut: {selectedPlainte.status}</Text>
                     </View>

                     {selectedPlainte.amende && (
                        <View style={styles.detailRow}>
                          <Ionicons name="cash-outline" size={20} color={colors.destructive} />
                          <Text style={[styles.detailRowText, { color: colors.destructive, fontWeight: 'bold' }]}>
                            Amende: {selectedPlainte.amende.toLocaleString()} FCFA
                          </Text>
                        </View>
                     )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Commissariat Selection Modal */}
      <Modal
        visible={showCommissariatModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCommissariatModal(false)}
      >
        <View style={styles.searchModalContainer}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchTitle}>Choisir un commissariat</Text>
            <TouchableOpacity onPress={() => setShowCommissariatModal(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBody}>
            <View style={styles.searchBar}>
               <Ionicons name="search" size={20} color={colors.mutedForeground} />
               <TextInput
                 style={styles.searchInput}
                 placeholder="Rechercher..."
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoFocus
               />
            </View>

            <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
               <View style={styles.locationIconBg}>
                  <Ionicons name="location" size={20} color={colors.primary} />
               </View>
               <View>
                 <Text style={styles.locationButtonText}>Ma position actuelle</Text>
                 <Text style={styles.locationButtonSubtext}>Trouver le plus proche</Text>
               </View>
            </TouchableOpacity>

            <ScrollView style={styles.resultsList}>
              {filteredCommissariats.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => {
                    setCommissariat(item);
                    setShowCommissariatModal(false);
                  }}
                >
                  <Ionicons name="business-outline" size={20} color={colors.mutedForeground} style={{marginRight: 12}} />
                  <Text style={styles.resultItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
              {filteredCommissariats.length === 0 && (
                <Text style={styles.noResultsText}>Aucun commissariat trouvé</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  filterChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.mutedForeground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  list: {
    gap: 16,
  },
  card: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardReceived: {
    borderColor: colors.destructive,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  cardConvocation: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  cardId: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  cardCommissariat: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  amendeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amendeText: {
    fontSize: 14,
    color: colors.destructive,
    marginLeft: 4,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 6,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    minHeight: 100,
  },
  helperText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: -8,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 40,
  },
  recorderContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  analyzingContainer: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: colors.destructive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: colors.destructive,
  },
  idleButton: {
    backgroundColor: colors.primary,
  },
  recordingStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  playbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    justifyContent: 'space-between',
  },
  playbackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  playbackText: {
    fontWeight: '500',
    color: colors.foreground,
  },
  aiBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.foreground,
  },
  placeholderText: {
    color: colors.mutedForeground,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  searchBody: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
    marginBottom: 24,
  },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  locationButtonSubtext: {
    fontSize: 12,
    color: colors.primary,
    opacity: 0.8,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultItemText: {
    fontSize: 16,
    color: colors.foreground,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.mutedForeground,
  },
  detailsHeader: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8,
  },
  detailsDate: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailRowText: {
    fontSize: 16,
    color: colors.foreground,
    flex: 1,
  },
  audioPlayerPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    marginTop: 8,
  },
  audioTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  audioProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  audioTime: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
});
