# Corrections finales — reprise et CSS

**Prêt pour une généralisation progressive après validation. Pas encore validé pour diffusion terrain.** Aucun merge ni déploiement ; aucun autre écran n'a reçu une nouvelle identité.

## Reprise corrigée

Un champ facultatif `announcement` contient uniquement l'annonce non confirmée : catégorie, joueur, cible éventuelle, nom et effet. La consommation et l'annonce sont enregistrées ensemble dans la même écriture du même état local. La reprise affiche cette annonce par une fonction de rendu seule : elle ne rejoue ni carte ni bonus, ne réouvre pas de main privée et ne modifie pas les stocks. OK efface le champ temporaire et sauvegarde l'état via le parcours existant.

Les sauvegardes sans ce champ gardent leur comportement : reprise au hub. Les annonces incohérentes sont ignorées par la reprise plutôt qu'affichées. Une interruption avant le choix de cible ne consomme toujours rien. Aucune carte, règle ou clé de stockage n'a changé.

## CSS consolidé

Déclarations masquées par une déclaration identique plus tard supprimées dans chaque contexte ; blocs conditionnels adjacents identiques regroupés ; règle inutilisée de marque déposée retirée ; CSS remis en forme. La cascade est volontairement conservée pour préserver les variantes légitimes, plutôt que déplacer aveuglément tous les breakpoints. Vingt déclarations redondantes ont été retirées avant suppression de la règle inutilisée ; neuf blocs media deviennent huit. Les styles de base HTML non concernés ne sont pas réécrits.

## Vérification exécutée

- Les suites fonctionnelle (13), visuelle (14) et audit complet (16) repassent. Le contrôle qui reproduisait P1 vérifie désormais le parcours de restauration et confirmation ; il ne considère plus la perte d'annonce comme un résultat attendu.
- `tests/recovery.cjs` vérifie explicitement attaque, chaos et bonus : contenu exact de l'annonce, attaquant/cible, rechargements répétés, navigation aller/retour réelle, fermeture/réouverture de page, nouveau contexte avec import du stockage, confirmation, reprise suivante et sauvegarde sans nouveau champ. Comparaison des mains, bonus et défausse : aucune deuxième consommation.
- Dix comparaisons avant/après CSS (accueil et effet long) : **zéro pixel différent** à 320×568, 390×844, 360×800, 800×360 et 360×800 avec zoom 150 %. Comparaison avec le même navigateur, les mêmes polices et le mouvement réduit. Résultats : [css-comparison.json](tests/css-comparison.json).
- Matrice d'audit : textes agrandis par injection de styles à 150 %, effets longs et actions accessibles après défilement. Il ne s'agit pas du réglage natif du texte iOS/Android.

### Captures avant / après

| Écran | 320 px | 390 px |
|---|---|---|
| Accueil | [Avant](visual/final/home-320-568-1-before.png) · [Après](visual/final/home-320-568-1-after.png) | [Avant](visual/final/home-390-844-1-before.png) · [Après](visual/final/home-390-844-1-after.png) |
| Effet long | [Avant](visual/final/attack-320-568-1-before.png) · [Après](visual/final/attack-320-568-1-after.png) | [Avant](visual/final/attack-390-844-1-before.png) · [Après](visual/final/attack-390-844-1-after.png) |

## Risques résiduels

Une écriture locale impossible reste signalée ; aucune application locale ne peut garantir une reprise après effacement des données ou échec du stockage. La fermeture complète du navigateur est simulée par import du stockage, sans arrêt brutal réel du système. Safari, plein soleil, clavier natif et gestes à une main restent à vérifier sur téléphone avant diffusion. Le défilement demeure nécessaire avec texte agrandi ou en paysage. L'absence d'annonces dans les anciennes sauvegardes ne permet pas de reconstituer rétroactivement une cible perdue.

## Plan proposé — non engagé

1. Joueurs et hub : même vocabulaire graphique, sélection et actions principales évidentes ; conserver Foxy, Fyzio et les surnoms libres.
2. Passage privé et main : confidentialité prioritaire, effet plus visible que le décor, fermeture rapide et navigation au pouce.
3. Bonus et chaos : structure de lecture commune à l'attaque, catégories vert citron et violet distinctes, même confirmation/reprise.
4. Fin : conclusion courte et relance claire.

À chaque lot : revue à 320/360/390 px, paysage et agrandissement ; suite de reprise ; captures et validation avant le lot suivant. GOLFIGHT reste en un mot sur une ligne ; aucun écusson ni splash. Pas de nouvelle mécanique ni réécriture du moteur.
