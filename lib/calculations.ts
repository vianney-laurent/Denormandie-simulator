import { SimulatorInputs, SimulatorResults, Zone } from './types';

export const RENT_CEILINGS: Record<Zone, number> = {
  'A bis': 18.89,
  'A':     14.03,
  'B1':    11.31,
  'B2':     9.83,
};

const REDUCTION_RATES: Record<number, number> = {
  6:  0.12,
  9:  0.18,
  12: 0.21,
};

export function calculate(inputs: SimulatorInputs): SimulatorResults {
  const {
    surface,
    price,
    renovationCost,
    notaryFeeRate,
    personalContribution,
    interestRate,
    loanDuration,
    engagementDuration,
    manualZone,
    customRentMonthly,
    borrowerInsuranceRate,
    vacancyRate,
    propertyTax,
    condoCharges,
    pnoInsurance,
    managementFeeRate,
  } = inputs;

  // ── Coût total ──────────────────────────────────────────────────────────────
  const notaryFees = price * (notaryFeeRate / 100);
  const totalCost  = price + renovationCost + notaryFees;

  const renovationSharePercent = totalCost > 0 ? (renovationCost / totalCost) * 100 : 0;
  const renovationCompliant    = renovationSharePercent >= 25;

  // ── Avantage fiscal ─────────────────────────────────────────────────────────
  const eligibleBase  = Math.min(totalCost, 300_000, 5_500 * surface);
  const reductionRate = REDUCTION_RATES[engagementDuration] ?? 0.18;
  const totalReduction   = eligibleBase * reductionRate;
  const annualReduction  = totalReduction / engagementDuration;
  const monthlyReduction = annualReduction / 12;

  // ── Financement ─────────────────────────────────────────────────────────────
  const loanAmount = Math.max(0, totalCost - personalContribution);
  let monthlyPayment = 0;
  if (loanAmount > 0 && loanDuration > 0) {
    const r = interestRate / 100 / 12;
    const n = loanDuration * 12;
    monthlyPayment = r === 0 ? loanAmount / n : (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  }
  const totalCreditCost = monthlyPayment * loanDuration * 12 - loanAmount;

  // ── Loyer ───────────────────────────────────────────────────────────────────
  const zone        = manualZone;
  const rentCeiling = RENT_CEILINGS[zone];
  const coeff       = Math.min(0.7 + 19 / surface, 1.2);
  const maxMonthlyRent = surface * rentCeiling * coeff;
  const simulatedRent  = Math.min(customRentMonthly, maxMonthlyRent);
  const effectiveRent  = simulatedRent * (1 - vacancyRate / 100);

  // ── Charges mensuelles ──────────────────────────────────────────────────────
  const borrowerInsuranceMonthly = (loanAmount * borrowerInsuranceRate) / 100 / 12;
  const propertyTaxMonthly       = propertyTax / 12;
  const pnoInsuranceMonthly      = pnoInsurance / 12;
  const managementFeesMonthly    = simulatedRent * managementFeeRate / 100;

  const totalMonthlyCharges  =
    propertyTaxMonthly + condoCharges + pnoInsuranceMonthly + managementFeesMonthly;
  const totalMonthlyExpenses =
    monthlyPayment + borrowerInsuranceMonthly + totalMonthlyCharges;

  // ── Rendements ──────────────────────────────────────────────────────────────
  const grossYield = totalCost > 0 ? (simulatedRent * 12 / totalCost) * 100 : 0;
  const netAnnualIncome =
    effectiveRent * 12 - propertyTax - condoCharges * 12 - pnoInsurance - managementFeesMonthly * 12;
  const netYield = totalCost > 0 ? (netAnnualIncome / totalCost) * 100 : 0;

  const netSavingsEffort = totalMonthlyExpenses - effectiveRent - monthlyReduction;

  return {
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
    simulatedRent,
    effectiveRent,
    borrowerInsuranceMonthly,
    propertyTaxMonthly,
    pnoInsuranceMonthly,
    managementFeesMonthly,
    totalMonthlyCharges,
    totalMonthlyExpenses,
    grossYield,
    netYield,
    netSavingsEffort,
  };
}
