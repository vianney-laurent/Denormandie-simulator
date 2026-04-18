import { SimulatorResults, SimulatorInputs, Zone } from '@/lib/types';

const ZONE_LABEL: Record<Zone, string> = {
  'A bis': 'Zone A bis',
  'A':     'Zone A',
  'B1':    'Zone B1',
  'B2':    'Zone B2',
};

const EUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function fmt(n: number) {
  return EUR.format(n);
}

interface Props {
  results: SimulatorResults;
  inputs: SimulatorInputs;
  // undefined = aucune ville sélectionnée ; null = ville sélectionnée sans données ; number = données disponibles
  marketRent: number | null | undefined;
}

export default function ResultCard({ results, inputs, marketRent }: Props) {
  const {
    notaryFees,
    totalCost,
    renovationSharePercent,
    renovationCompliant,
    eligibleBase,
    reductionRate,
    totalReduction,
    annualReduction,
    monthlyReduction,
    loanAmount,
    monthlyPayment,
    totalCreditCost,
    zone,
    rentCeiling,
    maxMonthlyRent,
    grossYield,
  } = results;

  const coeff = Math.min(0.7 + 19 / inputs.surface, 1.2);
  const effectiveCeilingPerSqm = rentCeiling * coeff;
  const marketIsAboveCeiling =
    typeof marketRent === 'number' && marketRent >= effectiveCeilingPerSqm;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-blue-700 px-6 py-4">
        <h2 className="text-white font-semibold text-lg">Résultats de la simulation</h2>
        <p className="text-blue-200 text-sm mt-0.5">
          Engagement {inputs.engagementDuration} ans — {ZONE_LABEL[zone]}
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {/* Coût total */}
        <Section title="Coût total de l'opération">
          <Row label="Prix d'achat"     value={fmt(inputs.price)} />
          <Row label="Travaux"          value={fmt(inputs.renovationCost)} />
          <Row label="Frais de notaire" value={fmt(notaryFees)} />
          <Row label="Coût total"       value={fmt(totalCost)} bold />
          <div
            className={`flex items-start justify-between text-sm pt-1 ${
              renovationCompliant
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            <span>Quote-part travaux</span>
            <div className="text-right">
              <span className="font-medium">{renovationSharePercent.toFixed(1)} %</span>
              {!renovationCompliant && (
                <p className="text-xs mt-0.5">⚠ Minimum 25 % requis</p>
              )}
            </div>
          </div>
        </Section>

        {/* Avantage fiscal */}
        <Section title="Avantage fiscal">
          <Row label="Base éligible"        value={fmt(eligibleBase)} />
          <Row label="Taux de réduction"    value={`${(reductionRate * 100).toFixed(0)} %`} />
          <Row label="Réduction totale"     value={fmt(totalReduction)} bold />
          <Row label="Réduction annuelle"   value={fmt(annualReduction)} />
          <Row label="Réduction mensuelle"  value={fmt(monthlyReduction)} accent />
        </Section>

        {/* Financement */}
        <Section title="Financement">
          <Row label="Montant emprunté"     value={fmt(loanAmount)} />
          <Row label="Mensualité"           value={fmt(monthlyPayment)} bold />
          <Row label="Coût total du crédit" value={fmt(totalCreditCost)} />
        </Section>

        {/* Rendement locatif */}
        <Section title="Rendement locatif">
          <Row label={`Plafond ${ZONE_LABEL[zone]}`} value={`${rentCeiling} €/m²`} />
          <Row label="Loyer mensuel max (plafond)"   value={fmt(maxMonthlyRent)} bold />
          {typeof marketRent === 'number' && (
            <Row
              label="Loyer marché estimé"
              value={`~${marketRent} €/m²`}
              muted
            />
          )}
          <Row label="Rendement brut" value={`${grossYield.toFixed(2)} %`} />
          {/* Indicateur conservateur / optimiste */}
          {typeof marketRent === 'number' ? (
            <div
              className={`mt-2 rounded-lg px-3 py-2 text-xs leading-relaxed ${
                marketIsAboveCeiling
                  ? 'bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                  : 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
              }`}
            >
              {marketIsAboveCeiling ? (
                <>
                  <span className="font-semibold">✓ Simulation conservatrice</span>
                  {' '}— Le marché ({marketRent} €/m²) est au-dessus du plafond Denormandie ({effectiveCeilingPerSqm.toFixed(1)} €/m²). Vous pouvez louer au plafond sans difficulté.
                </>
              ) : (
                <>
                  <span className="font-semibold">⚠ Simulation optimiste</span>
                  {' '}— Le marché ({marketRent} €/m²) est en dessous du plafond ({effectiveCeilingPerSqm.toFixed(1)} €/m²). Le loyer réel sera probablement{' '}
                  {fmt(inputs.surface * marketRent * coeff)}/mois.
                </>
              )}
            </div>
          ) : marketRent === null ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Pas de données de marché disponibles pour cette ville.
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Sélectionnez une ville pour afficher le loyer de marché estimé.
            </p>
          )}
        </Section>

        {/* Cash-flow */}
        <div className="px-6 py-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Cash-flow mensuel
          </h3>
          <CashFlowBlock
            label="Sans crédit d'impôt"
            sublabel="Effort immédiat chaque mois"
            value={maxMonthlyRent - monthlyPayment}
            formula={`Loyer ${fmt(maxMonthlyRent)} − Mensualité ${fmt(monthlyPayment)}`}
          />
          <CashFlowBlock
            label="Avec crédit d'impôt"
            sublabel={`Réduction lissée sur le mois (${fmt(monthlyReduction)}/mois)`}
            value={maxMonthlyRent - monthlyPayment + monthlyReduction}
            formula={`Loyer ${fmt(maxMonthlyRent)} − Mensualité ${fmt(monthlyPayment)} + Fiscal ${fmt(monthlyReduction)}`}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CashFlowBlock({
  label,
  sublabel,
  value,
  formula,
}: {
  label: string;
  sublabel: string;
  value: number;
  formula: string;
}) {
  const positive = value >= 0;
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        positive
          ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-sm font-semibold ${positive ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
            {label}
          </p>
          <p className={`text-xs mt-0.5 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {sublabel}
          </p>
        </div>
        <span className={`text-xl font-bold tabular-nums whitespace-nowrap ${positive ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {positive ? '+' : ''}
          {fmt(value)}
          <span className={`text-xs font-normal ml-1 ${positive ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-500'}`}>
            /mois
          </span>
        </span>
      </div>
      <p className={`text-xs mt-2 ${positive ? 'text-green-600 dark:text-green-500' : 'text-red-400 dark:text-red-500'}`}>
        {formula}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={`tabular-nums ${
          bold
            ? 'font-semibold text-slate-900 dark:text-slate-100'
            : accent
            ? 'font-semibold text-blue-600 dark:text-blue-400'
            : muted
            ? 'text-slate-400 dark:text-slate-500'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
