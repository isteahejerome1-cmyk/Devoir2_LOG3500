# Atlas Mondial Interactif - LOG3500

Ce projet est une application web interactive permettant de rechercher des informations détaillées sur n'importe quel pays du monde en temps réel en utilisant l'API REST Countries.

## Fonctionnalités
- Recherche de pays par nom via des requêtes asynchrones (`fetch`, `async/await`).
- Affichage dynamique des données : Drapeau, Capitale, Population, Région, Devise et Langues.
- Gestion robuste des erreurs (erreurs réseau, pays non trouvé 404).
- Respect strict des normes d'accessibilité (A11y) avec gestion des états d'erreur (`aria-invalid`).
- Sécurisation du DOM contre les failles XSS en utilisant exclusivement `textContent`.
- Design moderne et entièrement responsive (adapté aux mobiles et ordinateurs).

## Technologies utilisées
- HTML5 (Structure sémantique)
- CSS3 (Mise en page responsive et Flexbox)
- JavaScript ES6+ (Fetch API, manipulation sécurisée du DOM)

## Développeur
- Conçu et développé par : **Jerome Elie**
- Cours : LOG3500 - Programmation et Design Web I