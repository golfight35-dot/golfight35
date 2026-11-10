# Golfight 2.0

Le golf entre potes, avec des coups bas.

Prototype autonome HTML/CSS/JavaScript, sans compte, serveur applicatif ni dépendance de production. Ouvrir `index.html` via un serveur web local pour tester. L'original exact est conservé dans `reference/golfight-v2.html`.

## Test sur smartphone

1. Sur un ordinateur équipé de Python, dans ce dossier : `python3 -m http.server 8000 --bind 0.0.0.0`.
2. Connecter ordinateur et smartphone au même réseau Wi-Fi de confiance.
3. Sur le smartphone, ouvrir `http://ADRESSE_IP_LOCALE_DE_L_ORDINATEUR:8000` dans Safari ou Chrome. Autoriser le serveur sur le réseau local si le pare-feu le demande.
4. Choisir quatre joueurs, garder 9 trous, puis démarrer. Passer le téléphone au joueur avant de consulter sa main. Jouer un piège, choisir la cible si demandé, puis confirmer avec OK. Le bouton Trou suivant reste facultatif au rythme du groupe.
5. Pour tester la reprise : fermer puis rouvrir la même adresse dans le même navigateur et toucher Reprendre la partie.

La sauvegarde dépend du navigateur et de l'adresse complète utilisée, port compris. Garder cette adresse pour le test. Le serveur local doit rester disponible pour rouvrir la page ; aucun mode hors ligne installé n'est fourni. Une alerte persistante indique si le navigateur ne peut pas enregistrer les données. Effacer les données du navigateur efface aussi la partie. Ne pas utiliser une navigation privée pour le test terrain.

Ce serveur local sert à un test sur réseau de confiance ; aucun hébergement public n'a été configuré.

## Vérifications automatisées

Avec Node.js, Playwright et Chromium disponibles :

- Démarrer un serveur local dans ce dossier sur le port 8765.
- Depuis ce dossier, exécuter `node tests/verify.cjs`. Les résultats et la capture sont enregistrés dans `tests/`.
- Variables facultatives : `GOLFIGHT_URL` pour l'adresse du serveur, `CHROMIUM_PATH` pour Chromium.

Voir `RAPPORT.md`, `tests/results.json` et `tests/hand-mobile.png`.
