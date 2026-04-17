import { SimulatorResults, SimulatorInputs, Zone } from '@/lib/types';

const ZONE_LABEL: Record<Zone, string> = {
  'A bis': 'Zone A bis',
  'A': 'Zone A',
  'B1': 'Zone B1',
  'B2': 'Zone B2',
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
}

export default function ResultCard({ results, inputs }: Props) {
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
    netSavingsEffort,
  } = results;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-700 px-6 py-4">
        <h2 className="text-white font-semibold text-lg">Résultats de la simulation</h2>
        <p className="text-blue-200 text-sm mt-0.5">
          Engagement {inputs.engagementDuration} ans — {ZONE_LABEL[zone]}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Coût total */}
        <Section title="Coût total de l'opération">
          <Row label="Prix d'achat" value={fmt(inputs.price)} />
          <Row label="Travaux" value={fmt(inputs.renovationCost)} />
          <Row label="Frais de notaire" value={fmt(notaryFees)} />
          <Row label="Coût total" value={fmt(totalCost)} bold />
          <div
            className={`flex items-start justify-between text-sm pt-1 ${
              renovationCompliant ? 'text-green-700' : 'text-red-600'
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
          <Row label="Base éligible" value={fmt(eligibleBase)} />
          <Row label="Taux de réduction" value={`${(reductionRate * 100).toFixed(0)} %`} />
          <Row label="Réduction totale" value={fmt(totalReduction)} bold />
          <Row label="Réduction annuelle" value={fmt(annualReduction)} />
          <Row label="Réduction mensuelle" value={fmt(monthlyReduction)} accent />
        </Section>

        {/* Financement */}
        <Section title="Financement">
          <Row label="Montant emprunté" value={fmt(loanAmount)} />
          <Row label="Mensualité" value={fmt(monthlyPayment)} bold />
          <Row label="Coût total du crédit" value={fmt(totalCreditCost)} />
        </Section>

        {/* Rendement locatif */}
        <Section title="Rendement locatif">
          <Row label={`Plafond ${ZONE_LABEL[zone]}`} value={`${rentCeiling} €/m²`} />
          <Row label="Loyer mensuel max" value={fmt(maxMonthlyRent)} bold />
          <Row label="Rendement brut" value={`${grossYield.toFixed(2)} %`} />
        </Section>

        {/* Effort d'épargne net */}
        <div className="px-6 py-4">
          <div
            className={`rounded-xl px-4 py-4 ${
              netSavingsEffort <= 0 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-sm font-semibold ${
                  netSavingsEffort <= 0 ? 'text-green-800' : 'text-amber-800'
                }`}
              >
                Effort d'épargne mensuel net
              </span>
              <span
                className={`text-xl font-bold tabular-nums ${
                  netSavingsEffort <= 0 ? 'text-green-700' : 'text-amber-700'
                }`}
              >
                {netSavingsEffort > 0 ? '+' : ''}
                {fmt(netSavingsEffort)}
              </span>
            </div>
            <p
              className={`text-xs mt-2 leading-relaxed ${
                netSavingsEffort <= 0 ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              Mensualité {fmt(monthlyPayment)} − Loyer {fmt(maxMonthlyRent)} − Économie fiscale{' '}
              {fmt(monthlyReduction)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span
        className={`tabular-nums ${
          bold ? 'font-semibold text-slate-900' : accent ? 'font-semibold text-blue-600' : 'text-slate-700'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
