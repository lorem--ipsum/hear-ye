export type Example = {
  label: string;
  deprecated?: boolean;
  path: string[];
  examples: Example[];
  component?: JSX.Element;
};
