# 🔄 Guide de Migration Web → Mobile

Ce document explique les différences entre la version web et mobile, et comment les composants ont été adaptés.

## 📊 Tableau de Correspondance

### Composants UI

| Web (Radix UI) | Mobile (React Native) | Notes |
|----------------|----------------------|-------|
| `<Button>` | `<TouchableOpacity>` + `<Text>` | Composant personnalisé créé |
| `<Input>` | `<TextInput>` | Composant personnalisé avec label |
| `<Dialog>` | `<Modal>` | Modal natif React Native |
| `<Textarea>` | `<TextInput multiline>` | TextInput avec numberOfLines |
| `<Label>` | `<Text>` | Texte simple avec style |
| `<Toaster>` | Composant Toast custom | Système de toast personnalisé |
| `div` | `<View>` | Conteneur de base |
| `p`, `h1`, etc. | `<Text>` | Tous les textes utilisent Text |

### Navigation

| Web | Mobile |
|-----|--------|
| Rendu conditionnel | État `currentScreen` |
| `className` | `style` prop |
| CSS | StyleSheet |

### Stockage

| Web | Mobile |
|-----|--------|
| `localStorage` | `AsyncStorage` |
| Synchrone | Asynchrone (await) |

### Icônes

| Web | Mobile |
|-----|--------|
| `lucide-react` | `@expo/vector-icons` (Ionicons) |
| `<User />` | `<Ionicons name="person" />` |

## 🔧 Adaptations Principales

### 1. Structure des Composants

**Web (React):**
```tsx
<div className="container">
  <h1>Titre</h1>
  <p>Texte</p>
</div>
```

**Mobile (React Native):**
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Titre</Text>
  <Text style={styles.text}>Texte</Text>
</View>
```

### 2. Styles

**Web (Tailwind CSS):**
```tsx
<div className="flex items-center justify-between p-4 bg-primary">
```

**Mobile (StyleSheet):**
```tsx
<View style={styles.container}>
// ...
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.primary,
  },
});
```

### 3. Formulaires

**Web:**
```tsx
<form onSubmit={handleSubmit}>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  <Button type="submit">Envoyer</Button>
</form>
```

**Mobile:**
```tsx
<View>
  <Input 
    value={email} 
    onChangeText={setEmail}
    keyboardType="email-address"
  />
  <Button title="Envoyer" onPress={handleSubmit} />
</View>
```

### 4. Défilement

**Web:**
```tsx
<div className="overflow-auto">
  {/* contenu */}
</div>
```

**Mobile:**
```tsx
<ScrollView>
  {/* contenu */}
</ScrollView>
```

### 5. Modales/Dialogs

**Web (Radix UI):**
```tsx
<Dialog open={showForm} onOpenChange={setShowForm}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
    </DialogHeader>
    {/* contenu */}
  </DialogContent>
</Dialog>
```

**Mobile:**
```tsx
<Modal
  visible={showForm}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowForm(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Titre</Text>
        <TouchableOpacity onPress={() => setShowForm(false)}>
          <Ionicons name="close" size={24} />
        </TouchableOpacity>
      </View>
      {/* contenu */}
    </View>
  </View>
</Modal>
```

## 🎨 Système de Couleurs

Les couleurs ont été centralisées dans `src/theme/colors.ts`:

```typescript
export const colors = {
  primary: '#3b82f6',      // Bleu principal
  secondary: '#10b981',    // Vert
  destructive: '#ef4444',  // Rouge
  background: '#ffffff',   // Blanc
  foreground: '#0f172a',   // Noir/Texte
  muted: '#f1f5f9',       // Gris clair
  mutedForeground: '#64748b', // Gris texte
  border: '#e2e8f0',      // Bordures
};
```

## 📱 Spécificités Mobile

### KeyboardAvoidingView

Pour éviter que le clavier ne cache les champs :

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
  {/* formulaire */}
</KeyboardAvoidingView>
```

### SafeAreaView

Pour respecter les zones sûres (notch, etc.) :

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  {/* contenu */}
</SafeAreaView>
```

### Types de Clavier

```tsx
<Input
  keyboardType="email-address"    // Pour email
  keyboardType="phone-pad"        // Pour téléphone
  keyboardType="numeric"          // Pour nombres
  keyboardType="default"          // Par défaut
  autoCapitalize="none"           // Pas de majuscules auto
  secureTextEntry                 // Pour mots de passe
/>
```

## 🔄 Gestion de l'État

### Stockage Persistant

**Web:**
```typescript
localStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('user'));
```

**Mobile:**
```typescript
await AsyncStorage.setItem('user', JSON.stringify(user));
const userString = await AsyncStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;
```

### Navigation

**Web:**
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('auth');

// Rendu conditionnel
{currentScreen === 'home' && <HomeScreen />}
{currentScreen === 'profile' && <ProfileScreen />}
```

**Mobile (même approche):**
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('auth');

// Rendu conditionnel identique
{currentScreen === 'home' && <HomeScreen />}
{currentScreen === 'profile' && <ProfileScreen />}
```

## 🎯 Bonnes Pratiques Mobile

### 1. Performance

```typescript
// Utiliser React.memo pour les composants lourds
export const MyComponent = React.memo(({ data }) => {
  // ...
});

// Utiliser useMemo pour les calculs coûteux
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 2. Gestion des Images

```typescript
// Utiliser Image de react-native
import { Image } from 'react-native';

<Image
  source={{ uri: 'https://...' }}
  style={styles.image}
  resizeMode="cover"
/>
```

### 3. Gestion des Listes

Pour de longues listes, utiliser FlatList au lieu de map :

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
/>
```

## 🐛 Debugging

### React Native Debugger

1. Installer React Native Debugger
2. Secouer le téléphone ou Cmd+D (iOS) / Cmd+M (Android)
3. Sélectionner "Debug"

### Console Logs

```typescript
console.log('Debug:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Expo DevTools

```bash
npm start
# Appuyer sur 'd' pour ouvrir DevTools
```

## 📦 Dépendances Équivalentes

| Web | Mobile | Package |
|-----|--------|---------|
| react-dom | react-native | Core |
| @radix-ui/* | Composants custom | UI |
| next-themes | Pas nécessaire | Thème |
| sonner | Toast custom | Notifications |
| lucide-react | @expo/vector-icons | Icônes |
| - | expo | Plateforme |
| - | @react-native-async-storage/async-storage | Stockage |

## 🚀 Optimisations

### 1. Images

- Utiliser des formats optimisés (WebP)
- Compresser les images
- Utiliser FastImage pour le cache

### 2. Bundle Size

```bash
# Analyser la taille du bundle
npx react-native-bundle-visualizer
```

### 3. Performance

- Éviter les re-renders inutiles
- Utiliser React.memo et useMemo
- Lazy loading pour les écrans

## 🎓 Ressources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Directory](https://reactnative.directory/)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

## 💡 Conseils

1. **Tester sur de vrais appareils** : Les émulateurs ne reflètent pas toujours la vraie performance
2. **Gérer les permissions** : Caméra, localisation, etc.
3. **Tester différentes tailles d'écran** : iPhone SE, iPhone Pro Max, etc.
4. **Gérer les états de connexion** : Offline, slow network
5. **Internationalisation** : Préparer pour plusieurs langues

## ✅ Checklist de Migration

- [x] Composants UI adaptés
- [x] Navigation implémentée
- [x] Stockage AsyncStorage
- [x] Styles convertis en StyleSheet
- [x] Formulaires adaptés
- [x] Icônes remplacées
- [x] Modales converties
- [x] API calls conservés
- [x] Types TypeScript maintenus
- [x] Toast system créé

## 🎉 Conclusion

La migration est complète ! Tous les composants web ont été adaptés pour mobile tout en conservant la même logique métier et la même structure de données.



