import { IconName } from "../components";
import { CustodyLevel, TreatmentType, Gender } from "../types";

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

export const gendersColor: Record<Gender,{color: string, iconName: IconName} >={
  MALE: {
    color:"var(--male-color)",
    iconName:"male"
  },
  FEMALE: {
    color:"var(--female-color)",
    iconName:"female"
  },
  NOT_SAID: {
    color:"var(--ion-color-medium)",
    iconName: "helpCircleOutline"
  }
}