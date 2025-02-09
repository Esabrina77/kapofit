# Configuration Firebase pour KaporalFit

## 1. Création du Projet
1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquer sur "Ajouter un projet"
3. Nommer le projet "kaporalfit"
4. Désactiver Google Analytics pour le moment
5. Cliquer sur "Créer le projet"

## 2. Configuration de l'Application Web
1. Dans la console Firebase, cliquer sur l'icône Web (</>) 
2. Nommer l'application "kaporalfit-web"
3. Cocher "Firebase Hosting"
4. Cliquer sur "Enregistrer"
5. Copier la configuration firebaseConfig

## 3. Configuration de l'Authentification
1. Dans le menu latéral, cliquer sur "Authentication"
2. Cliquer sur "Get Started"
3. Dans "Sign-in method", activer :
   - Google
   - Email/Password (optionnel)
   - GitHub (optionnel)

## 4. Configuration des Domaines Autorisés
1. Aller dans Authentication > Settings
2. Sous "Authorized domains", ajouter :
   - localhost
   - localhost:3000
   - [votre-domaine-production].com (plus tard)

## 5. Configuration Google Sign-In
1. Dans "Sign-in method" > Google
2. Ajouter un email de support
3. Sélectionner un compte projet
4. Sauvegarder

## 6. Variables d'Environnement
Créer `.env.local` avec :
```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kaporalfit.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kaporalfit
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kaporalfit.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

## 7. Vérification
1. Lancer l'application : `npm run dev`
2. Tester la connexion Google
3. Vérifier dans Firebase Console > Authentication > Users

## Dépannage Courant
- **Error (auth/configuration-not-found)** : Vérifier les domaines autorisés
- **Error (auth/unauthorized-domain)** : Ajouter le domaine dans Firebase Console
- **Error (auth/popup-closed-by-user)** : L'utilisateur a fermé la popup

## Prochaines Étapes
1. Ajouter d'autres méthodes d'authentification
2. Configurer les règles de sécurité
3. Mettre en place Firebase Hosting 