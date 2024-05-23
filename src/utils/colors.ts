import { IconName } from "@components";
import { CustodyLevel, TreatmentType, Gender } from "@types";

export const custodyLevelColors: Record<CustodyLevel, string> = {
  OWNER: 'primary',
  SUB_OWNER: 'secondary',
  PET_SITTER: 'tertiary',
}

export const treatmentsColors: Record<TreatmentType, string> = {
  VACCINE: 'vaccine',
  ANTIPARASITIC: 'antiparasitic',
  OPERATION: "operation",
  REMINDER: "reminder",
  TABLET: "tablet"
}

export const gendersColor: Record<Gender, { color: string, iconName: IconName }> = {
  MALE: {
    color: "male-color",
    iconName: "male"
  },
  FEMALE: {
    color: "female-color",
    iconName: "female"
  },
  NOT_SAID: {
    color: "medium",
    iconName: "helpCircleOutline"
  }
}