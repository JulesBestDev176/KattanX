import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { API_BASE_URL, publicAnonKey, supabase, supabaseUrl } from '../utils/supabase';
import { storage } from '../utils/storage';
import { User } from '../types';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

interface AuthScreenProps {
  onLogin: (user: User, token: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Prénom/Nom/CNI, 2: Email/Tel/Password
  const [generatedOTP, setGeneratedOTP] = useState('');

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Email ou téléphone
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form - Step 1
  const [signupPrenom, setSignupPrenom] = useState('');
  const [signupNom, setSignupNom] = useState('');
  const [signupCNI, setSignupCNI] = useState('');
  
  // Signup form - Step 2
  const [signupEmail, setSignupEmail] = useState('');
  const [signupTel, setSignupTel] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [otp, setOtp] = useState('');

  // Fonction pour envoyer l'OTP via WhatsApp
  const sendOTPViaWhatsApp = async (phoneNumber: string, otpCode: string, userName: string) => {
    try {
      // Nettoyer le numéro de téléphone (enlever les espaces et caractères spéciaux)
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      const targetPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
      
      // Message WhatsApp
      const message = `Bonjour ${userName},\n\nVotre code de vérification KattanX est : ${otpCode}\n\nCe code est valide pendant 10 minutes.\n\nNe partagez jamais ce code avec personne.`;

      // Essayer d'utiliser l'Edge Function Supabase
      try {
        const functionUrl = `${supabaseUrl}/functions/v1/send-whatsapp`;
        console.log('Tentative d\'envoi WhatsApp via:', functionUrl);
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            to: targetPhone,
            message: message,
            otp: otpCode,
          }),
        });

        console.log('Réponse Edge Function:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('Données reçues:', data);
          if (data.success) {
            return data;
          }
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
          }
          console.error('Erreur Edge Function:', errorData);
          
          // Si c'est une erreur de service non configuré, continuer avec le fallback
          if (errorData.demo) {
            console.log('Service WhatsApp non configuré, mode démo activé');
          } else {
            throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
          }
        }
      } catch (apiError: any) {
        console.error('Erreur lors de l\'appel Edge Function:', apiError);
        console.error('Détails:', {
          message: apiError.message,
          name: apiError.name,
          stack: apiError.stack,
        });
        // Continuer avec le fallback
      }

      // Fallback: Pour la démo, on considère que le message est envoyé
      // En production, vous devez configurer une vraie API WhatsApp (Green API, Twilio, etc.)
      console.log(`[DEMO] Message WhatsApp à envoyer à ${targetPhone}:`);
      console.log(`[DEMO] ${message}`);
      
      // Retourner un succès pour la démo
      return { success: true, method: 'demo', message: 'Message WhatsApp (mode démo)' };
      
    } catch (error: any) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // MODE SIMULATION : Connexion avec n'importe quel identifiant
      // Pour le développement/test uniquement
      console.log('🔧 MODE SIMULATION - Connexion avec:', loginIdentifier);
      
      // Créer un utilisateur simulé
      const isEmail = loginIdentifier.includes('@');
      const simulatedUser: User = {
        id: `sim-${Date.now()}`,
        email: isEmail ? loginIdentifier : `${loginIdentifier.replace(/\s+/g, '')}@temp.citizen`,
        name: loginIdentifier.includes('@') 
          ? loginIdentifier.split('@')[0].charAt(0).toUpperCase() + loginIdentifier.split('@')[0].slice(1)
          : `Utilisateur ${loginIdentifier}`,
        cni: '1234567890123',
        tel: isEmail ? '+221 77 123 45 67' : loginIdentifier,
      };

      // Simuler un token d'accès
      const simulatedToken = `sim-token-${Date.now()}`;

      // Connexion simulée réussie
      onLogin(simulatedUser, simulatedToken);
      toast.success('Connexion simulée réussie !');
      
      /* 
      // CODE RÉEL (désactivé pour le mode simulation)
      // Détecter si c'est un email ou un téléphone
      const isEmail = loginIdentifier.includes('@');
      
      let userEmail = loginIdentifier;
      
      // Si c'est un téléphone, on doit trouver l'email correspondant
      if (!isEmail) {
        // Essayer avec le format email temporaire
        const cleanTel = loginIdentifier.replace(/\s+/g, '').replace(/[^\d+]/g, '');
        userEmail = `${cleanTel.replace('+', '')}@temp.citizen`;
      }

      // Connexion avec Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: loginPassword,
      });

      if (signInError) {
        // Si l'email temporaire ne fonctionne pas et que c'était un téléphone, essayer avec l'identifiant tel quel
        if (!isEmail) {
          // Essayer une autre variante
          const cleanTel = loginIdentifier.replace(/\s+/g, '');
          const altEmail = `${cleanTel}@temp.citizen`;
          
          const { data: altSignInData, error: altSignInError } = await supabase.auth.signInWithPassword({
            email: altEmail,
            password: loginPassword,
          });

          if (altSignInError || !altSignInData.session) {
            throw new Error('Identifiants incorrects. Vérifiez votre email/téléphone et mot de passe.');
          }

          // Utiliser les données de la connexion alternative
          const userData: User = {
            id: altSignInData.user.id,
            email: altSignInData.user.email || '',
            name: altSignInData.user.user_metadata?.name || '',
            cni: altSignInData.user.user_metadata?.cni || '',
            tel: altSignInData.user.user_metadata?.tel || loginIdentifier,
          };

          onLogin(userData, altSignInData.session.access_token);
          toast.success('Connexion réussie !');
          return;
        }
        
        throw new Error(signInError.message || 'Identifiants incorrects');
      }

      if (!signInData.session) {
        throw new Error('Session non créée. Veuillez réessayer.');
      }

      const userData: User = {
        id: signInData.user.id,
        email: signInData.user.email || '',
        name: signInData.user.user_metadata?.name || '',
        cni: signInData.user.user_metadata?.cni || '',
        tel: signInData.user.user_metadata?.tel || loginIdentifier,
      };

      onLogin(userData, signInData.session.access_token);
      toast.success('Connexion réussie !');
      */
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!signupTel || !signupPassword) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      // Générer un email temporaire si aucun email n'est fourni
      const userEmail = signupEmail || `${signupTel.replace(/\s+/g, '')}@temp.citizen`;
      const fullName = `${signupPrenom} ${signupNom}`.trim();

      // Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: signupPassword,
        options: {
          data: {
            name: fullName,
            prenom: signupPrenom,
            nom: signupNom,
            cni: signupCNI,
            tel: signupTel,
            email_verified: false,
          },
          emailRedirectTo: undefined, // Pas de redirection email nécessaire
        },
      });

      if (authError) {
        throw new Error(authError.message || "Erreur lors de la création du compte");
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      // Vérifier si une session a été créée (si email confirmation n'est pas requise)
      if (!authData.session) {
        // Si pas de session, on attend un peu et on réessaie
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Stocker l'email pour confirmation manuelle si nécessaire
          console.log('Session non créée automatiquement, nécessite confirmation email');
        }
      }

      // Générer un OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otpCode);
      setShowOTP(true);
      
      // Stocker temporairement l'ID utilisateur et l'OTP pour la vérification
      await storage.saveTempUserId(authData.user.id);
      await storage.saveTempOTP(otpCode);
      
      // Envoyer l'OTP via WhatsApp
      try {
        const whatsappResult = await sendOTPViaWhatsApp(signupTel, otpCode, fullName);
        if (whatsappResult.success) {
          if (whatsappResult.method === 'demo') {
            toast.success(`Code OTP généré (mode démo)`);
          } else {
            toast.success(`Code OTP envoyé via WhatsApp !`);
          }
        }
      } catch (whatsappError: any) {
        console.error('Erreur envoi WhatsApp:', whatsappError);
        // Ne pas bloquer l'inscription si WhatsApp échoue
        toast.warning('Code OTP généré (envoi WhatsApp non disponible)');
      }
      
    } catch (error: any) {
      console.error('OTP request error:', error);
      toast.error(error.message || "Erreur lors de l'envoi de l'OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Veuillez entrer le code OTP');
      return;
    }

    setLoading(true);
    try {
      // Récupérer l'OTP stocké et l'ID utilisateur
      const storedOTP = await storage.getTempOTP();
      const userId = await storage.getTempUserId();

      if (!storedOTP || !userId) {
        throw new Error('Session expirée. Veuillez recommencer l\'inscription.');
      }

      // Vérifier l'OTP
      if (otp !== storedOTP) {
        throw new Error('Code OTP invalide');
      }

      // Récupérer la session actuelle
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Si pas de session, essayer de se connecter avec l'email temporaire et le mot de passe
      if (!session || !session.user) {
        console.log('Pas de session Supabase, tentative de connexion...');
        
        // Attendre un peu pour que Supabase finalise la création de l'utilisateur
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Réessayer de récupérer la session
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession && retrySession.user) {
          session = retrySession;
          console.log('Session récupérée après attente');
        } else {
          // Essayer de se connecter avec l'email temporaire et le mot de passe
          const userEmail = signupEmail || `${signupTel.replace(/\s+/g, '')}@temp.citizen`;
          console.log('Tentative de connexion avec:', userEmail);
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: signupPassword,
          });

          if (signInError) {
            console.error('Erreur de connexion:', signInError.message);
            // Si la connexion échoue, on préremplit les champs de connexion
            toast.success('Code OTP vérifié ! Veuillez vous connecter avec vos identifiants.');
            setIsSignUp(false);
            setShowOTP(false);
            setSignupStep(1);
            setLoginIdentifier(signupEmail || signupTel);
            setLoginPassword(signupPassword);
            await storage.clearTemp();
            return;
          }

          if (signInData.session) {
            session = signInData.session;
            console.log('Session créée avec succès via connexion');
          } else {
            // Dernière tentative : attendre encore un peu
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { data: { session: finalSession } } = await supabase.auth.getSession();
            if (finalSession && finalSession.user) {
              session = finalSession;
              console.log('Session récupérée après deuxième attente');
            } else {
              // Si toujours pas de session, préremplir les champs de connexion
              toast.success('Code OTP vérifié ! Veuillez vous connecter avec vos identifiants.');
              setIsSignUp(false);
              setShowOTP(false);
              setSignupStep(1);
              setLoginIdentifier(signupEmail || signupTel);
              setLoginPassword(signupPassword);
              await storage.clearTemp();
              return;
            }
          }
        }
      }

      // Vérifier que l'ID utilisateur correspond
      if (session.user.id !== userId) {
        throw new Error('Session invalide');
      }

      // Mettre à jour les métadonnées utilisateur pour confirmer la vérification
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          email_verified: true,
          phone_verified: true,
          otp_verified: true,
        },
      });

      if (updateError) {
        console.error('Erreur mise à jour métadonnées:', updateError);
        // Ne pas bloquer si la mise à jour échoue
      }

      // Créer l'objet User pour l'application
      const userData: User = {
        id: session.user.id,
        email: session.user.email || signupEmail || '',
        name: session.user.user_metadata.name || `${signupPrenom} ${signupNom}`.trim(),
        cni: session.user.user_metadata.cni || signupCNI,
        tel: session.user.user_metadata.tel || signupTel,
      };

      // Nettoyer les données temporaires
      await storage.clearTemp();

      toast.success('Inscription réussie ! Connectez-vous maintenant.');
      setIsSignUp(false);
      setShowOTP(false);
      setSignupStep(1);
      setLoginIdentifier(signupEmail || signupTel);
      
      // Reset signup form
      setSignupEmail('');
      setSignupPassword('');
      setSignupPrenom('');
      setSignupNom('');
      setSignupCNI('');
      setSignupTel('');
      setOtp('');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Erreur lors de la vérification OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="account-balance" size={36} color={colors.white} />
            </View>
            <Text style={styles.title}>KattanX</Text>
            <Text style={styles.subtitle}>Portail Citoyen</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {!isSignUp ? (
            // Login Form
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Connexion</Text>
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

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Pas encore de compte ? </Text>
                <TouchableOpacity onPress={() => setIsSignUp(true)}>
                  <Text style={styles.switchLink}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : !showOTP ? (
            // Signup Form - Multi-step
            <View style={styles.formContainer}>
                {signupStep === 2 && (
                  <TouchableOpacity 
                    onPress={() => setSignupStep(1)} 
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                  </TouchableOpacity>
                )}
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Inscription</Text>
                  <Text style={styles.stepIndicator}>Étape {signupStep} sur 2</Text>
                </View>

                {signupStep === 1 ? (
                  // Step 1: Prénom, Nom, CNI
                  <>
                    <View style={styles.inputsContainer}>
                      <Input
                        label="Prénom"
                        value={signupPrenom}
                        onChangeText={setSignupPrenom}
                        placeholder="Votre prénom"
                        autoCapitalize="words"
                        autoComplete="given-name"
                        textContentType="givenName"
                      />

                      <Input
                        label="Nom"
                        value={signupNom}
                        onChangeText={setSignupNom}
                        placeholder="Votre nom"
                        autoCapitalize="words"
                        autoComplete="family-name"
                        textContentType="familyName"
                      />

                      <Input
                        label="CNI"
                        value={signupCNI}
                        onChangeText={setSignupCNI}
                        placeholder="Numéro CNI"
                        keyboardType="default"
                      />
                    </View>

                    <Button
                      title="Suivant"
                      onPress={() => {
                        if (!signupPrenom || !signupNom || !signupCNI) {
                          toast.error('Veuillez remplir tous les champs');
                          return;
                        }
                        setSignupStep(2);
                      }}
                      style={[styles.button, styles.nextButton]}
                    />
                  </>
                ) : (
                  // Step 2: Email, Téléphone, Mot de passe
                  <>
                    <View style={styles.inputsContainer}>
                      <Input
                        label="Téléphone"
                        value={signupTel}
                        onChangeText={setSignupTel}
                        placeholder="+221 XX XXX XX XX"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        textContentType="telephoneNumber"
                      />

                      <Input
                        label="Email (optionnel)"
                        value={signupEmail}
                        onChangeText={setSignupEmail}
                        placeholder="votre@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                      />

                      <Input
                        label="Mot de passe"
                        value={signupPassword}
                        onChangeText={setSignupPassword}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="password-new"
                        textContentType="newPassword"
                      />
                    </View>

                    <Button
                      title={loading ? 'Envoi...' : 'Recevoir le code OTP'}
                      onPress={handleRequestOTP}
                      disabled={loading}
                      loading={loading}
                      style={styles.button}
                    />
                  </>
                )}

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Déjà inscrit ? </Text>
                  <TouchableOpacity onPress={() => {
                    setIsSignUp(false);
                    setSignupStep(1);
                  }}>
                    <Text style={styles.switchLink}>Se connecter</Text>
                  </TouchableOpacity>
                </View>
              </View>
           ) : (
             // Signup Form - Step 3: Verify OTP
             <ScrollView 
               contentContainerStyle={styles.scrollContent}
               showsVerticalScrollIndicator={false}
               keyboardShouldPersistTaps="handled"
               contentInsetAdjustmentBehavior="never"
             >
               <View style={styles.formContainer}>
                 <TouchableOpacity 
                   onPress={() => setShowOTP(false)} 
                   style={styles.backButton}
                 >
                   <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                 </TouchableOpacity>
                 <View style={styles.formHeader}>
                   <Text style={styles.formTitle}>Vérification</Text>
                 </View>

              <View style={styles.otpInfo}>
                <MaterialIcons name="chat" size={32} color={colors.primary} />
                <Text style={styles.otpInfoText}>Code envoyé via WhatsApp à</Text>
                <Text style={styles.otpInfoEmail}>{signupTel}</Text>
                <View style={styles.otpDemoContainer}>
                  <Text style={styles.otpDemoLabel}>Code de démo :</Text>
                  <Text style={styles.otpDemoCode}>{generatedOTP}</Text>
                </View>
              </View>

              <Input
                label="Code OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                style={styles.otpInput}
                textContentType="oneTimeCode"
              />

              <Button
                title={loading ? 'Vérification...' : 'Vérifier et créer le compte'}
                onPress={handleVerifyOTP}
                disabled={loading}
                loading={loading}
                style={styles.button}
              />

               <TouchableOpacity
                 onPress={() => setShowOTP(false)}
                 style={styles.resendButton}
               >
                 <Text style={styles.resendText}>Renvoyer le code</Text>
               </TouchableOpacity>
               </View>
             </ScrollView>
           )}
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
    paddingTop: isSmallScreen ? 25 : 40,
    paddingBottom: isSmallScreen ? 30 : 45,
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
    width: isSmallScreen ? 60 : 70,
    height: isSmallScreen ? 60 : 70,
    borderRadius: isSmallScreen ? 30 : 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 10 : 16,
  },
  title: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 16 : 18,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: isSmallScreen ? 12 : 20,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: isSmallScreen ? 12 : 16,
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 5,
  },
  formHeader: {
    marginBottom: isSmallScreen ? 12 : 16,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: isSmallScreen ? 26 : 28,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  inputsContainer: {
    marginBottom: isSmallScreen ? 2 : 4,
  },
  button: {
    marginTop: isSmallScreen ? 8 : 12,
    marginBottom: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButton: {
    marginBottom: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  switchText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  switchLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  otpInfo: {
    backgroundColor: colors.muted,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  otpInfoText: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  otpInfoEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  otpDemoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  resendButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});



