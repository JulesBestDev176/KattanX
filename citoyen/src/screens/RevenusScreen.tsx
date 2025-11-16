import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { API_BASE_URL } from '../utils/supabase';
import { Revenus } from '../types';
import { colors } from '../theme/colors';

interface RevenusScreenProps {
  accessToken: string;
  onBack: () => void;
}

export const RevenusScreen: React.FC<RevenusScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [revenus, setRevenus] = useState<Revenus>({ total: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'mobile_money' | 'bank'>('mobile_money');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    fetchRevenus();
  }, []);

  const fetchRevenus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/revenus`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRevenus(data);
      }
    } catch (error) {
      console.error('Error fetching revenus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);
    
    if (!amount || isNaN(transferAmount)) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (!accountNumber) {
      toast.error('Veuillez entrer un numéro de compte');
      return;
    }

    if (transferAmount > revenus.total) {
      toast.error('Solde insuffisant');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: transferAmount,
          method,
          accountNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRevenus({
          total: data.newBalance,
          transactions: [data.transaction, ...revenus.transactions],
        });
        setShowTransferDialog(false);
        setAmount('');
        setAccountNumber('');
        toast.success('Transfert effectué avec succès');
      } else {
        throw new Error(data.error || 'Erreur lors du transfert');
      }
    } catch (error: any) {
      console.error('Error processing transfer:', error);
      toast.error(error.message || 'Erreur lors du transfert');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Balance */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Revenus</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>
            {revenus.total.toLocaleString()} FCFA
          </Text>
          <Button
            title="Transférer"
            onPress={() => setShowTransferDialog(true)}
            disabled={revenus.total === 0}
            style={styles.transferButton}
            textStyle={styles.transferButtonText}
          />
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Historique des transactions</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : revenus.transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="cash-outline"
                size={64}
                color={colors.mutedForeground}
              />
              <Text style={styles.emptyText}>Aucune transaction</Text>
              <Text style={styles.emptySubtext}>
                Les revenus de vos alertes vérifiées apparaîtront ici
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {revenus.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionContent}>
                    <View
                      style={[
                        styles.transactionIcon,
                        transaction.type === 'gain'
                          ? styles.transactionIconGain
                          : styles.transactionIconRetrait,
                      ]}
                    >
                      <Ionicons
                        name={
                          transaction.type === 'gain'
                            ? 'arrow-down'
                            : 'arrow-up'
                        }
                        size={20}
                        color={
                          transaction.type === 'gain'
                            ? colors.secondary
                            : colors.foreground
                        }
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>
                        {transaction.type === 'gain' ? 'Gain' : 'Retrait'}
                        {transaction.method &&
                          ` - ${
                            transaction.method === 'mobile_money'
                              ? 'Mobile Money'
                              : 'Banque'
                          }`}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          transaction.type === 'gain' &&
                            styles.transactionAmountGain,
                        ]}
                      >
                        {transaction.type === 'gain' ? '+' : '-'}
                        {transaction.amount.toLocaleString()} FCFA
                      </Text>
                      <Text style={styles.transactionStatus}>
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Transfer Modal */}
      <Modal
        visible={showTransferDialog}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransferDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transférer les fonds</Text>
              <TouchableOpacity onPress={() => setShowTransferDialog(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Montant"
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
              />
              <Text style={styles.availableText}>
                Disponible: {revenus.total.toLocaleString()} FCFA
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Méthode de transfert</Text>
                <View style={styles.methodButtons}>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      method === 'mobile_money' && styles.methodButtonActive,
                    ]}
                    onPress={() => setMethod('mobile_money')}
                  >
                    <Ionicons
                      name="phone-portrait"
                      size={20}
                      color={
                        method === 'mobile_money'
                          ? colors.white
                          : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        method === 'mobile_money' &&
                          styles.methodButtonTextActive,
                      ]}
                    >
                      Mobile Money
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      method === 'bank' && styles.methodButtonActive,
                    ]}
                    onPress={() => setMethod('bank')}
                  >
                    <Ionicons
                      name="business"
                      size={20}
                      color={
                        method === 'bank' ? colors.white : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        method === 'bank' && styles.methodButtonTextActive,
                      ]}
                    >
                      Banque
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Input
                label={
                  method === 'mobile_money'
                    ? 'Numéro de téléphone'
                    : 'Numéro de compte'
                }
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder={
                  method === 'mobile_money'
                    ? '+221 XX XXX XX XX'
                    : 'Numéro de compte bancaire'
                }
                keyboardType={method === 'mobile_money' ? 'phone-pad' : 'default'}
              />

              <Button
                title={
                  submitting ? 'Transfert en cours...' : 'Confirmer le transfert'
                }
                onPress={handleTransfer}
                disabled={submitting}
                loading={submitting}
                style={styles.submitButton}
              />
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
    backdropFilter: 'blur(10px)',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  transferButton: {
    backgroundColor: colors.white,
  },
  transferButtonText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  list: {
    gap: 12,
  },
  transactionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconGain: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  transactionIconRetrait: {
    backgroundColor: colors.muted,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  transactionAmountGain: {
    color: colors.secondary,
  },
  transactionStatus: {
    fontSize: 12,
    color: colors.mutedForeground,
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
  availableText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: -8,
    marginBottom: 16,
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
  methodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  methodButtonTextActive: {
    color: colors.white,
  },
  submitButton: {
    marginTop: 8,
  },
});



