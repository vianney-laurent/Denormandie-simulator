'use client';

import { useState, useMemo, useEffect } from 'react';
import CitySearch from '@/components/CitySearch';
import ResultCard from '@/components/ResultCard';
import ThemeToggle from '@/components/ThemeToggle';
import { SimulatorInputs, Zone, City } from '@/lib/types';
import { calculate } from '@/lib/calculations';

// Plafond initial pour B2 / 60 m² (coeff 1.0167 → ~600 €/mois)
const INITIAL_RENT = Math.round(60 * 9.83 * Math.min(0.7 + 19 / 60, 1.2));

const DEFAULTS: SimulatorInputs = {
  surface: 60,
  price: 120_000,
  renovationCost: 50_000,
  notaryFeeRate: 7.5,
  personalContribution: 20_000,
  interestRate: 3.5,
  loanDuration: 20,
  engagementDuration: 9,
  manualZone: 'B2',
  customRentMonthly: INITIAL_RENT,
};

export default function Home() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULTS);
  const [selectedCity, setSelectedCity] = useState<City | null | undefined>(undefined);

  const results = useMemo(() => calculate(inputs), [inputs]);

  // Clamp le loyer simulé si le plafond baisse (changement de zone ou de surface)
  useEffect(() => {
    if (inputs.customRentMonthly > results.maxMonthlyRent) {
      setInputs(prev => ({
        ...prev,
        customRentMonthly: Math.round(results.maxMonthlyRent),
      }));
    }
  }, [results.maxMonthlyRent]); // eslint-disable-line react-hooks/exhaustive-deps

  // marketRent : undefined = pas de ville, null = ville sans données, number = données dispo
  const marketRent: number | null | undefined =
    selectedCity === undefined ? undefined :
    selectedCity === null      ? null :
    (selectedCity.marketRent ?? null);

  // Loyer mensuel estimé selon les données de marché (pour les marqueurs du slider)
  const marketMonthlyRent =
    typeof marketRent === 'number' ? marketRent * inputs.surface : null;

  function setNum(field: keyof SimulatorInputs, raw: string) {
    const value = parseFloat(raw);
    if (!isNaN(value)) setInputs(prev => ({ ...prev, [field]: value }));
  }

  function setInt(field: keyof SimulatorInputs, raw: string) {
    const value = parseInt(raw, 10);
    if (!isNaN(value)) setInputs(prev => ({ ...prev, [field]: value }));
  }

  function handleCitySelect(city: City | null) {
    setSelectedCity(city);
    if (city?.marketRent) {
      // Positionne le slider sur le loyer de marché estimé (sans coeff — données brutes)
      const marketTotal = city.marketRent * inputs.surface;
      setInputs(prev => ({
        ...prev,
        customRentMonthly: Math.min(Math.round(marketTotal), Math.round(results.maxMonthlyRent)),
      }));
    }
  }

  const sliderMax = Math.round(results.maxMonthlyRent);
  const sliderValue = Math.min(inputs.customRentMonthly, sliderMax);
  const rentPerSqm = inputs.surface > 0 ? sliderValue / inputs.surface : 0;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Simulateur Denormandie</h1>
            <p className="text-blue-200 mt-1 text-sm">
              Estimez votre investissement locatif avec rénovation et calculez votre avantage fiscal
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Formulaire */}
          <div className="space-y-6">
            {/* Bien immobilier */}
            <Card title="Bien immobilier">
              <Field label="Surface habitable" unit="m²">
                <input
                  type="number"
                  defaultValue={inputs.surface}
                  onChange={e => setNum('surface', e.target.value)}
                  className="input"
                  min="9"
                  step="1"
                />
              </Field>
              <Field label="Prix d'achat" unit="€">
                <input
                  type="number"
                  defaultValue={inputs.price}
                  onChange={e => setNum('price', e.target.value)}
                  className="input"
                  min="0"
                  step="1000"
                />
              </Field>
              <Field label="Coût des travaux" unit="€">
                <input
                  type="number"
                  defaultValue={inputs.renovationCost}
                  onChange={e => setNum('renovationCost', e.target.value)}
                  className="input"
                  min="0"
                  step="1000"
                />
              </Field>
              <Field label="Frais de notaire" unit="%">
                <input
                  type="number"
                  defaultValue={inputs.notaryFeeRate}
                  onChange={e => setNum('notaryFeeRate', e.target.value)}
                  className="input"
                  min="0"
                  max="15"
                  step="0.1"
                />
              </Field>
            </Card>

            {/* Financement */}
            <Card title="Financement">
              <Field label="Apport personnel" unit="€">
                <input
                  type="number"
                  defaultValue={inputs.personalContribution}
                  onChange={e => setNum('personalContribution', e.target.value)}
                  className="input"
                  min="0"
                  step="1000"
                />
              </Field>
              <Field label="Taux d'intérêt annuel" unit="%">
                <input
                  type="number"
                  defaultValue={inputs.interestRate}
                  onChange={e => setNum('interestRate', e.target.value)}
                  className="input"
                  min="0"
                  max="20"
                  step="0.05"
                />
              </Field>
              <Field label="Durée du prêt" unit="ans">
                <input
                  type="number"
                  defaultValue={inputs.loanDuration}
                  onChange={e => setInt('loanDuration', e.target.value)}
                  className="input"
                  min="1"
                  max="30"
                  step="1"
                />
              </Field>
            </Card>

            {/* Dispositif */}
            <Card title="Dispositif Denormandie">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Ville
                </label>
                <CitySearch
                  zone={inputs.manualZone}
                  onZoneChange={(z: Zone) => setInputs(prev => ({ ...prev, manualZone: z }))}
                  onCitySelect={handleCitySelect}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Durée d'engagement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([6, 9, 12] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setInputs(prev => ({ ...prev, engagementDuration: d }))}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        inputs.engagementDuration === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      {d} ans — {d === 6 ? '12 %' : d === 9 ? '18 %' : '21 %'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider loyer */}
              <div className="pt-1 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Loyer mensuel simulé
                  </label>
                  <div className="text-right tabular-nums shrink-0">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {fmt(sliderValue)}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500 ml-1.5">
                      {rentPerSqm.toFixed(1)} €/m²
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={sliderMax}
                  step={5}
                  value={sliderValue}
                  onChange={e =>
                    setInputs(prev => ({
                      ...prev,
                      customRentMonthly: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 bg-slate-200 dark:bg-slate-700"
                />

                {/* Bornes du slider */}
                <div className="flex justify-between select-none">
                  <span className="text-xs text-slate-400 dark:text-slate-500">0 €</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Plafond {fmt(sliderMax)}
                  </span>
                </div>

                {/* Référence marché sous le slider */}
                {typeof marketRent === 'number' && marketMonthlyRent !== null ? (
                  <p className="text-xs text-blue-500 dark:text-blue-400">
                    Référence marché : ~{fmt(marketMonthlyRent)}/mois · {marketRent} €/m²
                  </p>
                ) : marketRent === undefined ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Sélectionnez une ville pour afficher le loyer de marché estimé.
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Pas de données de marché disponibles pour cette ville.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Résultats */}
          <div className="lg:sticky lg:top-8">
            <ResultCard
              results={results}
              inputs={inputs}
              marketRent={marketRent}
            />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Simulation indicative. Plafonds de loyer 2024. Données de marché : estimation CLAMEUR / SeLoger 2024.
          Consultez un conseiller fiscal pour valider votre investissement.
        </p>
      </footer>
    </div>
  );
}

const EUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
function fmt(n: number) { return EUR.format(n); }

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}{' '}
        <span className="font-normal text-slate-400 dark:text-slate-500">({unit})</span>
      </label>
      {children}
    </div>
  );
}
