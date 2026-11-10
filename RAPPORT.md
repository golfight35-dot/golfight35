# Diagnostic et livraison — 10 novembre 2026

## Existant vérifié

Un fichier HTML autonome comprenant une identité visuelle embarquée, huit surnoms prédéfinis, ajout de surnoms, choix 9/18 trous, téléphone partagé avec écran de passage, main privée navigable par flèches ou glissement, trois pièges par joueur sans repioche, un bonus personnel, cible pour les attaques, chaos pour le groupe, passage manuel au trou suivant, fin de partie, sauvegarde locale et reprise.

32 cartes pièges au total : 26 exemplaires d'attaque couvrant 12 effets distincts et 6 cartes chaos distinctes. Cinq bonus possibles. Les textes et les multiplicateurs des deux paquets sont strictement identiques au fichier fourni. L'inventaire complet figure dans CARTES.md.

Aucun score, handicap, bouclier, monnaie, compte utilisateur ou service externe. Le prototype ne renouvelle pas les bonus à mi-parcours en format 18 trous. Ce comportement reste inchangé ; le commentaire initial « une fois sur 9 trous » et l'option 18 trous créent une ambiguïté de règle à clarifier avant toute évolution.

## Problèmes constatés avant correction

- `resumeGame()` plante avec une sauvegarde incomplète : `Cannot read properties of undefined (reading '0')` reproduit sous Chromium avec `{players:['Captain']}`.
- Le surnom `<b>Test</b>` crée une balise HTML dans la liste : reproduit sous Chromium.
- Nouvelle partie : écrasement de la sauvegarde sans confirmation, constaté dans le code.
- Fin anticipée : effacement sans confirmation, constaté dans le code.
- Exceptions de stockage ignorées ; aucun avertissement en cas de perte de persistance.
- Résolution d'un piège réentrante : pending restait renseigné après consommation.
- Zoom désactivé, absence de marges minimales quand safe-area vaut zéro.

## Corrections ciblées

- Validation des données de reprise et du roster ; sauvegarde invalide conservée, erreur expliquée sans plantage.
- Reprise sur le hub avec main masquée et action en attente abandonnée. Une carte déjà résolue reste consommée ; une sélection non résolue ne consomme rien.
- Confirmation avant remplacement d'une sauvegarde et fin anticipée.
- Alerte visible en cas d'échec de stockage ; aucun ajout de service distant.
- Échappement des surnoms dans les vues HTML.
- Protection contre une seconde résolution du même piège.
- Contrôle technique avant distribution si le paquet ne permet pas trois pièges par joueur : dix joueurs maximum avec les 32 cartes existantes.
- Zoom autorisé, zones tactiles de navigation d'au moins 44 px, focus clavier visible, marges safe-area et contraste des liens renforcés.
- Libellé explicite de fin au dernier trou ; bouton de reprise masqué après fin.

## Tests réellement exécutés

Chromium installé dans l'environnement, piloté par Playwright, application servie en HTTP local. Treize groupes de contrôles réussis : détails dans tests/results.json. Parcours UI comprenant quatre joueurs, distribution, bonus, attaque ciblée et chaos, rechargements, neuf trous et fin. Choix 18 trous contrôlé au démarrage. Tests d'annulation des actions destructrices, surnoms HTML, sauvegarde et roster invalides, stockage en échec simulé. Aucune erreur JavaScript non interceptée.

Affichage et accès au retour de la main testés à 320×568, 390×844 et 844×390 sans débordement horizontal. Capture de la main à 390×844 inspectée visuellement. Contrôle d'identité des tableaux DECK_BASE et BONUS_DECK par comparaison du texte source : identiques.

La distribution étant aléatoire, le test chaos utilise un état contrôlé si aucune carte chaos n'est distribuée. Les cas de stockage invalide/indisponible sont injectés pour vérifier le comportement d'erreur ; aucune donnée réelle de joueur n'est utilisée.

## Limites connues

- Pas de test sur appareil physique, Safari iOS, plein soleil, ni sur un vrai parcours. Lisibilité extérieure à confirmer par les quatre joueurs.
- Pas de synchronisation entre téléphones, ni récupération si les données du navigateur sont supprimées.
- Les effets déjà consommés ne sont pas réaffichés après rechargement de l'écran d'annonce ; la reprise ramène au hub, comme le prototype.
- Pas de retour au trou précédent ; comportement conservé. Les flèches de main ont été testées ; le geste tactile réel reste à vérifier sur téléphone.
- Format 18 trous disponible, sans changement des règles de distribution ni de renouvellement du bonus. Le parcours complet de 18 trous n'a pas été joué dans le test automatisé.
- Au-delà de dix participants, le paquet ne permet pas trois pièges chacun ; démarrage empêché avec explication.

## Préservation et dépôt

Référence intacte : SHA-256 `19d46e4694d4afcbebbc401ed147f595e3d4bbece883b9e00c0551d51a6e8fae`.
Travail isolé sur branche locale `golfight-v2`. Aucun projet golfightcaptain modifié.
Dépôt de livraison : https://github.com/golfight35-dot/golfight35, branche golfight-v2. Le fichier déjà ajouté par le propriétaire sur main est conservé. Aucun déploiement public effectué.
