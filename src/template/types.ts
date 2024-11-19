export interface ExpressionTemplateFragment {
  readonly expression: string;
}

export type StringTemplateFragment = string;

export type TemplateFragment =
  | StringTemplateFragment
  | ExpressionTemplateFragment;
