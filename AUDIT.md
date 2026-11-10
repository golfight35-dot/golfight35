# Audit contradictoire — avant généralisation

**Recommandation : NON PRÊT à généraliser.** L'audit a reproduit une perte d'information lors de la reprise d'une attaque et des défauts de mise en page que les contrôles précédents ne couvraient pas. Des corrections d'interface ont été apportées sur `golfight-v2-visual` uniquement. Aucun merge, déploiement ou changement de production.

## VALIDÉ — effectivement exécuté

- `tests/verify.cjs` : 13 groupes réussis ; `tests/visual.cjs` : 14 contrôles réussis ; nouvelle suite `tests/audit.cjs` : 16 groupes réussis. Ces suites ont été relancées, pas simplement lues dans les JSON. Le succès de la suite d'audit inclut la reproduction du défaut restant : il ne signifie pas que ce défaut est résolu.
- Quatre parcours complets : 2 et 4 joueurs, sur 9 et 18 trous. Tous les pièges distribués et bonus personnels sont consommés ; interruptions après consommation, progression puis fin sans sauvegarde résiduelle. Les rechargements utilisent le stockage réel du contexte navigateur. La simulation de fermeture complète importe la copie du stockage dans un nouveau contexte ; elle n'est pas un redémarrage physique du téléphone.
- Prototype original fourni : une partie créée dans `reference/golfight-v2.html` est reprise dans la version actuelle. Absence de totalHoles : valeur 9 compatible. Un schéma sans bonus est refusé sans écraser son contenu. Aucune preuve n'est disponible pour d'autres anciennes versions non fournies.
- 0 et 1 joueur refusés, 10 joueurs reçoivent trois pièges chacun, 11 sont refusés. Foxy et Fyzio sélectionnés et utilisés ; surnom HTML affiché comme texte ; doublon « foxy » reconnu.
- Accueil, joueurs, hub, passage privé, main, cible, attaque, annonce bonus/chaos, fin : contrôlés à 320×568, 390×844, 360×800 et 800×360. Contrôles supplémentaires à 360×800 : zoom de page à 150 % et textes agrandis par styles injectés à 150 %. Marque et illustration décorative exclues de cette dernière simulation ; cela ne reproduit pas exactement les réglages de texte natifs iOS/Android.
- Aucun débordement horizontal dans ces matrices ; tous les boutons visibles atteignent au moins 44×44 px et peuvent être amenés entièrement dans la fenêtre par défilement. Marges haut/bas de 44/34 px simulées par CSS : action principale accessible. Ces marges simulées ne valident pas une vraie encoche.
- Captures inspectées visuellement : accueil, joueurs, main en paysage, effet long, puis hub, passage privé, cible, chaos, bonus et fin. La lecture des captures a confirmé les limites de défilement ci-dessous, malgré des assertions de largeur réussies.
- Aucun écusson affiché ni splash ajouté ; GOLFIGHT reste en un mot. Comparaison de source : DECK_BASE, BONUS_DECK, save, load, clearSave, validState, loadRoster et saveRoster sont identiques à `golfight-v2`. Les changements JavaScript concernent uniquement navigation et accessibilité de l'interface.

## Défauts corrigés dans cet audit

| Gravité | Défaut reproduit | Correction et preuve |
|---|---|---|
| P2 | Ajout de surnom : largeur interne 349 px pour 280 px disponibles à 320 px ; débordement aussi à 360 px | Champ rétractable, retour à la ligne de la rangée, saisie à 16 px ; matrice et capture des contrôles |
| P2 | L'accueil et l'éventail dépendent du viewport, insuffisant quand le contenu est rétréci par le zoom | Marque et éventail adaptés à la largeur du conteneur ; matrice zoom 150 % |
| P2 | Les effets de main et de chaos reposaient sur du petit texte directement sur dégradé coloré | Panneau clair, encre sombre et texte à 17 px ; effet d'attaque conservé à 18 px ; catégories sur fond clair |
| P2 | Une main ouverte reste exposée lors d'une simple mise en arrière-plan, faute de verrouillage de vue | Masquage sur visibilitychange/pagehide/pageshow restauré vers l'écran de passage ; aucune écriture de sauvegarde ajoutée. Pagehide simulé, aller/retour de navigation réel et reload vérifiés. Pas de preuve d'un snapshot système natif |
| P2 | Tuiles de joueurs réalisées en div cliquable | Boutons natifs, couleur héritée et état aria-pressed des sélections ; les parcours existants restent fonctionnels |
| P3 | Position de défilement conservée lors d'un changement de vue | Retour en haut à chaque affichage ; aucune modification de l'état métier |

## À CORRIGER — défauts et risques restants

**P1 — Annonce perdue après résolution, avant OK.** Reproduction : jouer une attaque, sélectionner la cible, recharger immédiatement puis reprendre. La carte demeure dans la défausse et n'est pas consommée deux fois, mais l'application revient au hub sans rappeler la cible ni l'effet. Le stockage ne conserve pas la cible de la dernière action ; elle ne peut pas être reconstruite de façon fiable. Même limite de rappel pour bonus/chaos après interruption. Non corrigé : restaurer durablement cette information demanderait une évolution explicite du contenu sauvegardé, interdite par la présente consigne. Décision à prendre avant généralisation : accepter ce comportement ou autoriser une correction ciblée et compatible de reprise.

**P2 — Défilement encore important.** En paysage, avec texte agrandi, ou à la sélection parmi huit joueurs, certaines actions sont sous le premier écran visible. Elles sont atteignables, mais les assertions « bouton accessible après scroll » ne prouvent pas une utilisation rapide à une main. Les annonces bonus et le choix de cible méritent notamment une revue des actions de bas d'écran sur vrai appareil.

**P2 — CSS à consolider avant extension.** Plusieurs surcharges et media queries se répètent : taille du mot-symbole, dimensions de l'éventail, hauteur du pictogramme et styles d'effet. Certaines sont des variantes légitimes, d'autres des strates successives. Les correctifs de cet audit sont regroupés dans une section identifiée ; la cascade n'a pas été réécrite sur tous les écrans. Il faut organiser les composants et breakpoints avant de décliner la charte, plutôt que dupliquer ces exceptions.

**P3 — Anciennes données inconnues.** Les sauvegardes réelles du prototype fourni sont compatibles. Une sauvegarde sans structure de bonus est conservée mais inutilisable ; aucune migration ne peut être déduite d'une version non disponible.

## Revue des tests précédents

Les premières suites couvraient surtout les deux pilotes et une géométrie de main. Elles ne couvraient pas le champ surnom à 320 px, un parcours 18 trous complet, le zoom, ni la perte d'annonce après résolution. La suite visuelle injecte des états pour cibler des cartes et son contrôle de contraste porte sur des paires de couleurs, pas sur chaque pixel d'un dégradé. La nouvelle suite joue les cartes distribuées dans les quatre parcours complets ; ses matrices d'affichage emploient aussi des fixtures explicitement contrôlées. Ces approches se complètent, sans équivaloir à une partie terrain.

## À TESTER SUR TÉLÉPHONE

Plein soleil et reflets, pouce et gants éventuels, clavier ouvert, changement d'application/appel, capture du sélecteur d'applications, retour arrière et cache de Safari, fermeture forcée, stockage privé/limité, zoom et taille de texte natifs, encoche/barre de geste. Aucun de ces tests physiques n'est déclaré effectué. Les clés et le mode de stockage restent inchangés ; le téléphone, navigateur et adresse doivent rester identiques pour la reprise.

## Décision

Conserver les pilotes et les corrections ciblées pour une revue sur appareil. Résoudre ou accepter explicitement P1, puis vérifier le défilement à une main et consolider le CSS avant d'autoriser une généralisation écran par écran. Aucun plan d'implémentation de la généralisation n'est lancé à ce stade.

Preuves : [résultats fonctionnels](tests/results.json), [résultats visuels](tests/visual-results.json), [nouvel audit exécuté](tests/audit-results.json), [captures d'audit](visual/audit).
