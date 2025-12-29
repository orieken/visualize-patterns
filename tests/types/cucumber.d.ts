declare module 'cucumber' {
  export const Given: (expression: string, implementation: (...args: unknown[]) => unknown) => void;
  export const When: (expression: string, implementation: (...args: unknown[]) => unknown) => void;
  export const Then: (expression: string, implementation: (...args: unknown[]) => unknown) => void;
}
