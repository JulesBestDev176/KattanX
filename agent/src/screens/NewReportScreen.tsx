import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ReportType } from '../types';

interface NewReportScreenProps {
    onBack: () => void;
}

export const NewReportScreen: React.FC<NewReportScreenProps> = ({ onBack }) => {
    const [selectedType, setSelectedType] = useState<ReportType | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

    const reportTypes = [
        { type: 'mission' as ReportType, label: 'Intervention', icon: 'shield-checkmark' as const, color: colors.primary },
        { type: 'verification' as ReportType, label: 'Vérification', icon: 'search' as const, color: '#10b981' },
        { type: 'alert' as ReportType, label: 'Alerte', icon: 'alert-circle' as const, color: colors.destructive },
        { type: 'judicial' as ReportType, label: 'Judiciaire', icon: 'hammer' as const, color: '#8b5cf6' },
        { type: 'bolo' as ReportType, label: 'BOLO', icon: 'eye' as const, color: '#f59e0b' },
    ];

    const priorities = [
        { value: 'low' as const, label: 'Faible', color: '#6b7280' },
        { value: 'medium' as const, label: 'Moyenne', color: '#f59e0b' },
        { value: 'high' as const, label: 'Haute', color: '#ef4444' },
        { value: 'urgent' as const, label: 'Urgente', color: '#dc2626' },
    ];

    const handleSubmit = () => {
        console.log('Nouveau rapport:', { selectedType, title, description, priority });
        onBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>Nouveau rapport</Text>
                            <Text style={styles.subtitle}>Remplissez les informations</Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                            <Ionicons name="checkmark" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Type de rapport *</Text>
                        <View style={styles.typeGrid}>
                            {reportTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.type}
                                    style={[
                                        styles.typeCard,
                                        selectedType === type.type && styles.typeCardSelected,
                                        selectedType === type.type && { borderColor: type.color },
                                    ]}
                                    onPress={() => setSelectedType(type.type)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                                        <Ionicons name={type.icon} size={20} color={colors.white} />
                                    </View>
                                    <Text style={styles.typeLabel}>{type.label}</Text>
                                    {selectedType === type.type && (
                                        <Ionicons name="checkmark-circle" size={20} color={type.color} style={styles.typeCheck} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Titre *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Contrôle de routine, Incident signalé..."
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor={colors.mutedForeground}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Priorité</Text>
                        <View style={styles.priorityRow}>
                            {priorities.map((p) => (
                                <TouchableOpacity
                                    key={p.value}
                                    style={[
                                        styles.priorityButton,
                                        priority === p.value && styles.priorityButtonActive,
                                        priority === p.value && { backgroundColor: p.color, borderColor: p.color },
                                    ]}
                                    onPress={() => setPriority(p.value)}
                                >
                                    <Text
                                        style={[
                                            styles.priorityButtonText,
                                            priority === p.value && styles.priorityButtonTextActive,
                                        ]}
                                    >
                                        {p.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Décrivez les détails de l'intervention, les faits observés, les actions entreprises..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor={colors.mutedForeground}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Médias (Photos, Vidéos)</Text>
                        <View style={styles.mediaButtons}>
                            <TouchableOpacity style={styles.mediaButton}>
                                <Ionicons name="camera" size={24} color={colors.primary} />
                                <Text style={styles.mediaButtonText}>Prendre une photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mediaButton}>
                                <Ionicons name="images" size={24} color={colors.primary} />
                                <Text style={styles.mediaButtonText}>Galerie</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personnes impliquées</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                            <Text style={styles.addButtonText}>Ajouter une personne</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Ionicons name="send" size={20} color={colors.white} />
                        <Text style={styles.submitButtonText}>Enregistrer le rapport</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    container: {
        flex: 1,
        backgroundColor: colors.muted,
    },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    saveButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        minWidth: '47%',
        position: 'relative',
    },
    typeCardSelected: {
        borderWidth: 2,
    },
    typeIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
        flex: 1,
    },
    typeCheck: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: colors.foreground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textArea: {
        minHeight: 120,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    priorityButtonActive: {
        borderWidth: 1,
    },
    priorityButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.foreground,
    },
    priorityButtonTextActive: {
        color: colors.white,
        fontWeight: '600',
    },
    mediaButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    mediaButton: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mediaButtonText: {
        fontSize: 13,
        color: colors.foreground,
        marginTop: 8,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    addButtonText: {
        fontSize: 15,
        color: colors.foreground,
        marginLeft: 12,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    bottomSpacer: {
        height: 20,
    },
});
