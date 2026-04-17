# Simulateur Denormandie

Simulateur d'investissement immobilier en dispositif Denormandie. Next.js 14, TypeScript, Tailwind CSS. Interface 100% front, pas de backend. Déployé sur Vercel.

## Stack

- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS (pas de lib UI externe)
- Aucune dépendance tierce hors Next/React/Tailwind

## Structure

```
app/
  layout.tsx      — layout racine, font Geist, metadata SEO
  page.tsx        — page principale : formulaire + résultats côte à côte (client component)
  globals.css     — @tailwind directives uniquement
components/
  CitySearch.tsx  — input autocomplete + sélecteur de zone manuel
  ResultCard.tsx  — card récap complète, mise à jour en temps réel
lib/
  types.ts        — types partagés (Zone, City, SimulatorInputs, SimulatorResults)
  cities.ts       — liste ~80 villes éligibles Denormandie avec zone, + searchCities()
  calculations.ts — toute la logique métier (calculate())
```

## Règles Denormandie implémentées

- Travaux ≥ 25 % du coût total (prix + travaux + frais notaire) — alerte si non respecté
- Base de calcul plafonnée à `min(coût total, 300 000 €, 5 500 € × surface)`
- Taux de réduction : 12 % (6 ans), 18 % (9 ans), 21 % (12 ans)
- Plafonds de loyer 2024 par zone : A bis 18,89 €/m² · A 14,03 · B1 11,31 · B2 9,83
- Formule loyer max officielle : `surface × plafond_zone × min(0,7 + 19/surface, 1,2)`
- Mensualité prêt : formule d'amortissement `C × r / (1 − (1+r)^−n)`

## Calculs exposés dans ResultCard

1. Coût total (prix + travaux + frais notaire)
2. Quote-part travaux (avec alerte < 25 %)
3. Base éligible + taux + réduction totale / annuelle / mensuelle
4. Montant emprunté, mensualité, coût total du crédit
5. Zone détectée, plafond loyer/m², loyer mensuel max, rendement brut
6. **Effort d'épargne net** = mensualité − loyer − économie d'impôt mensuelle

## Valeurs par défaut

```ts
surface: 60 m²
price: 120 000 €
renovationCost: 50 000 €
notaryFeeRate: 7,5 %
personalContribution: 20 000 €
interestRate: 3,5 %
loanDuration: 20 ans
engagementDuration: 9 ans
manualZone: B2
```

## Règle de contribution

**Avant tout `git push`, `npm run build` doit passer sans erreur en local.** Ne jamais pousser du code qui ne compile pas.

## Déploiement Vercel

Importer le repo directement — `package.json` est à la racine, aucune config Root Directory nécessaire.

## Commandes

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```
