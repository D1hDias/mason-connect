export type ClassValue = string | false | null | undefined;

/** Joins truthy class name fragments with a single space. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
