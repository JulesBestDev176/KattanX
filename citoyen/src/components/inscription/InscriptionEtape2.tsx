/**
 * Composant pour l'Étape 2 d'inscription
 * Authentification + OTP + Numéro Unique
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { colors } from '../../theme/colors';
import { apiService, InscriptionEtape2Data, InscriptionEtape2Response } from '../../utils/api';
import { toast } from '../ui/Toast';

interface InscriptionEtape2Props {
  sessionId: string;
  donneesEtape1: InscriptionEtape1Data;
  onNext: (data: InscriptionEtape2Data & { numero_unique?: string }, response: InscriptionEtape2Response) => void;
  onBack: () => void;
}

export const InscriptionEtape2: React.FC<InscriptionEtape2Props> = ({
  sessionId,
  donneesEtape1,
  onNext,
  onBack,
}) => {
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [codeOTP, setCodeOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpExpiration, setOtpExpiration] = useState<Date | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState(''); // Pour le mode démo

  const formatTelephone = (text: string): string => {
    // Nettoyer le texte
    const cleaned = text.replace(/\D/g, '');
    
    // Si commence par 221, ajouter le +
    if (cleaned.startsWith('221')) {
      return `+${cleaned}`;
    }
    // Si ne commence pas par +221, l'ajouter
    if (!cleaned.startsWith('221')) {
      return `+221${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const validateTelephone = (tel: string): boolean => {
    return /^\+221[0-9]{9}$/.test(tel);
  };

  const handleSendOTP = async () => {
    const formattedTel = formatTelephone(telephone);
    
    if (!validateTelephone(formattedTel)) {
      toast.error('Format de téléphone invalide. Attendu: +221XXXXXXXXX');
      return;
    }

    setSendingOTP(true);
    try {
      const response = await apiService.sendOTP(formattedTel);
      
      if (response.success) {
        setOtpSent(true);
        setTelephone(formattedTel);
        
        // Stocker l'expiration
        if (response.date_expiration) {
          setOtpExpiration(new Date(response.date_expiration));
        }
        
        // En mode développement, afficher le code
        if (response.code_otp) {
          setGeneratedOTP(response.code_otp);
        }
        
        toast.success('Code OTP envoyé par WhatsApp !');
      } else {
        toast.error(response.message || 'Erreur lors de l\'envoi de l\'OTP');
      }
    } catch (error: any) {
      console.error('Erreur envoi OTP:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de l\'OTP');
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!codeOTP || codeOTP.length !== 6) {
      toast.error('Le code OTP doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.verifyOTP(telephone, codeOTP);
      
      if (response.success) {
        setOtpVerified(true);
        toast.success('Code OTP validé !');
      } else {
        toast.error(response.message || 'Code OTP invalide');
      }
    } catch (error: any) {
      console.error('Erreur vérification OTP:', error);
      toast.error(error.message || 'Erreur lors de la vérification OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateTelephone(telephone)) {
      toast.error('Format de téléphone invalide');
      return;
    }
    if (!otpVerified) {
      toast.error('Veuillez d\'abord vérifier le code OTP');
      return;
    }
    if (!motDePasse || motDePasse.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (motDePasse !== confirmationMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const data: InscriptionEtape2Data = {
        telephone,
        email: email.trim() || undefined,
        motDePasse,
        confirmationMotDePasse,
        codeOTP,
        sessionId,
      };

      const response = await apiService.inscriptionEtape2(data);

      if (!response.success) {
        toast.error(response.message || 'Erreur lors de l\'étape 2');
        return;
      }

      // Afficher le numéro unique généré
      toast.success(`Numéro unique généré: ${response.numero_unique}`);
      
      // Mettre à jour les données étape 2 avec le numéro unique
      const updatedData = {
        ...data,
        numero_unique: response.numero_unique,
      };
      
      // Passer à l'étape suivante
      onNext(updatedData, response);
    } catch (error: any) {
      console.error('Erreur étape 2:', error);
      toast.error(error.message || 'Erreur lors de l\'étape 2');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Authentification</Text>
        <Text style={styles.subtitle}>Étape 2 sur 3</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Téléphone"
          value={telephone}
          onChangeText={setTelephone}
          placeholder="+221 XX XXX XX XX"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          editable={!otpSent}
        />

        <Input
          label="Email (optionnel)"
          value={email}
          onChangeText={setEmail}
          placeholder="votre@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />

        {otpSent && (
          <View style={styles.otpSection}>
            <View style={styles.otpInfo}>
              <MaterialIcons name="chat" size={24} color={colors.primary} />
              <Text style={styles.otpInfoText}>Code envoyé via WhatsApp à</Text>
              <Text style={styles.otpPhone}>{telephone}</Text>
              {generatedOTP && (
                <View style={styles.otpDemo}>
                  <Text style={styles.otpDemoLabel}>Code de démo :</Text>
                  <Text style={styles.otpDemoCode}>{generatedOTP}</Text>
                </View>
              )}
            </View>

            <Input
              label="Code OTP"
              value={codeOTP}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '');
                if (cleaned.length <= 6) {
                  setCodeOTP(cleaned);
                }
              }}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              editable={!otpVerified}
              style={styles.otpInput}
            />

            {!otpVerified && (
              <Button
                title={loading ? 'Vérification...' : 'Vérifier le code'}
                onPress={handleVerifyOTP}
                disabled={loading || codeOTP.length !== 6}
                loading={loading}
                style={styles.verifyButton}
              />
            )}

            {otpVerified && (
              <View style={styles.verifiedContainer}>
                <MaterialIcons name="check-circle" size={24} color={colors.success || '#10b981'} />
                <Text style={styles.verifiedText}>Code OTP validé</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSendOTP}
              style={styles.resendButton}
              disabled={sendingOTP}
            >
              <Text style={styles.resendText}>Renvoyer le code</Text>
            </TouchableOpacity>
          </View>
        )}

        {!otpSent && (
          <Button
            title={sendingOTP ? 'Envoi...' : 'Envoyer le code OTP'}
            onPress={handleSendOTP}
            disabled={sendingOTP || !validateTelephone(formatTelephone(telephone))}
            loading={sendingOTP}
            style={styles.sendOTPButton}
          />
        )}

        {otpVerified && (
          <>
            <Input
              label="Mot de passe"
              value={motDePasse}
              onChangeText={setMotDePasse}
              placeholder="Minimum 8 caractères"
              secureTextEntry
              autoComplete="password-new"
              textContentType="newPassword"
            />

            <Input
              label="Confirmation mot de passe"
              value={confirmationMotDePasse}
              onChangeText={setConfirmationMotDePasse}
              placeholder="Répétez le mot de passe"
              secureTextEntry
              autoComplete="password-new"
              textContentType="newPassword"
            />
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Retour"
          onPress={onBack}
          disabled={loading}
          style={[styles.button, styles.backButton]}
          variant="outline"
        />
        <Button
          title={loading ? 'Traitement...' : 'Suivant'}
          onPress={handleNext}
          disabled={loading || !otpVerified}
          loading={loading}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  form: {
    flex: 1,
  },
  otpSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  otpInfo: {
    backgroundColor: colors.muted,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  otpInfoText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  otpPhone: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 4,
  },
  otpDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  otpDemoLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginRight: 8,
  },
  otpDemoCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
  },
  otpInput: {
    fontSize: 20,
    letterSpacing: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: 12,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  verifiedText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.success || '#10b981',
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  sendOTPButton: {
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  backButton: {
    flex: 0.5,
  },
});

