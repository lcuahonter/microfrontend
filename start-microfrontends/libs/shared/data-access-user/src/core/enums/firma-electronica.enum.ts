/**
 *  Enum para definir los tipos de archivos utilizados en la firma electrónica.
 */
export enum FileType {
/** Certificado digital (.cer) */
  CERTIFICATE = 'cer',
  /** Llave privada (.key) */
  PRIVATE_KEY = 'key',
}

/**
 * Enum para definir los tipos de operaciones de firma electrónica.
 */
export enum OperationType {
/** Operación de login */
  LOGIN = 'login',
}