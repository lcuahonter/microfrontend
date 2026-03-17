/**
 * Utilidad para convertir cantidades numéricas a su representación en letras (español).
 * - Soporta parte entera y decimal (los decimales se procesan como "PUNTO X").
 * - Límite de conversión: valores >= 0 y < 1,000,000 (según isNumberValid).
 *
 * Nota: Sólo se añadieron comentarios; la lógica original se mantiene sin cambios.
 */
export class ConvertNumberAmountToStringAmount {
  private static unidades: string[] = [
    '',
    'UNO',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISEIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
    'VEINTE',
    'VEINTIUNO',
    'VEINTIDOS',
    'VEINTITRES',
    'VEINTICUATRO',
    'VEINTICINCO',
    'VEINTISEIS',
    'VEINTISIETE',
    'VEINTIOCHO',
    'VEINTINUEVE',
  ];

  private static decenas: string[] = [
    '',
    '',
    '',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ];

  private static centenas: string[] = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];

  private static modificador: string[] = [
    '',
    ' MIL',
    ' MILLONES',
    ' MIL',
    ' BILLONES',
    ' MIL',
  ];

  /**
   * Convierte un número a su representación en letras en español.
   * Ejemplo: 123 -> "CIENTO VEINTITRES"
   *
   * @param numeros Número a convertir (puede incluir decimales).
   * @returns Cadena con la representación en letras o cadena vacía si el número no es válido.
   */
  public static convierteNumerosALetra(numeros: number): string {
    if (!this.isNumberValid(numeros.toString())) {
      return '';
    }
    const AUX = numeros.toString();
    let entero = Math.floor(numeros);
    const CADENA_DECIMAL: string[] = [];

    if (AUX.includes('.')) {
      const TEXT_DECIMAL = AUX.split('.')[1];
      const NUMERO_DECIMAL = parseFloat(TEXT_DECIMAL);

      if (NUMERO_DECIMAL > 0) {
        CADENA_DECIMAL.push(' PUNTO ');
        for (let i = 0; i < TEXT_DECIMAL.length; i++) {
          if (TEXT_DECIMAL.charAt(i) === '0') {
            CADENA_DECIMAL.push(i < 1 ? 'CERO' : ' CERO');
          } else {
            CADENA_DECIMAL.push(
              ` ${this.convierteNumerosALetra(NUMERO_DECIMAL)}`
            );
            break;
          }
        }
      }
    }

    if (entero === 0) {
      return 'CERO' + CADENA_DECIMAL.join('');
    }
    if (entero === 1000) {
      return 'MIL' + CADENA_DECIMAL.join('');
    }

    const LETRAS: string[] = [];
    while (entero > 0) {
      LETRAS.push(this.obtenerCantidadLetraParcial(entero % 1000));
      entero = Math.floor(entero / 1000);
    }

    const CANTIDAD_LETRA: string[] = [];
    for (let i = LETRAS.length - 1; i >= 0; i--) {
      const LETRA = LETRAS[i].trim();

      if (LETRA.length > 0) {
        if (CANTIDAD_LETRA.length > 0) {
          CANTIDAD_LETRA.push(' ');
        }

        if (LETRA === 'UNO') {
          if ([1, 3, 5].includes(i)) {
            CANTIDAD_LETRA.push('MIL');
          } else if (i === 2) {
            CANTIDAD_LETRA.push('UN MILLON');
          } else if (i === 4) {
            CANTIDAD_LETRA.push('UN BILLON');
          } else {
            CANTIDAD_LETRA.push(LETRA);
          }
        } else {
          CANTIDAD_LETRA.push(LETRA + this.modificador[i]);
        }

        if ((i === 3 || i === 5) && LETRAS[i - 1]?.trim().length === 0) {
          CANTIDAD_LETRA.push(this.modificador[i - 1]);
        }
      }
    }

    return CANTIDAD_LETRA.join('') + CADENA_DECIMAL.join('');
  }

  /**
   * Construye la representación en letras de un bloque de hasta tres dígitos (0-999).
   * Maneja casos especiales como 100 -> "CIEN" y combina centenas/decenas/unidades.
   *
   * @param x Número entero entre 0 y 999.
   * @returns Cadena parcial en letras para ese bloque de hasta tres dígitos.
   */
  private static obtenerCantidadLetraParcial(x: number): string {
    if (x === 100) {
      return 'CIEN';
    }

    const LETRA = this.centenas[Math.floor(x / 100)];
    const RESTO = x % 100;

    if (RESTO < 30) {
      return LETRA + ' ' + this.unidades[RESTO];
    }

    if (this.unidades[RESTO % 10].length > 0) {
      return (
        LETRA +
        ' ' +
        this.decenas[Math.floor(RESTO / 10)] +
        ' Y ' +
        this.unidades[RESTO % 10]
      );
    }

    return LETRA + ' ' + this.decenas[Math.floor(RESTO / 10)];
  }

  /**
   * Valida que la cadena represente un número adecuado para conversión.
   * Condiciones: parseFloat(cadena) >= 0 y < 1,000,000 y que no sea NaN.
   *
   * @param cadena Representación en texto del número a validar.
   * @returns true si es válido; false en caso contrario.
   */
  private static isNumberValid(cadena: string): boolean {
    return (
      !isNaN(Number(cadena)) &&
      parseFloat(cadena) >= 0 &&
      parseFloat(cadena) < 1000000
    );
  }
}
