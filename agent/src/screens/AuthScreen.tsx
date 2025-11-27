import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { Agent } from '../types';
import { colors } from '../theme/colors';

interface AuthScreenProps {
  onLogin: (agent: Agent, token: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  
  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      console.log('[DEMO] MODE SIMULATION - Connexion agent avec:', loginIdentifier);
      
      // Créer un agent simulé
      const isEmail = loginIdentifier.includes('@');
      const simulatedAgent: Agent = {
        id: `agent-sim-${Date.now()}`,
        email: isEmail ? loginIdentifier : `${loginIdentifier.replace(/\\s+/g, '')}@temp.agent`,
        name: isEmail 
          ? loginIdentifier.split('@')[0].charAt(0).toUpperCase() + loginIdentifier.split('@')[0].slice(1)
          : `Agent ${loginIdentifier}`,
        prenom: 'Agent',
        nom: isEmail ? loginIdentifier.split('@')[0] : loginIdentifier,
        cni: '1234567890123',
        tel: isEmail ? '+221 77 123 45 67' : loginIdentifier,
        corps: 'Police',
        matricule: 'POL-' + Math.floor(1000 + Math.random() * 9000),
        enService: false,
        stats: {
          verificationsEffectuees: Math.floor(Math.random() * 50),
          alertesCreees: Math.floor(Math.random() * 20),
          arrestations: Math.floor(Math.random() * 10),
        },
      };

      // Simuler un token d'accès
      const simulatedToken = `agent-token-${Date.now()}`;

      // Connexion simulée réussie
      onLogin(simulatedAgent, simulatedToken);
      toast.success('Connexion agent réussie !');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="shield" size={36} color={colors.white} />
            </View>
            <Text style={styles.title}>KattanX</Text>
            <Text style={styles.subtitle}>Portail Agent</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Connexion Agent</Text>
              <Text style={styles.formSubtitle}>
                Accès réservé aux agents de sécurité
              </Text>
            </View>

            <View style={styles.inputsContainer}>
              <Input
                label="Email ou Téléphone"
                value={loginIdentifier}
                onChangeText={setLoginIdentifier}
                placeholder="votre@email.com ou +221 XX XXX XX XX"
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="username"
              />

              <Input
                label="Mot de passe"
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
              />
            </View>

            <Button
              title={loading ? 'Connexion...' : 'Se connecter'}
              onPress={handleLogin}
              disabled={loading}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.demoInfo}>
              <MaterialIcons name="info" size={20} color={colors.primary} />
              <Text style={styles.demoText}>
                Mode démo : Utilisez n'importe quel identifiant et mot de passe pour vous connecter
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 45,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  formHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.muted,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    gap: 12,
  },
  demoText: {
    flex: 1,
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 18,
  },
});
