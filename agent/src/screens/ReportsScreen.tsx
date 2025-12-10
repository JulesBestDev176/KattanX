import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Report, ReportType, Screen } from '../types';

const { width } = Dimensions.get('window');

interface ReportsScreenProps {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}

interface ReportTypeCard {
    type: ReportType;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    description: string;
    count: number;
    screen?: Screen;
}

const MOCK_STATS = {
    totalReports: 42,
    pendingValidation: 5,
    validatedThisMonth: 18,
    archivedReports: 19,
};

const MOCK_RECENT_REPORTS: Partial<Report>[] = [
    {
        id: '1',
        type: 'mission',
        status: 'validated',
        createdByName: 'Agent Kismart',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        type: 'verification',
        status: 'pending',
        createdByName: 'Agent Kismart',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        type: 'alert',
        status: 'validated',
        createdByName: 'Agent Kismart',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ onBack, onNavigate }) => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'validated'>('all');

    const handleReportTypePress = (reportType: ReportTypeCard) => {
        if (reportType.screen) {
            onNavigate(reportType.screen);
        }
    };

    const reportTypes: ReportTypeCard[] = [
        {
            type: 'mission',
            icon: 'shield-checkmark',
            label: 'Interventions',
            color: colors.primary,
            description: 'Missions et actions effectuées',
            count: 15,
            screen: 'verification',
        },
        {
            type: 'verification',
            icon: 'search',
            label: 'Vérifications',
            color: '#10b981',
            description: 'Contrôles CNI effectués',
            count: 12,
            screen: 'verification',
        },
        {
            type: 'alert',
            icon: 'alert-circle',
            label: 'Alertes',
            color: colors.destructive,
            description: 'Alertes créées et suivi',
            count: 8,
            screen: 'alerts',
        },
        {
            type: 'judicial',
            icon: 'hammer',
            label: 'Judiciaires',
            color: '#8b5cf6',
            description: 'Plaintes et transferts',
            count: 5,
        },
        {
            type: 'bolo',
            icon: 'eye',
            label: 'BOLO',
            color: '#f59e0b',
            description: 'Recherches de personnes',
            count: 2,
            screen: 'alerts',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'validated':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'draft':
                return '#6b7280';
            case 'archived':
                return '#9ca3af';
            default:
                return colors.mutedForeground;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'validated':
                return 'Validé';
            case 'pending':
                return 'En attente';
            case 'draft':
                return 'Brouillon';
            case 'archived':
                return 'Archivé';
            default:
                return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'mission':
                return 'Intervention';
            case 'verification':
                return 'Vérification';
            case 'alert':
                return 'Alerte';
            case 'judicial':
                return 'Judiciaire';
            case 'bolo':
                return 'BOLO';
            default:
                return type;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `Il y a ${diffMinutes} min`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours}h`;
        } else if (diffDays === 1) {
            return 'Hier';
        } else {
            return `Il y a ${diffDays}j`;
        }
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
                            <Text style={styles.title}>Rapports & Reporting</Text>
                            <Text style={styles.subtitle}>Système intelligent de gestion</Text>
                        </View>
                        <TouchableOpacity style={styles.headerActionButton}>
                            <Ionicons name="filter" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Statistiques</Text>
                        <View style={styles.statsGrid}>
                            <View style={[styles.statCard, styles.statCardLarge]}>
                                <Ionicons name="documents" size={32} color={colors.primary} />
                                <Text style={styles.statValue}>{MOCK_STATS.totalReports}</Text>
                                <Text style={styles.statLabel}>Total rapports</Text>
                            </View>
                            <View style={styles.statsColumn}>
                                <View style={styles.statCardSmall}>
                                    <View style={styles.statSmallContent}>
                                        <Ionicons name="time" size={20} color="#f59e0b" />
                                        <Text style={styles.statValueSmall}>{MOCK_STATS.pendingValidation}</Text>
                                    </View>
                                    <Text style={styles.statLabelSmall}>En attente</Text>
                                </View>
                                <View style={styles.statCardSmall}>
                                    <View style={styles.statSmallContent}>
                                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                        <Text style={styles.statValueSmall}>{MOCK_STATS.validatedThisMonth}</Text>
                                    </View>
                                    <Text style={styles.statLabelSmall}>Ce mois</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Types de rapports</Text>
                        <View style={styles.reportTypesGrid}>
                            {reportTypes.map((reportType) => (
                                <TouchableOpacity
                                    key={reportType.type}
                                    style={styles.reportTypeCard}
                                    activeOpacity={0.7}
                                    onPress={() => handleReportTypePress(reportType)}
                                >
                                    <View style={[styles.reportTypeIcon, { backgroundColor: reportType.color }]}>
                                        <Ionicons name={reportType.icon} size={24} color={colors.white} />
                                    </View>
                                    <View style={styles.reportTypeInfo}>
                                        <Text style={styles.reportTypeLabel}>{reportType.label}</Text>
                                        <Text style={styles.reportTypeDescription}>{reportType.description}</Text>
                                    </View>
                                    <View style={styles.reportTypeCount}>
                                        <Text style={styles.reportTypeCountText}>{reportType.count}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Historique</Text>
                        <View style={styles.filterRow}>
                            <TouchableOpacity
                                style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
                                onPress={() => setSelectedFilter('all')}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedFilter === 'all' && styles.filterButtonTextActive,
                                    ]}
                                >
                                    Tous
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.filterButton,
                                    selectedFilter === 'pending' && styles.filterButtonActive,
                                ]}
                                onPress={() => setSelectedFilter('pending')}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedFilter === 'pending' && styles.filterButtonTextActive,
                                    ]}
                                >
                                    En attente
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.filterButton,
                                    selectedFilter === 'validated' && styles.filterButtonActive,
                                ]}
                                onPress={() => setSelectedFilter('validated')}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedFilter === 'validated' && styles.filterButtonTextActive,
                                    ]}
                                >
                                    Validés
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.reportsList}>
                            {MOCK_RECENT_REPORTS.map((report) => (
                                <TouchableOpacity key={report.id} style={styles.reportItem} activeOpacity={0.7}>
                                    <View style={styles.reportItemHeader}>
                                        <View style={styles.reportItemInfo}>
                                            <Text style={styles.reportItemType}>{getTypeLabel(report.type!)}</Text>
                                            <Text style={styles.reportItemId}>#{report.id}</Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.reportItemStatus,
                                                { backgroundColor: getStatusColor(report.status!) + '20' },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.reportItemStatusText,
                                                    { color: getStatusColor(report.status!) },
                                                ]}
                                            >
                                                {getStatusLabel(report.status!)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.reportItemFooter}>
                                        <View style={styles.reportItemMeta}>
                                            <Ionicons
                                                name="person-circle-outline"
                                                size={14}
                                                color={colors.mutedForeground}
                                            />
                                            <Text style={styles.reportItemMetaText}>{report.createdByName}</Text>
                                        </View>
                                        <View style={styles.reportItemMeta}>
                                            <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                                            <Text style={styles.reportItemMetaText}>
                                                {formatTimeAgo(report.createdAt!)}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {MOCK_RECENT_REPORTS.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={64} color={colors.mutedForeground} />
                            <Text style={styles.emptyStateText}>Aucun rapport disponible</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Commencez par créer votre premier rapport
                            </Text>
                        </View>
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => onNavigate('newReport')}>
                    <Ionicons name="add" size={28} color={colors.white} />
                    <Text style={styles.fabText}>Nouveau rapport</Text>
                </TouchableOpacity>
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
    headerActionButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statCardLarge: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    statsColumn: {
        flex: 1,
        gap: 12,
    },
    statCardSmall: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statSmallContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
    statValueSmall: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    statLabelSmall: {
        fontSize: 11,
        color: colors.mutedForeground,
    },
    reportTypesGrid: {
        gap: 12,
    },
    reportTypeCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
    },
    reportTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportTypeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    reportTypeLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 2,
    },
    reportTypeDescription: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    reportTypeCount: {
        backgroundColor: colors.muted,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    reportTypeCountText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.foreground,
    },
    filterButtonTextActive: {
        color: colors.white,
    },
    reportsList: {
        gap: 12,
    },
    reportItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    reportItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reportItemInfo: {
        flex: 1,
    },
    reportItemType: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 2,
    },
    reportItemId: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    reportItemStatus: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    reportItemStatusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    reportItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reportItemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reportItemMetaText: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginTop: 16,
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 13,
        color: colors.mutedForeground,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 28,
        paddingVertical: 14,
        paddingHorizontal: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        gap: 8,
    },
    fabText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
});
