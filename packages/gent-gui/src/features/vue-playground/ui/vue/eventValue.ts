// Learning note:
// This utility keeps DOM casting logic in one place so component code can
// focus on intent (emit/update) rather than low-level event extraction.

export const getTextInputValue = (event: Event): string =>
  (event.target as HTMLInputElement).value;

export const getSelectValue = (event: Event): string =>
  (event.target as HTMLSelectElement).value;

export const getCheckboxChecked = (event: Event): boolean =>
  (event.target as HTMLInputElement).checked;
