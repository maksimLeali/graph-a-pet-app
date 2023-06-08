import { CustodyLevel, TreatmentType } from "../types";

export const custodyLevelColors: Record<CustodyLevel, string> = {
    OWNER: 'primary',
    SUB_OWNER: 'secondary',
    PET_SITTER: 'tertiary',
  }
  
export const treatmentsColors: Record<TreatmentType, string>= {
  VACCINE: 'var(--vaccine)',
  ANTIPARASITIC: 'var(--antiparasitic)',
  OPERATION: "var(--operation)",
  REMINDER: "var(--reminder)", 
  TABLET: "var(--tablet)"
}