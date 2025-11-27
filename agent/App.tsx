import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { VerificationScreen } from './src/screens/VerificationScreen';
import { AlertsScreen } from './src/screens/AlertsScreen';
import { Toast, toast } from './src/components/ui/Toast';
import { storage } from './src/utils/storage';
import { Agent, Screen } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    // Setup toast manager
    toast.setShowToast((message, type) => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    });

    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const storedAgent = await storage.getAgent();
      const storedToken = await storage.getToken();

      if (storedAgent && storedToken) {
        setAgent(storedAgent);
        setAccessToken(storedToken);
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsReady(true);
    }
  };

  const handleLogin = async (agentData: Agent, token: string) => {
    setAgent(agentData);
    setAccessToken(token);
    await storage.saveAgent(agentData);
    await storage.saveToken(token);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    setAgent(null);
    setAccessToken(null);
    await storage.clear();
    setCurrentScreen('auth');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleUpdateAgent = async (updatedAgent: Agent) => {
    setAgent(updatedAgent);
    await storage.saveAgent(updatedAgent);
  };

  if (!isReady) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {currentScreen === 'auth' && <AuthScreen onLogin={handleLogin} />}
      
      {currentScreen === 'home' && agent && (
        <HomeScreen
          agent={agent}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onUpdateAgent={handleUpdateAgent}
        />
      )}
      
      {currentScreen === 'profile' && agent && (
        <ProfileScreen
          agent={agent}
          onBack={() => navigateTo('home')}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'verification' && (
        <VerificationScreen
          onBack={() => navigateTo('home')}
        />
      )}
      
      {currentScreen === 'alerts' && (
        <AlertsScreen
          agentPosition={agent?.position}
          onBack={() => navigateTo('home')}
        />
      )}

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
