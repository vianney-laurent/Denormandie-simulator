export type Zone = 'A bis' | 'A' | 'B1' | 'B2';

export interface City {
  name: string;
  zone: Zone;
  marketRent?: number;
}

export interface SimulatorInputs {
  surface: number;
  price: number;
  renovationCost: number;
  notaryFeeRate: number;
  personalContribution: number;
  interestRate: number;
  loanDuration: number;
  engagementDuration: 6 | 9 | 12;
  manualZone: Zone;
  customRentMonthly: number;
  // Charges & gestion
  borrowerInsuranceRate: number; // % du capital emprunté / an
  vacancyRate: number;           // % du temps sans locataire
  propertyTax: number;           // taxe foncière €/an
  condoCharges: number;          // charges copro non récupérables €/mois
  pnoInsurance: number;          // assurance PNO €/an
  managementFeeRate: number;     // frais d'agence % du loyer mensuel
}

export interface SimulatorResults {
  notaryFees: number;
  totalCost: number;
  renovationSharePercent: number;
  renovationCompliant: boolean;
  eligibleBase: number;
  reductionRate: number;
  totalReduction: number;
  annualReduction: number;
  monthlyReduction: number;
  loanAmount: number;
  monthlyPayment: number;
  totalCreditCost: number;
  zone: Zone;
  rentCeiling: number;
  maxMonthlyRent: number;
  simulatedRent: number;
  effectiveRent: number;            // simulatedRent après vacance
  borrowerInsuranceMonthly: number;
  propertyTaxMonthly: number;
  pnoInsuranceMonthly: number;
  managementFeesMonthly: number;
  totalMonthlyCharges: number;      // tout hors mensualité prêt
  totalMonthlyExpenses: number;     // mensualité + assurance + charges
  grossYield: number;
  netYield: number;
  netSavingsEffort: number;
}
