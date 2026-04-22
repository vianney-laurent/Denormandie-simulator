# Simulateur Denormandie

Simulateur d'investissement immobilier locatif sous dispositif **Denormandie**. Saisissez les paramètres de votre opération — prix, travaux, financement, durée d'engagement — et obtenez instantanément tous les indicateurs clés : réduction d'impôt, loyer maximum, mensualité, et surtout le **cash-flow réel mois par mois**, avant et après crédit d'impôt.

Interface entièrement front-end, aucune donnée transmise.

## Fonctionnalités

- **Recherche de ville** avec détection automatique de la zone locative (A bis / A / B1 / B2)
- **Aide de couverture villes** : compteur de villes de la base locale + lien vers le simulateur officiel de zonage pour vérification exhaustive
- **Vérification du seuil travaux** ≥ 25 % du coût total, avec alerte visuelle
- **Réduction d'impôt** calculée selon la durée d'engagement (6, 9 ou 12 ans)
- **Plafonds de loyer 2024** par zone avec formule officielle
- **Mensualité de prêt** par amortissement constant
- **Double cash-flow** :
  - Sans crédit d'impôt — effort mensuel brut (loyer − mensualité)
  - Avec crédit d'impôt — bilan net en lissant la réduction sur le mois
- **Aide au loyer pertinent** : bouton de loyer prudent (−5 % vs marché local si disponible, sinon 90 % du plafond Denormandie)

## Stack

- [Next.js 14](https://nextjs.org/) — App Router
- TypeScript strict
- [Tailwind CSS](https://tailwindcss.com/)
- Aucune librairie UI externe

## Démarrage

```bash
npm install
npm run dev   # http://localhost:3000
```

## Règles Denormandie implémentées

| Règle | Détail |
|---|---|
| Seuil travaux | ≥ 25 % du coût total (prix + travaux + frais notaire) |
| Base éligible | `min(coût total, 300 000 €, 5 500 € × surface)` |
| Taux réduction | 12 % sur 6 ans · 18 % sur 9 ans · 21 % sur 12 ans |
| Plafond loyer A bis | 18,89 €/m² |
| Plafond loyer A | 14,03 €/m² |
| Plafond loyer B1 | 11,31 €/m² |
| Plafond loyer B2 | 9,83 €/m² |
| Formule loyer max | `surface × plafond × min(0,7 + 19/surface, 1,2)` |
| Mensualité prêt | `C × r / (1 − (1+r)^−n)` |

## Déploiement

Hébergé sur [Vercel](https://vercel.com/). Importer le dépôt directement — `package.json` est à la racine, aucune configuration supplémentaire requise.

---

> Simulation indicative. Consultez un conseiller fiscal pour valider votre investissement.
