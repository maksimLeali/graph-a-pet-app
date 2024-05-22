export type ColorKeys = 
  | "grid-color"
  | "vaccine"
  | "antiparasitic"
  | "operation"
  | "reminder"
  | "tablet"
  | "male-color"
  | "female-color"
  | "background-color"
  | "trasparent-bg"
  | "trasparent-bg-shade"
  | "white"
  | "black"
  | "trasparent"
  | "primary"
  | "primary-trasparent"
  | "primary-contrast"
  | "primary-shade"
  | "primary-tint"
  | "secondary"
  | "secondary-trasparent"
  | "secondary-contrast"
  | "secondary-shade"
  | "secondary-tint"
  | "tertiary"
  | "tertiary-trasparent"
  | "tertiary-contrast"
  | "tertiary-shade"
  | "tertiary-tint"
  | "success"
  | "success-contrast"
  | "success-shade"
  | "success-tint"
  | "warning"
  | "warning-contrast"
  | "warning-shade"
  | "warning-tint"
  | "danger"
  | "danger-contrast"
  | "danger-shade"
  | "danger-tint"
  | "dark"
  | "dark-contrast"
  | "dark-shade"
  | "dark-tint"
  | "medium"
  | "medium-contrast"
  | "medium-shade"
  | "medium-tint"
  | "light"
  | "light-contrast"
  | "light-shade";

type ColorsObject = {
  [key in ColorKeys]: string;
};

export const colors: ColorsObject = {
    "grid-color": "var(--grid-color)",
    "vaccine": "var(--vaccine)",
    "antiparasitic": "var(--antiparasitic)",
    "operation": "var(--operation)",
    "reminder": "var(--reminder)",
    "tablet": "var(--tablet)",
    "male-color": "var(--male-color)",
    "female-color": "var(--female-color)",
    "background-color": "var(--ion-background-color)",
    "trasparent-bg": "var(--ion-trasparent-bg)",
    "trasparent-bg-shade": "var(--ion-trasparent-bg-shade)",
    "white": "var(--ion-color-white)",
    "black": "var(--ion-color-black)",
    "trasparent": "var(--ion-trasparent)",
    "primary": "var(--ion-color-primary)",
    "primary-trasparent": "var(--ion-color-primary-trasparent)",
    "primary-contrast": "var(--ion-color-primary-contrast)",
    "primary-shade": "var(--ion-color-primary-shade)",
    "primary-tint": "var(--ion-color-primary-tint)",
    "secondary": "var(--ion-color-secondary)",
    "secondary-trasparent": "var(--ion-color-secondary-trasparent)",
    "secondary-contrast": "var(--ion-color-secondary-contrast)",
    "secondary-shade": "var(--ion-color-secondary-shade)",
    "secondary-tint": "var(--ion-color-secondary-tint)",
    "tertiary": "var(--ion-color-tertiary)",
    "tertiary-trasparent": "var(--ion-color-tertiary-trasparent)",
    "tertiary-contrast": "var(--ion-color-tertiary-contrast)",
    "tertiary-shade": "var(--ion-color-tertiary-shade)",
    "tertiary-tint": "var(--ion-color-tertiary-tint)",
    "success": "var(--ion-color-success)",
    "success-contrast": "var(--ion-color-success-contrast)",
    "success-shade": "var(--ion-color-success-shade)",
    "success-tint": "var(--ion-color-success-tint)",
    "warning": "var(--ion-color-warning)",
    "warning-contrast": "var(--ion-color-warning-contrast)",
    "warning-shade": "var(--ion-color-warning-shade)",
    "warning-tint": "var(--ion-color-warning-tint)",
    "danger": "var(--ion-color-danger)",
    "danger-contrast": "var(--ion-color-danger-contrast)",
    "danger-shade": "var(--ion-color-danger-shade)",
    "danger-tint": "var(--ion-color-danger-tint)",
    "dark": "var(--ion-color-dark)",
    "dark-contrast": "var(--ion-color-dark-contrast)",
    "dark-shade": "var(--ion-color-dark-shade)",
    "dark-tint": "var(--ion-color-dark-tint)",
    "medium": "var(--ion-color-medium)",
    "medium-contrast": "var(--ion-color-medium-contrast)",
    "medium-shade": "var(--ion-color-medium-shade)",
    "medium-tint": "var(--ion-color-medium-tint)",
    "light": "var(--ion-color-light)",
    "light-contrast": "var(--ion-color-light-contrast)",
    "light-shade": "var(--ion-color-light-shade)",
  };

  export function isColorKey(key: string): key is keyof ColorsObject {
    return key in colors;
  }