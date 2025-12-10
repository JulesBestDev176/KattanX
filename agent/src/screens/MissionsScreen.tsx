import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Mission, MissionStatus } from '../types';

interface MissionsScreenProps {
  onBack: () => void;
  agentPosition?: { latitude: number; longitude: number };
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ onBack, agentPosition }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [showReportInput, setShowReportInput] = useState(false);

  useEffect(() => {
    loadMockMissions();
  }, []);

  const loadMockMissions = () => {
    const mockMissions: Mission[] = [
      {
        id: 'm1',
        title: 'Sécurisation Événement Sportif',
        description: 'Assurer la sécurité périmétrique du stade lors du match de championnat. Fouiller les sacs à l\'entrée Nord.',
        priority: 'high',
        location: {
          latitude: 14.712,
          longitude: -17.467,
          address: 'Stade Leopold Sedar Senghor',
        },
        status: 'pending',
        objectives: [
          'Contrôler les accès tribune Nord',
          'Signaler tout objet suspect',
          'Maintenir l\'ordre dans la file d\'attente',
        ],
        createdAt: new Date().toISOString(),
        assignedBy: 'Commandant Faye',
      },
      {
        id: 'm2',
        title: 'Patrouille de Routine',
        description: 'Patrouille pédestre dans le secteur du marché pour prévenir les vols à la tire.',
        priority: 'medium',
        location: {
          latitude: 14.700,
          longitude: -17.450,
          address: 'Marché Sandaga',
        },
        status: 'pending',
        objectives: [
          'Effectuer 3 tours du marché',
          'Vérifier les fermetures des boutiques',
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        assignedBy: 'Dispatcher Central',
      },
      {
        id: 'm3',
        title: 'Assistance Circulation',
        description: 'Réguler le trafic au carrefour suite à une panne de feux.',
        priority: 'urgent',
        location: {
          latitude: 14.695,
          longitude: -17.460,
          address: 'Carrefour de la Médina',
        },
        status: 'in_progress',
        objectives: [
          'Fluidifier le trafic Nord-Sud',
          'Sécuriser la traversée des piétons',
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        assignedBy: 'Lieutenant Diop',
      },
      {
        id: 'm4',
        title: 'Surveillance Résidence',
        description: 'Surveillance discrète suite à des signalements de rôdeurs.',
        priority: 'low',
        location: {
          latitude: 14.720,
          longitude: -17.470,
          address: 'Fann Résidence',
        },
        status: 'completed',
        objectives: [
          'Noter les plaques des véhicules stationnés',
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        assignedBy: 'Dispatcher Central',
      },
    ];
    setMissions(mockMissions);
  };

  const getPriorityColor = (priority: Mission['priority']) => {
    switch (priority) {
      case 'urgent': return colors.destructive;
      case 'high': return '#f97316'; // Orange
      case 'medium': return '#fbbf24'; // Yellow
      case 'low': return '#3b82f6'; // Blue
      default: return colors.mutedForeground;
    }
  };

  const getStatusLabel = (status: MissionStatus) => {
    switch (status) {
      case 'pending': return 'EN ATTENTE';
      case 'accepted': return 'ACCEPTÉE';
      case 'in_progress': return 'EN COURS';
      case 'completed': return 'TERMINÉE';
    }
  };

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'pending': return colors.mutedForeground;
      case 'accepted': return '#3b82f6';
      case 'in_progress': return '#f97316';
      case 'completed': return colors.secondary;
    }
  };

  const handleUpdateStatus = (newStatus: MissionStatus) => {
    if (!selectedMission) return;

    if (newStatus === 'completed') {
      setShowReportInput(true);
      return;
    }

    updateMissionState(newStatus);
  };

  const submitReport = () => {
    if (!selectedMission) return;
    
    // Here we would actually save the report
    console.log('Report submitted for mission', selectedMission.id, reportText);
    
    updateMissionState('completed');
    setShowReportInput(false);
    setReportText('');
    Alert.alert('Mission Terminée', 'Votre rapport a été transmis au centre de commandement.');
  };

  const updateMissionState = (newStatus: MissionStatus) => {
    if (!selectedMission) return;

    const updatedMissions = missions.map(m => 
      m.id === selectedMission.id ? { ...m, status: newStatus } : m
    );
    setMissions(updatedMissions);
    setSelectedMission({ ...selectedMission, status: newStatus });
  };

  const renderStatusButton = () => {
    if (!selectedMission) return null;

    switch (selectedMission.status) {
      case 'pending':
        return (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateStatus('accepted')}
          >
            <Text style={styles.actionButtonText}>ACCEPTER LA MISSION</Text>
          </TouchableOpacity>
        );
      case 'accepted':
        return (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#f97316' }]}
            onPress={() => handleUpdateStatus('in_progress')}
          >
            <Ionicons name="location" size={20} color="white" style={{marginRight: 8}} />
            <Text style={styles.actionButtonText}>JE SUIS SUR PLACE</Text>
          </TouchableOpacity>
        );
      case 'in_progress':
        return (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => handleUpdateStatus('completed')}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" style={{marginRight: 8}} />
            <Text style={styles.actionButtonText}>TERMINER / RAPPORT</Text>
          </TouchableOpacity>
        );
      case 'completed':
        return (
          <View style={[styles.actionButton, { backgroundColor: colors.muted }]}>
            <Text style={styles.actionButtonText}>MISSION CLÔTURÉE</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Missions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Active / Pending Section */}
        <Text style={styles.sectionTitle}>En cours & En attente</Text>
        {missions.filter(m => m.status !== 'completed').map(mission => (
          <TouchableOpacity 
            key={mission.id} 
            style={styles.card}
            onPress={() => {
              setSelectedMission(mission);
              setShowDetailModal(true);
            }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(mission.priority) }]}>
                <Text style={styles.priorityText}>{mission.priority === 'urgent' ? 'URGENT' : mission.priority.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { borderColor: getStatusColor(mission.status) }]}>
                 <Text style={[styles.statusText, { color: getStatusColor(mission.status) }]}>{getStatusLabel(mission.status)}</Text>
              </View>
            </View>
            
            <Text style={styles.cardTitle}>{mission.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{mission.description}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
                <Text style={styles.locationText}>{mission.location.address}</Text>
              </View>
              <Text style={styles.timeText}>
                {new Date(mission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Completed Section */ }
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Historique Récent</Text>
        {missions.filter(m => m.status === 'completed').map(mission => (
          <TouchableOpacity 
            key={mission.id} 
            style={[styles.card, { opacity: 0.7 }]}
             onPress={() => {
              setSelectedMission(mission);
              setShowDetailModal(true);
             }}
          >
             <View style={styles.cardHeader}>
                <Text style={[styles.completedText, { color: colors.secondary }]}>TERMINÉE</Text>
                <Text style={styles.timeText}>
                    {new Date(mission.createdAt).toLocaleDateString()}
                </Text>
             </View>
             <Text style={styles.cardTitle}>{mission.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mission Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMission && (
              <>
                <View style={styles.modalHeader}>
                   <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color={colors.foreground} />
                   </TouchableOpacity>
                   <Text style={styles.modalType}>DÉTAILS MISSION</Text>
                   <View style={{width: 24}} />
                </View>

                <ScrollView style={styles.modalBody}>
                   <Text style={styles.detailTitle}>{selectedMission.title}</Text>
                   
                   <View style={styles.badgesRow}>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedMission.priority) }]}>
                        <Text style={styles.priorityText}>{selectedMission.priority.toUpperCase()}</Text>
                      </View>
                      <View style={[styles.statusBadge, { borderColor: getStatusColor(selectedMission.status), borderWidth: 1 }]}>
                         <Text style={[styles.statusText, { color: getStatusColor(selectedMission.status) }]}>{getStatusLabel(selectedMission.status)}</Text>
                      </View>
                   </View>

                   <View style={styles.infoRow}>
                      <Ionicons name="person" size={20} color={colors.mutedForeground} />
                      <Text style={styles.infoText}>Assignée par: <Text style={{fontWeight: '600'}}>{selectedMission.assignedBy}</Text></Text>
                   </View>

                   <View style={styles.infoRow}>
                      <Ionicons name="location" size={20} color={colors.mutedForeground} />
                      <Text style={styles.infoText}>{selectedMission.location.address}</Text>
                   </View>

                   <View style={styles.divider} />

                   <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                   <Text style={styles.bodyText}>{selectedMission.description}</Text>

                   <Text style={styles.sectionLabel}>OBJECTIFS</Text>
                   {selectedMission.objectives.map((obj, i) => (
                      <View key={i} style={styles.objectiveRow}>
                         <View style={styles.bullet} />
                         <Text style={styles.bodyText}>{obj}</Text>
                      </View>
                   ))}

                   {/* Report Input Section */}
                   {showReportInput && (
                      <View style={styles.reportSection}>
                         <Text style={styles.reportLabel}>Rapport de Mission</Text>
                         <TextInput
                            style={styles.reportInput}
                            multiline
                            placeholder="Décrivez le déroulement et l'issue de la mission..."
                            value={reportText}
                            onChangeText={setReportText}
                         />
                         <TouchableOpacity 
                            style={styles.submitReportButton}
                            onPress={submitReport}
                         >
                            <Text style={styles.submitReportText}>SOUMETTRE LE RAPPORT</Text>
                         </TouchableOpacity>
                         <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowReportInput(false)}
                         >
                            <Text style={styles.cancelText}>Annuler</Text>
                         </TouchableOpacity>
                      </View>
                   )}
                </ScrollView>

                {!showReportInput && (
                   <View style={styles.modalFooter}>
                      {renderStatusButton()}
                   </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.mutedForeground,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  timeText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 4,
  },
  modalType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.mutedForeground,
    letterSpacing: 1,
  },
  modalBody: {
    padding: 24,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedForeground,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 15,
    color: colors.foreground,
    marginBottom: 24,
    lineHeight: 22,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 40,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Report Form
  reportSection: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reportLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  reportInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitReportButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReportText: {
    color: colors.white,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: colors.mutedForeground,
  },
});
