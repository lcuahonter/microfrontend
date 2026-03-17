import { Location } from '@/features/otras-areas/registro-guias/interfaces/catalogs.interface';
export interface LocationSearchResult {
  location: Location | null;
  foundIn: 'iata' | 'controlledPremises' | null;
}

export type TypeResponseStatus = {
  success: boolean;
  msg?: string;
};

export function cleanParams(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
}

export function formatDateIso(date: Date) {
  const newDate = new Date(date);
  return newDate.toISOString();
}

export function combineLocalDateAndTime(issueDate: Date, issueTime: string): string {
  const [hours, minutes] = issueTime.split(':').map(Number);
  const d = new Date(issueDate);

  const dateUtc = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0, 0),
  );

  const isoString = dateUtc.toISOString();
  return isoString;
}

export function parseSafeDate(value: string | Date | null | undefined): Date {
  // Caso vacío → fecha actual
  if (!value) {
    return new Date();
  }

  // Ya es Date válida
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string') {
    // Intento directo (ISO, RFC)
    const direct = new Date(value);
    if (!isNaN(direct.getTime())) {
      return direct;
    }

    // Normalizar formato raro
    const normalized = value.replace(/\bGM\s*([+-]\d{4})\b/, 'GMT$1').replace(/\s*\(.*\)$/, '');

    const parsed = new Date(normalized);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Último fallback → ahora
  return new Date();
}

export function formatIsoLiteral(value: string | Date): string {
  const iso = value instanceof Date ? value.toISOString() : value;

  return iso.replace('T', ' ').replace(/\.\d{3}Z$/, '');
}

export function formatToSqlDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export function mergeDateWithTime(dateInput: string | Date, time: string): Date {
  const baseDate = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput);

  // Extraer fecha (ignorando hora original)
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based
  const day = baseDate.getDate();

  // Parsear hora "HH:mm"
  const [hours, minutes] = time.split(':').map(Number);

  return new Date(year, month, day, hours, minutes, 0, 0);
}

export function isEmptyObject(obj: unknown): boolean {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;
}
