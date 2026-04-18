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
  grossYield: number;
  netSavingsEffort: number;
}
