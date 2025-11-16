# Installation de Supabase CLI sur Windows

Ce guide vous aide à installer Supabase CLI sur Windows.

## ⚠️ Important

**L'installation globale via `npm install -g supabase` n'est PAS supportée.**

Vous devez utiliser une des méthodes suivantes :

## 🎯 Option 1 : Scoop (Recommandé)

Scoop est un gestionnaire de paquets pour Windows, similaire à Homebrew sur macOS.

### Installation de Scoop

1. Ouvrir PowerShell en tant qu'administrateur
2. Exécuter :
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Installation de Supabase CLI

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Vérification

```powershell
supabase --version
```

## 🎯 Option 2 : winget (Windows Package Manager)

Si vous avez Windows 10/11 avec winget installé :

```powershell
winget install Supabase.CLI
```

### Vérification

```powershell
supabase --version
```

## 🎯 Option 3 : Téléchargement direct

1. Aller sur [GitHub Releases](https://github.com/supabase/cli/releases)
2. Télécharger `supabase_windows_amd64.zip` (ou la version appropriée)
3. Extraire le fichier `supabase.exe`
4. Ajouter le dossier au PATH Windows ou le placer dans un dossier déjà dans le PATH

## 🎯 Option 4 : Utiliser npx (Sans installation)

Vous pouvez utiliser Supabase CLI via `npx` sans installation globale :

```bash
npx supabase@latest --version
npx supabase@latest login
npx supabase@latest link --project-ref votre-project-id
```

**Avantage** : Pas besoin d'installation
**Inconvénient** : Plus lent car télécharge à chaque fois

## 🔍 Vérification de l'installation

Après installation, vérifiez que Supabase CLI fonctionne :

```bash
supabase --version
```

Vous devriez voir quelque chose comme : `supabase 1.x.x`

## 📚 Ressources

- [Documentation officielle Supabase CLI](https://supabase.com/docs/guides/cli)
- [GitHub Supabase CLI](https://github.com/supabase/cli)
- [Scoop Package Manager](https://scoop.sh/)

## 🆘 Dépannage

### Erreur "supabase: command not found"

- Vérifiez que le dossier contenant `supabase.exe` est dans votre PATH
- Redémarrez votre terminal après l'installation

### Erreur de permissions

- Exécutez PowerShell en tant qu'administrateur
- Vérifiez les permissions d'exécution : `Get-ExecutionPolicy`

### Scoop ne fonctionne pas

- Vérifiez que PowerShell est en version 5.1 ou supérieure : `$PSVersionTable.PSVersion`
- Réinstallez Scoop si nécessaire

