# Portfolio Professionnel - Lenny Gadroy

## Présentation du projet
Ce projet est un portfolio interactif développé dans le cadre de la Licence CRRW à l'EiSINe.
Il présente mon parcours scolaire, mon parcours professionnel, mes compétences et mes réalisations à travers une interface inspirée de la "Time Variance Authority" (TVA) de la série "Loki", alliant design immersif et gamification.

## Architecture et Choix Techniques
Le site a été optimisé pour un serveur dédié Apache avec une structure rigoureuse :
- **HTML5 / CSS3 / JS** : Intégration native avec des frameworks vanilla pour maximiser les performances.
- **Organisation CSS** : Utilisation de variables CSS (`:root`) et d'un fichier unique `style.css` gérant l'ensemble des pages pour assurer une cohérence visuelle et faciliter la maintenance.
- **Gamification** : Implémentation d'un "Skills Shop" avec la gestion de panier (LocalStorage), drag & drop, et système de niveaux.

## Optimisations
- Réécriture d'URL via `.htaccess`.
- Compression des ressources (Minification CSS/JS et format WebP).
- Chargement asynchrone du Critical CSS.
- Sécurisation du serveur (Anti-hotlinking, désactivation de l'indexation).

---
© 2025 Lenny Gadroy - Version 2.0.4