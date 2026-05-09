export type MooFieldSize = 'sm' | 'md' | 'lg';

let uniqueId = 0;

export function createMooUniqueId(prefix: string): string {
  uniqueId += 1;
  return `${prefix}-${uniqueId}`;
}

export function joinAriaDescribedBy(...ids: Array<string | null | undefined | false>): string | null {
  const value = ids.filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
  return value.length ? value.join(' ') : null;
}
