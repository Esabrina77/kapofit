# Guide Docker - KaporalFit

## Table des Matières
1. [Installation Windows](#1-installation-windows)
2. [Configuration WSL](#2-configuration-wsl)
3. [Vérification Installation](#3-vérification-installation)
4. [Structure du Projet](#4-structure-du-projet)
5. [Docker Compose](#5-docker-compose)

## 1. Installation Windows

### Étape 1 : Docker Desktop
1. Télécharger [Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop)
2. Exécuter l'installateur
3. Suivre les instructions d'installation
4. Redémarrer votre PC après l'installation

### Étape 2 : WSL 2
```bash
# Dans PowerShell (Administrateur)
wsl --update
```

## 2. Configuration WSL

### Étape 1 : Installation Ubuntu
```bash
# Installer Ubuntu
wsl --install

# Vérifier les distributions disponibles
wsl --list --online

# Vérifier les distributions installées
wsl --list --verbose
```

### Étape 2 : Premier Démarrage Ubuntu
1. Ubuntu va démarrer automatiquement
2. Créer un nom d'utilisateur UNIX
3. Créer un mot de passe
4. Noter ces informations pour plus tard

### Étape 3 : Configuration Docker Desktop
1. Ouvrir Docker Desktop
2. Aller dans Settings > Resources > WSL Integration
3. Activer l'intégration pour Ubuntu
4. Cliquer sur "Apply & Restart"

## 3. Vérification Installation

### Test Docker
```bash
# Dans PowerShell (Administrateur)
docker run hello-world
```

Vous devriez voir :
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

### Vérification WSL
```bash
# Vérifier la version de WSL
wsl --list --verbose
```

Vous devriez voir Ubuntu listé avec VERSION 2.

## 4. Structure du Projet

### Création des Dossiers
```bash
# Dans PowerShell
cd C:\Users\VotreNom\Projects  # Adaptez le chemin
mkdir kaporalfit
cd kaporalfit

# Créer la structure
mkdir frontend
mkdir backend
mkdir docker
```

### Création des Fichiers Docker
```bash
# Dans le dossier docker
cd docker

# Créer les fichiers nécessaires
New-Item docker-compose.yml
New-Item frontend.Dockerfile
New-Item backend.Dockerfile
New-Item nginx.conf
```

## 5. Troubleshooting

### Problèmes Courants

1. **Docker Desktop ne démarre pas**
   - Vérifier que la virtualisation est activée dans le BIOS
   - Vérifier que Hyper-V est activé dans Windows

2. **WSL non reconnu**
```bash
# Réinstaller WSL
wsl --unregister Ubuntu
wsl --install
```

3. **Erreur de permission Docker**
   - Relancer Docker Desktop en tant qu'administrateur
   - Vérifier que l'intégration WSL est activée dans Docker Desktop

### Commandes Utiles

```bash
# Vérifier la version de Docker
docker --version

# Vérifier la version de WSL
wsl --version

# Arrêter WSL
wsl --shutdown

# Redémarrer WSL
wsl
```

## Prochaines Étapes

1. Configuration du docker-compose.yml
2. Configuration des Dockerfiles
3. Configuration de Nginx
4. Premier déploiement

## Ressources
- [Documentation Docker](https://docs.docker.com/)
- [Guide WSL](https://docs.microsoft.com/fr-fr/windows/wsl/)
- [Docker Desktop WSL 2](https://docs.docker.com/desktop/windows/wsl/) 