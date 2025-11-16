import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DossierScreen } from './src/screens/DossierScreen';
import { ProprietesScreen } from './src/screens/ProprietesScreen';
import { DenonciationsScreen } from './src/screens/DenonciationsScreen';
import { PlaintesScreen } from './src/screens/PlaintesScreen';
import { RevenusScreen } from './src/screens/RevenusScreen';
import { Toast, toast } from './src/components/ui/Toast';
import { storage } from './src/utils/storage';
import { User, Screen } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<User | null>(null);
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
      const storedUser = await storage.getUser();
      const storedToken = await storage.getToken();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setAccessToken(storedToken);
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsReady(true);
    }
  };

  const handleLogin = async (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    await storage.saveUser(userData);
    await storage.saveToken(token);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    setUser(null);
    setAccessToken(null);
    await storage.clear();
    setCurrentScreen('auth');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await storage.saveUser(updatedUser);
  };

  if (!isReady) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {currentScreen === 'auth' && <AuthScreen onLogin={handleLogin} />}
      
      {currentScreen === 'home' && user && (
        <HomeScreen
          user={user}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'profile' && user && accessToken && (
        <ProfileScreen
          user={user}
          accessToken={accessToken}
          onBack={() => navigateTo('home')}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      {currentScreen === 'dossier' && accessToken && user && (
        <DossierScreen
          accessToken={accessToken}
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}
      
      {currentScreen === 'proprietes' && accessToken && (
        <ProprietesScreen
          accessToken={accessToken}
          onBack={() => navigateTo('home')}
        />
      )}
      
      {currentScreen === 'denonciations' && accessToken && (
        <DenonciationsScreen
          accessToken={accessToken}
          onBack={() => navigateTo('home')}
        />
      )}
      
      {currentScreen === 'plaintes' && accessToken && (
        <PlaintesScreen
          accessToken={accessToken}
          onBack={() => navigateTo('home')}
        />
      )}
      
      {currentScreen === 'revenus' && accessToken && (
        <RevenusScreen
          accessToken={accessToken}
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



