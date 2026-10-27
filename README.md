# Mutuelle Boréale — validation avant intégration

Petit résumé de sinistres fictifs pour démontrer deux contrôles indépendants : qualité du code et détection de secrets. Aucun déploiement, compte applicatif ou donnée réelle.

## Installation et exécution

Prérequis : Git, Node.js 24.19.0 (branche LTS 24), npm et accès réseau à npm et GitHub. Windows x64/ARM64, Linux x64/ARM64 et macOS x64/ARM64 sont pris en charge par l’installateur du détecteur. Sous Windows, PowerShell est requis; ailleurs, `tar` est requis.

```powershell
npm ci
npm run setup:scanner
npm start
npm run lint
npm run scan:secrets
```

Résultat attendu : trois sinistres fictifs, réserves totales de 19 600,00 $, puis deux commandes de validation avec code de sortie 0. ESLint 9.39.5 est verrouillé avec ses dépendances dans `package-lock.json`. Gitleaks 8.30.1 est téléchargé depuis sa publication officielle, sa somme SHA-256 est comparée au fichier de sommes officiel, puis sa version est vérifiée. Il reste dans `.tools/`, hors Git. La même installation et les mêmes commandes sont utilisées dans Actions.

## Préparation GitHub

Dépôt dédié : https://github.com/Eveets/promut-demo-cicd. Actions doit être activé. Le compte doit pouvoir envoyer une branche et ouvrir une PR. Les droits d’administration servent à configurer la protection.

Après une première exécution verte, dans Settings → Branches, protéger `main` : exiger une PR et les contrôles « Qualité du code » et « Détection de secrets ». Appliquer aussi aux administrateurs et interdire le contournement. Aucun approbateur additionnel n’est nécessaire pour cette répétition à une personne. Vérifier l’effet réel dans la zone de fusion de la PR fautive. Le workflow seul ne rend pas ses résultats obligatoires.

## Répéter l’échec et la correction

Partir d’une référence verte propre et créer une nouvelle branche :

```powershell
git switch main
git pull --ff-only
git switch -c demo/repetition-01
```

Dans `src/resume.mjs`, ajouter une variable inutilisée et une affectation `cleDemo` contenant le marqueur fictif `BOREALE_DEMO_SANS_ACCES_0001`; utiliser la variable `cleDemo` dans un message pour isoler les deux erreurs. Le marqueur n’accorde aucun accès. Exécuter séparément les deux contrôles : chacun doit échouer. Examiner la différence, enregistrer le changement, envoyer la branche et ouvrir une PR indiquant explicitement qu’elle ne doit pas être fusionnée.

Montrer les deux contrôles rouges et la fusion bloquée, y compris pour le présentateur. Retirer les lignes ajoutées, relancer les validations et le script, puis envoyer la correction sur la même branche. Les contrôles doivent devenir verts sans changement des règles ou du workflow. Ne pas fusionner.

## Portée et limites

Gitleaks conserve ses règles habituelles et ajoute une règle pédagogique pour une affectation de clé précise. Mentionner simplement le marqueur dans cette documentation est accepté. Les fichiers courants sont analysés; l’historique Git n’est pas analysé. Retirer le marqueur du code dans le commit suivant suffit donc pour cette démonstration. Les dépendances, le binaire téléchargé et les métadonnées Git sont exclus; le code applicatif est inclus. Les valeurs détectées sont masquées à 100 % dans les journaux.

Une analyse verte ne garantit pas l’absence de tout secret ou défaut. Ce projet est un support pédagogique, sans mécanisme complet de traitement des sinistres.

## Reprise et remise à zéro

Si l’installation échoue, vérifier les accès réseau et les versions, puis relancer `npm ci` ou `npm run setup:scanner`. Ne pas affaiblir les validations pour passer au vert. Si Actions tarde, montrer la répétition enregistrée dans le dépôt et exécuter les commandes localement, en distinguant clairement les résultats locaux et distants.

Pour recommencer, garder la PR précédente comme preuve et repartir de `main` dans une nouvelle branche. Ne pas forcer un envoi ni réécrire l’historique. Garder les prompts et les captures de présentation dans le dépôt de préparation, séparés du dossier de travail en direct.

## Références techniques

- [Cycle des versions de Node.js](https://nodejs.org/en/about/previous-releases)
- [Gitleaks : analyse de fichiers et configuration](https://github.com/gitleaks/gitleaks)
- [Actions checkout](https://github.com/actions/checkout) et [setup-node](https://github.com/actions/setup-node), versions fixées par SHA.
- [Protections GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
