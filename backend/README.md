## Configuration Firebase

Pour configurer Firebase :

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com)
2. Générez une nouvelle clé privée (Project Settings > Service Accounts)
3. Copiez `src/secrets/firebase-service-account.example.json` vers `src/secrets/firebase-service-account.json`
4. Remplacez les valeurs par vos credentials Firebase

⚠️ Ne commitez jamais le fichier `firebase-service-account.json` ! 