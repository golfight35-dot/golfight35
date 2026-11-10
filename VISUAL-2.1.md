# Golfight 2.1 — Deux écrans pilotes

Branche `golfight-v2-visual`, créée depuis le commit `0d919d902126902afffaec8a1afe340981d5528e` de `golfight-v2`.
Aucun déploiement. Aucune généralisation au reste de l'application : validation visuelle attendue.

Révision actuelle : [GOLFIGHT en un mot, sans écusson](REVUE-GOLFIGHT.md).

## Captures comparatives

Même taille de fenêtre, navigateur Chromium, même carte « Grip inversé », même attaquant Captain, même cible Sniper. Captures prises avec mouvement réduit pour comparer les états finaux. Les données de démonstration sont injectées dans le test uniquement.

| Écran | 320 × 568 px | 390 × 844 px |
|---|---|---|
| Accueil | [Avant / après](visual/compare-home-320.png) | [Avant / après](visual/compare-home-390.png) |
| Attaque | [Avant / après](visual/compare-attack-320.png) | [Avant / après](visual/compare-attack-390.png) |

## Intégration

Accueil : logo typographique GOLFIGHT en un mot et sur une ligne, slogan, éventail de trois catégories, action principale rose. L’écusson sert uniquement de référence à la charte graphique. Les cartes de l'éventail illustrent des cartes existantes ; elles ne représentent jamais la main d'un joueur.

Attaque : catégorie, pictogramme SVG de clubs croisés, titre condensé, effet en texte de 18 px sur fond blanc cassé et bouton de confirmation de 60 px. Les messages d'attaquant et de cible sont ceux du moteur existant. Le bouton OK conserve son action.

Palette exacte : fond #111014, texte #F5F2E4, rose #FF2994, attaque #E82C64, chaos #722FE3, bonus #D6F46A. La couleur d'encre sur corail est #08070A pour atteindre 4,76:1 : #111014 aurait donné seulement 4,49:1 pour le petit texte.

Une seule police locale de 87 556 octets, sous licence OFL conservée dans assets/fonts. Aucun chargement externe à l'exécution, aucune dépendance JavaScript ajoutée. Pictogrammes SVG intégrés au HTML.

Styles limités à l'accueil et à l'attaque. Les couleurs et le style des autres écrans ne sont pas généralisés. Le réglage système prefers-reduced-motion supprime animations et transitions, y compris les anciennes animations décoratives. L'attaque apparaît en 220 ms sans rotation ni débordement transitoire.

## Vérification réalisée

- Script JavaScript inline intégralement identique à celui de `origin/golfight-v2:index.html` : paquets, règles, effets, sauvegarde, reprise, consommation et boutons d'action inchangés.
- Tests existants : les 13 groupes de contrôles de `tests/verify.cjs` passent sous Chromium, dont démarrage, bonus, attaque, chaos, rechargement, fin et sauvegarde défaillante. `tests/results.json` contient les résultats.
- Tests visuels : les 14 contrôles de `tests/visual.cjs` passent : six paires de contraste calculées selon la luminance WCAG et quatre groupes de parcours pour chacune des deux largeurs. Résultats dans `tests/visual-results.json`.
- Contrastes des aplats et textes principaux : texte/fond 16,88:1 ; bouton rose/encre 5,41:1 ; corail/encre renforcée 4,76:1 ; violet/texte clair 5,79:1 ; citron/encre 15,35:1 ; texte secondaire/fond 10,40:1. Il s'agit de mesures ciblées, pas d'une certification complète d'accessibilité.
- Accueil et attaques « Grip inversé », « Une main » (effet long), « Club imposé » : aucune largeur débordante à 320 et 390 px. Confirmation accessible par défilement si le contenu est long, cible tactile supérieure à 44 px, focus clavier visible.
- Sur téléphone partagé : écran de passage conservé ; main invisible avant ouverture et après fermeture, sauvegarde identique après consultation sans jouer ; seule la carte jouée est révélée dans l'annonce d'attaque.
- Police chargée, aucune erreur JavaScript ; durée 220 ms en mode normal, animation absente et contenu visible en mouvement réduit.
- Quatre planches comparatives et les écrans après modification inspectés visuellement.

Commandes pour reproduire, depuis ce dossier avec serveur HTTP local sur 8765, Playwright et Chromium disponibles :

```
node tests/verify.cjs
node tests/visual.cjs
```

Adapter `GOLFIGHT_URL` et `CHROMIUM_PATH` si nécessaire. La suite existante met à jour sa capture de main et ses résultats ; la suite visuelle met à jour visual-results.json.

## Limites et revue attendue

Pas de test sur smartphone physique, Safari iOS ni en plein soleil. Les effets longs et le zoom peuvent nécessiter un défilement vertical, sans réduire le texte. Sur écran de moins de 600 px de haut, les signatures décoratives du bas sont masquées pour conserver l'espace utile ; aucun contrôle de jeu n'est masqué.

La revue porte sur l'identité, la densité de l'accueil et la hiérarchie de la carte avant toute extension au reste des écrans. La branche de référence golfight-v2 n'est pas modifiée.
