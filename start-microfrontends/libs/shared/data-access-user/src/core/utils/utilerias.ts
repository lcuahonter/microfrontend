import * as XLSX from 'xlsx';
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { ConfiguracionColumna } from "../models/shared/configuracion-columna.model";
import { REGEX_PATRON_DECIMAL_12_3 } from "../../tramites/constantes/regex.constants";
import moment from "moment";

/**
* Validador personalizado para verificar si un valor numérico cumple con un formato específico.
* 
* Este validador permite valores numéricos con un máximo de 12 dígitos enteros y hasta 3 dígitos decimales opcionales.
* Si el valor no cumple con este formato, se devuelve un error de validación.
* 
* @returns Una función que toma un control de formulario (`AbstractControl`) y devuelve 
*          un objeto de errores de validación (`ValidationErrors`) si el valor no es válido, 
*          o `null` si el valor es válido.
* 
* @example
* // Ejemplo de uso en un formulario reactivo:
* const control = new FormControl('123.456', [maxDigitsValidator()]);
* console.log(control.errors); // null (valor válido)
* 
* const controlInvalid = new FormControl('1234567890123.456', [maxDigitsValidator()]);
* console.log(controlInvalid.errors); // { maxDigits: true } (valor no válido)
*/
export function MaxDigitsValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const VALOR = control.value;
        if (VALOR === null || VALOR === undefined || VALOR === '' || isNaN(VALOR)) {
            return null;
        }
        const REGEX = REGEX_PATRON_DECIMAL_12_3;
        return REGEX.test(VALOR) ? null : { maxDigits: true };
    };
}

/**
* Validador que verifica si la fecha ingresada es menor o igual a la fecha actual.
* 
* @param control - El control de formulario que contiene la fecha a validar.
* @returns Un objeto de error de validación si la fecha es mayor a hoy, o null si es válida.
*/
export function dateLessThanOrEqualToday(control: AbstractControl): ValidationErrors | null {
    const INPUT_DATE = new Date(control.value);
    const TODAY = new Date();
    INPUT_DATE.setHours(0, 0, 0, 0);
    TODAY.setHours(0, 0, 0, 0);
    if (control.value && INPUT_DATE > TODAY) {
        return { futureDateNotAllowed: true };
    }
    return null;
}

/**
 * Convierte una cadena de texto a su representación hexadecimal en ISO-8859-1 (Latin-1).
 * Los caracteres fuera del rango ISO-8859-1 (mayores a 255) son reemplazados por '3F' (el signo '?').
 * 
 * @param input - La cadena de texto a codificar
 * @returns Una cadena hexadecimal que representa los bytes de la cadena codificada en ISO-8859-1
 * 
 */
 export function encodeToISO88591Hex(input: string): string {
  let hexString = '';
  
  for (let i = 0; i < input.length; i++) {
    const CHAR_CODE = input.charCodeAt(i);
    const BYTE = CHAR_CODE > 255 ? 0x3F : CHAR_CODE;
    const HEX_BYTE = BYTE.toString(16).padStart(2, '0');
    hexString += HEX_BYTE;
  }
  return hexString;
}

/**
 * Convierte una cadena hexadecimal a su representación en ISO-8859-1 (Latin-1).
 * Los bytes fuera del rango ISO-8859-1 (mayores a 255) son reemplazados por '?'.
 * 
 * @param hex - La cadena hexadecimal a decodificar
 * @returns Una cadena de texto que representa los caracteres decodificados en ISO-8859-1
*/
export function hexToISO88591(hex: string): string {
  const BYTES: number[] = [];

  for (let i = 0; i < hex.length; i += 2) {
    BYTES.push(parseInt(hex.substr(i, 2), 16));
  }

  // ISO-8859-1 usa un mapeo directo de byte a carácter (0x00–0xFF)
  return String.fromCharCode(...BYTES);
}


/**
 * Convierte una cadena codificada en Base64 a su representación hexadecimal.
 * 
 * @param base64 - La cadena codificada en Base64 a convertir
 * @returns Una cadena hexadecimal que representa los datos binarios decodificados
 * 
 */
 export function base64ToHex(base64: string): string {
    const BINARY = atob(base64);
    return Array.from(BINARY)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

    /**
     * Formatea una fecha dada en formato de cadena a una cadena con el formato 'YYYY-MM-DD HH:mm:ss' 
     * utilizando Moment.js.
     *
     * @param fecha - La fecha en formato de cadena que se desea formatear.
     * @returns Una cadena que representa la fecha formateada en el formato 'YYYY-MM-DD HH:mm:ss'.
     */
    export function formatearFechaConMoment(fecha: string): string {
        const DATESTRING = new Date(fecha);
        return moment(DATESTRING).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Formatea una fecha dada en formato de cadena a una cadena con el formato 'DD/MM/YYYY' 
     * utilizando Moment.js.
     *
     * @param fecha - La fecha en formato de cadena que se desea formatear.
     * @returns Una cadena que representa la fecha formateada en el formato 'DD/MM//YYYY'.
     */
    export function formatearFechaCalendar(fecha: string): string {
        const DATESTRING = new Date(fecha);
        return moment(DATESTRING).format('DD/MM/YYYY');
    }

    /**
     * Limpia y deshabilita el input con id 'desProgramaFomento'.
     */
    /**
     * Limpia y deshabilita un control de formulario HTML según su tipo.
     *
     * @param id - El identificador del elemento HTML a manipular.
     * @param tipo - El tipo de control, puede ser 'textbox' (campo de texto) o 'checkbox' (casilla de verificación).
     * @param soloLimpiarTextbox - Opcional. Si es verdadero y el tipo es 'textbox', solo limpia el valor sin deshabilitar el control.
     *
     * Si el tipo es 'textbox', se limpia el valor del campo y se deshabilita el control, a menos que `soloLimpiarTextbox` sea verdadero.
     * Si el tipo es 'checkbox', se desmarca la casilla y se habilita el control.
     * Si el elemento no existe, la función no realiza ninguna acción.
     */
    export function limpiarYDeshabilitarControl(
        id: string,
        tipo: 'textbox' | 'checkbox',
        soloLimpiarTextbox?: boolean
    ): void {
        const ELEMENT = document.getElementById(id) as HTMLInputElement;
        if (!ELEMENT) {
            return;
        }

        if (tipo === 'textbox') {
            ELEMENT.value = '';
            if (!soloLimpiarTextbox) {
                ELEMENT.disabled = true;
            }
        } else if (tipo === 'checkbox') {
            ELEMENT.checked = false;
            ELEMENT.disabled = false;
        }
    }

    /**
     * Realiza una copia profunda de un objeto utilizando JSON.
     * 
     * @param obj - El objeto a copiar. Si no se proporciona, se utiliza un objeto vacío por defecto.
     * @returns Una copia profunda del objeto original.
     */
    export function doDeepCopy(obj: unknown = {}) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Verifica si un valor es un objeto.
     *
     * @param value - El valor a verificar.
     * @returns Verdadero si el valor es un objeto, falso en caso contrario.
     */
    export function esObject(value: unknown): boolean {
        return value !== null && typeof value === 'object';
    }

    /**
     * Verifica si un valor es un array válido (no vacío).
     *
     * @param value - El valor a verificar.
     * @returns Verdadero si el valor es un array no vacío, falso en caso contrario.
     */
    export function esValidArray(value: unknown): boolean {
        return Array.isArray(value) && value.length > 0;
    }

    /**
     * Verifica si un valor está definido (no es nulo ni indefinido).
     *
     * @param value - El valor a verificar.
     * @returns Verdadero si el valor está definido, falso en caso contrario.
     */
    export function esDefined(value: any): boolean {
        return value && 'undefined' !== typeof value;
    }

    /**
     * Verifica si un valor es una cadena válida (no vacía).
     *
     * @param str - El valor a verificar.
     * @returns Verdadero si el valor es una cadena no vacía, falso en caso contrario.
     */
    export function esValidString(str: unknown): boolean {
        return 'string' === typeof str && 0 < str.length;
    }

    /**
     * Formatea un JSON para su visualización.
     * @param json - El JSON a formatear.
     * @returns El JSON formateado.
     */
    export function getFormattedJson(json: any) {
        return esValidString(json) ? JSON.parse(json) : json;
    }

    /**
     * Parsea un JSON a partir de una cadena.
     * @param str - La cadena a parsear.
     * @returns El objeto JSON parseado o la cadena original en caso de error.
     */
    export function getParsedJson(str: any) {
        try {
            return JSON.parse(str);
        } catch (error) {
            return str;
        }
    }

    /**
     * Verifica si un objeto es válido (no vacío).
     * @param obj - El objeto a verificar.
     * @returns Verdadero si el objeto es válido, falso en caso contrario.
     */
    export function esValidObject(obj:any): boolean {
        return esObject(obj) && Object.keys(obj).length > 0;
    }

    /**
     * Verifica si un objeto está vacío.
     * @param obj - El objeto a verificar.
     * @returns Verdadero si el objeto está vacío, falso en caso contrario.
     */
    export function esObjectEmpty(obj: any): boolean {
        return Object.keys(obj).length === 0;
    }

    /**
     * Verifica si un valor es indefinido.
     * @param value - El valor a verificar.
     * @returns Verdadero si el valor es indefinido, falso en caso contrario.
     */
    export function esUndefined(value: any): boolean {
        return typeof value === 'undefined' || !value;
    }

    /**
     * Verifica si un valor es válido (no nulo ni indefinido).
     * @param datos - El valor a verificar.
     * @returns Verdadero si el valor es válido, falso en caso contrario.
     */
    export function getValidDatos(datos: any) {
        return !(esUndefined(datos) || datos === null || datos === '');
    }

    /**
    * Elimina duplicados de un array de cualquier tipo (primitivos u objetos).
    * Para objetos, compara usando JSON.stringify (puede tener limitaciones con funciones o propiedades no enumerables).
    *
    * @param arr - Array de cualquier tipo.
    * @returns Un nuevo array sin duplicados.
    */
    export function removeDuplicatesFromArray<T>(arr: T[]): T[] {
      const SEEN = new Set<string>();
      return arr.filter(item => {
        const KEY = typeof item === 'object' && item !== null
          ? JSON.stringify(item)
          : String(item);
        if (SEEN.has(KEY)) {
          return false;
        }
        SEEN.add(KEY);
        return true;
      });
    }

    /**
     * Formatea una fecha en formato 'yyyy-MM-dd' a 'dd/MM/yyyy'.
     * 
     * @param fecha - La fecha en formato 'yyyy-MM-dd' como string.
     * @returns La fecha formateada en 'dd/MM/yyyy' como string.
     */
    export function formatearFechaDdMmYyyy(fecha: string): string {
        if (!fecha || typeof fecha !== 'string') {
            return '';
        }
        const [YEAR, MONTH, DAY] = fecha.split('-');
        if (!YEAR || !MONTH || !DAY) {
            return '';
        }
        return `${DAY.padStart(2, '0')}/${MONTH.padStart(2, '0')}/${YEAR}`;
    }

/**
   * Formatea una fecha a un string en el formato 'YYYY-MM-DD HH:mm:ss'.
   * @param fecha - Fecha a formatear, puede ser un string o un objeto Date.
   * @returns String formateado de la fecha.
   */
export function formatFecha(fecha: string | Date): string {
    const DATE_OBJ = new Date(fecha);
    const PAD = (n: number): string => n.toString().padStart(2, '0');

    const YYYY = DATE_OBJ.getFullYear();
    const MM = PAD(DATE_OBJ.getMonth() + 1);
    const DD = PAD(DATE_OBJ.getDate());
    const HH = PAD(DATE_OBJ.getHours());
    const MM_MINUTES = PAD(DATE_OBJ.getMinutes());
    const SS = PAD(DATE_OBJ.getSeconds());

    return `${YYYY}-${MM}-${DD} ${HH}:${MM_MINUTES}:${SS}`;
}

/**
     * Formatea una fecha en formato 'dd/MM/yyyy' a 'yyyy-MM-dd'.
     * 
     * @param input - La fecha en formato 'dd/MM/yyyy' como string.
     * @returns La fecha formateada en 'yyyy-MM-dd' como string.
     */
export function formatearFechaYyyyMmDd(
  input: string,
  override?: { year?: string | number; month?: string | number; day?: string | number }
): string {
  if (input) {
    const [DAY, MONTH, YEAR] = input.split("/");
    const YYYY = override?.year ?? YEAR;
    const MM = override?.month ?? MONTH;
    const DD = override?.day ?? DAY; 
    return `${YYYY}-${String(MM).padStart(2, "0")}-${String(DD).padStart(2, "0")}`;
  }
  return '';
}

export function parseToString(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return value.toString();
}

/**
 * Renombra una clave de un objeto, manteniendo el resto de las propiedades intactas.
 * @param obj Objeto al que se le va a renombrar la clave.
 * @param oldKey Nombre de la clave original.
 * @param newKey Nuevo nombre para la clave.
 * @returns El objeto con la clave renombrada.
 */
export function renameKey<T extends Record<string, unknown>>(obj: T, oldKey: string, newKey: string): T {
  if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
    const { [oldKey]: OLD, ...REST } = obj;
    return { ...REST, [newKey]: OLD } as T;
  }
  return obj;
}

 /**
     * Converts a date string from the format 'DD/MM/YYYY' to 'YYYY-MM-DD 00:00:00'.
     *
     * @param dateString - The date string in 'DD/MM/YYYY' format to be converted.
     * @returns The formatted date string in 'YYYY-MM-DD 00:00:00' format.
     */
export function convertDate(dateString: string): string {
        if (!dateString || typeof dateString !== 'string') {
            return '';
        }
        const parsedDate = moment(dateString, 'DD/MM/YYYY', true);
        if (!parsedDate.isValid()) {
            return '';
        }
        return parsedDate.format('YYYY-MM-DD 00:00:00');
    }

/**
 * **Convierte una fecha en formato ISO a 'DD/MM/YYYY'.**
 * 
 * Ejemplo:
 *  Entrada: "2025-02-18T18:16:05.000-06:00"
 *  Salida:  "18/02/2025"
 * 
 * @param dateString - Cadena de fecha en formato ISO o similar.
 * @returns La fecha formateada como "DD/MM/YYYY".
 */
export function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) {
    return '';
  }

  const DATE = new Date(dateString);

  const DAY = String(DATE.getDate()).padStart(2, '0');
  const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
  const YEAR = DATE.getFullYear();

  return `${DAY}/${MONTH}/${YEAR}`;
}

/**  
 * **Formatea una fecha en formato DD/MM/YYYY.**  
 * Convierte una cadena de fecha válida en una representación legible con día, mes y año.  
 *  
 * @param fechaStr - Cadena de fecha a formatear (por ejemplo, `"2025-11-03"`).  
 * @returns La fecha formateada en formato `"DD/MM/YYYY"`.  
 */
export function formatFechaDDMMYYYY(fechaStr: string): string {
  const FECHA = new Date(fechaStr);

  const DAY = String(FECHA.getDate()).padStart(2, "0");
  const MONTH = String(FECHA.getMonth() + 1).padStart(2, "0");
  const YEAR = FECHA.getFullYear();

  return `${DAY}/${MONTH}/${YEAR}`;
}

    /**
  * Método genérico para manejar un PDF en base64.
  *
  * @param base64 Contenido del PDF en base64.
  * @param nombreArchivo Nombre del archivo a descargar (si aplica).
  * @param accion 'abrir' para abrir en pestaña o 'descargar' para forzar descarga.
  */
  export function manejarPdf(base64: string, nombreArchivo: string, accion: 'abrir' | 'descargar'): void {
    // Decodificar el base64
    const BYTE_CHARACTERS = atob(base64);
    const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
    for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
      BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
    }
    const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);

    // Crear el Blob y la URL
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/pdf' });
    const URLCODIFICADA = URL.createObjectURL(BLOB);

    if (accion === 'abrir') {
      window.open(URLCODIFICADA, '_blank');
    } else {
      const LINK = document.createElement('a');
      LINK.href = URLCODIFICADA;
      LINK.download = nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`;
      LINK.click();
      URL.revokeObjectURL(URLCODIFICADA);
    }
  }

  /**
   *  Exporta un archivo Excel a partir de una cadena base64.
   * 
   * @param dataFile 
   */
  export function exportExcelFile( dataFile: string, nameFile?: string): void {
    const BASE64_DATA = dataFile ?? '';
    const BYTE_CHARACTERS = atob(BASE64_DATA);
    const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
    for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
        BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
    }
    const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crear enlace de descarga
    const LINK = document.createElement('a');
    LINK.href = window.URL.createObjectURL(BLOB);
    LINK.download = nameFile ?? 'datosRPE.xlsx';
    LINK.click();

    // Liberar memoria
    window.URL.revokeObjectURL(LINK.href);
  }

  /**
   * Exporta los datos de una tabla a un archivo Excel (.xlsx) basándose en una configuración de columnas.
   * 
   * @param config - Arreglo de configuración de columnas (ConfiguracionColumna).
   * @param datos - Arreglo de datos a exportar.
   * @param nombreArchivo - Nombre del archivo de salida (sin extensión por defecto).
   */
  export function exportTableToExcel<T>(
    config: ConfiguracionColumna<T>[],
    datos: T[],
    nombreArchivo: string = 'exportacion'
  ): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    // Ordenar configuración por el campo 'orden'
    const CONFIG_ORDENADA = [...config].sort((a, b) => a.orden - b.orden);

    // Mapear datos a un formato plano que entienda XLSX (usando los encabezados como llaves)
    const DATOS_MAPEADOS = datos.map(item => {
      const ROW: Record<string, string | number | undefined | boolean> = {};
      CONFIG_ORDENADA.forEach(col => {
        ROW[col.encabezado] = col.clave(item);
      });
      return ROW;
    });

    // Crear el libro y la hoja de trabajo
    const WS = XLSX.utils.json_to_sheet(DATOS_MAPEADOS);
    const WB = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(WB, WS, 'Resultados');

    // Generar el archivo y disparar la descarga automática
    const NOMBRE_FINAL = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`;
    XLSX.writeFile(WB, NOMBRE_FINAL);
  }

  /**
 * **Convierte una fecha con zona horaria ISO a formato 'YYYY-MM-DD HH:mm:ss.s'**
 * 
 * Ejemplo:
 *  Entrada: "2025-02-18T18:16:05.000-06:00"
 *  Salida:  "2025-02-18 18:16:05.0"
 * 
 * @param fechaStr - Cadena de fecha en formato ISO con zona horaria.
 * @returns La fecha formateada como "YYYY-MM-DD HH:mm:ss.s".
 */
export function formatFechaCustom(fechaStr: string): string {
  const FECHA = new Date(fechaStr);

  const YEAR = FECHA.getFullYear();
  const MONTH = String(FECHA.getMonth() + 1).padStart(2, "0");
  const DAY = String(FECHA.getDate()).padStart(2, "0");
  const HOURS = String(FECHA.getHours()).padStart(2, "0");
  const MINUTES = String(FECHA.getMinutes()).padStart(2, "0");
  const SECONDS = String(FECHA.getSeconds()).padStart(2, "0");

  // Agrega ".0" al final según el formato requerido
  return `${YEAR}-${MONTH}-${DAY} ${HOURS}:${MINUTES}:${SECONDS}.0`;
}

/**
 * Formatea una fecha en formato ISO a 'DD/MM/YYYY HH:mm:ss'.
 * @param fecha_creacion Fecha en formato ISO (string)
 * @returns Fecha formateada como string
 */
export function formatFechaCreacion(fecha_creacion: string): string {
    if (!fecha_creacion) {
      return fecha_creacion;
    }
    const DATE = new Date(fecha_creacion);
    if (isNaN(DATE.getTime())) {
        return fecha_creacion;
    }
    const PAD = (n: number): string => n.toString().padStart(2, '0');
    return `${PAD(DATE.getDate())}/${PAD(DATE.getMonth() + 1)}/${DATE.getFullYear()} ${PAD(DATE.getHours())}:${PAD(DATE.getMinutes())}:${PAD(DATE.getSeconds())}`;
}

/**
 * Formatea una fecha en formato 'DD/MM/YYYY' a 'YYYY-MM-DD HH:mm:ss' con hora fija.
 * @param fechaStr Fecha en formato 'DD/MM/YYYY' como string.
 * @returns Fecha formateada como string 'YYYY-MM-DD HH:mm:ss'.
 */
export function formatearFechaSolicitud(fechaStr: string): string {
  if (!fechaStr) { return '' }

  const PARTES = fechaStr.split('/');
  if (PARTES.length !== 3) { return '' }

  const [DIA, MES, ANIO] = PARTES;
  const FECHA = new Date(Number(ANIO), Number(MES) - 1, Number(DIA));

  // Puedes usar hora fija o actual. Aquí dejo fija 18:44:00
  const HORAS = 18;
  const MINUTOS = 44;
  const SEGUNDOS = 0;
  FECHA.setHours(HORAS, MINUTOS, SEGUNDOS);

  const YYYY = FECHA.getFullYear();
  const MM = String(FECHA.getMonth() + 1).padStart(2, '0');
  const DD = String(FECHA.getDate()).padStart(2, '0');
  const HH = String(FECHA.getHours()).padStart(2, '0');
  const MI = String(FECHA.getMinutes()).padStart(2, '0');
  const SS = String(FECHA.getSeconds()).padStart(2, '0');

  return `${YYYY}-${MM}-${DD} ${HH}:${MI}:${SS}`;
}

/**
 * Formatea la fecha en formato 'MM/YYYY'.
 * @param date Objeto Date a formatear.
 * @returns Fecha formateada como string 'MM/YYYY'.
 */
export function formatMonthYear(date: Date): string {
  const MONTH = String(date.getMonth() + 1).padStart(2, '0');
  const YEAR = date.getFullYear();
  return `${MONTH}/${YEAR}`;
}

/**
 * Formatea una fecha 'DD/MM/YYYY' a 'YYYY-MM-DD HH:mm:ss' (hora de objeto Date).
 * @param fechaStr Fecha en formato 'DD/MM/YYYY'.
 * @returns Fecha formateada como 'YYYY-MM-DD HH:mm:ss'.
 */
export function formatearFechaSolicitudSinHora(fechaStr: string): string {
  if (!fechaStr) { return '' }

  const PARTES = fechaStr.split('/');
  if (PARTES.length !== 3) { return '' }

  const [DIA, MES, ANIO] = PARTES;
  const FECHA = new Date(Number(ANIO), Number(MES) - 1, Number(DIA));

  const YYYY = FECHA.getFullYear();
  const MM = String(FECHA.getMonth() + 1).padStart(2, '0');
  const DD = String(FECHA.getDate()).padStart(2, '0');
  const HH = String(FECHA.getHours()).padStart(2, '0');
  const MI = String(FECHA.getMinutes()).padStart(2, '0');
  const SS = String(FECHA.getSeconds()).padStart(2, '0');

  return `${YYYY}-${MM}-${DD} ${HH}:${MI}:${SS}`;
}

/**
 * Realiza un mapeo inverso de propiedades desde un objeto fuente a un nuevo objeto o arreglo,
 * según una estructura de mapeo proporcionada. Permite transformar estructuras complejas
 * (incluyendo arreglos de objetos) a un formato deseado, extrayendo valores por rutas anidadas.
 *
 * @param mapping Objeto que define el mapeo de claves destino a rutas de origen, o bien,
 *        un objeto con 'path' (ruta al arreglo dentro del source) y 'items' (mapeo de claves para cada elemento).
 * @param source Objeto fuente del que se extraen los valores.
 * @returns Un objeto con las propiedades mapeadas o un arreglo de objetos mapeados si se trata de un arreglo.
 */
// 
export function reverseMap(
  mapping: {
    type: "object" | "array",
    path?: string,
    items: Record<string, string>
  },
  source: unknown
): Record<string, unknown> | Array<Record<string, unknown>> {

  const GET = (obj: unknown, path: string): unknown =>
    path.split(".").reduce(
      (acc, key) =>
        acc && typeof acc === "object" && acc !== null
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj
    );

  // If mapping has path, shift `source` down to this nested level
  const ROOT = mapping.path ? GET(source, mapping.path) : source;

  // ---- ARRAY CASE ----
  if (mapping.type === "array") {
    if (!Array.isArray(ROOT)) {
      return [];
    }

    return ROOT.map(item => {
      const RESULT: Record<string, unknown> = {};
      for (const [TARGET_KEY, SOURCE_PATH] of Object.entries(mapping.items)) {
        RESULT[TARGET_KEY] = GET(item, SOURCE_PATH);
      }
      return RESULT;
    });
  }

  // ---- OBJECT CASE ----
  const RESULT: Record<string, unknown> = {};

  for (const [TARGET_KEY, SOURCE_PATH] of Object.entries(mapping.items)) {
    RESULT[TARGET_KEY] = GET(ROOT, SOURCE_PATH);
  }

  return RESULT;
}

/*
 * Convierte una fecha en formato 'DD/MM/YYYY' a 'YYYY-MM-DD' usando moment.js.
 * @param fecha - Fecha en formato 'DD/MM/YYYY'.
 * @returns Fecha en formato 'YYYY-MM-DD'.
 */
export function convertirFechaDdMmYyyyAMoment(fecha: string): string {
  if (!fecha || typeof fecha !== 'string') {
    return '';
  }
  const parsed = moment(fecha, 'DD/MM/YYYY', true);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
}

/*
 * Formatea un número como moneda con un número específico de dígitos decimales.
 * @param value El valor numérico a formatear.
 * @param digits El número de dígitos decimales.
 * @param locale El locale para formateo (por defecto 'es-MX').
 * @returns El número formateado como moneda.
*/
export function formatCurrency(value: number, digits = 0, locale = 'es-MX'): number {
  const FORMATTER = new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
  return parseFloat(FORMATTER);
}

/**
 * Trunca un número a un número específico de decimales sin redondear.
 * @param value El número a truncar.
 * @param decimales El número de decimales a mantener.
 * @returns El número truncado.
*/
export function truncateNumber(value: number, decimales: number): number {
  const FACTOR = Math.pow(10, decimales);
  return Math.trunc(value * FACTOR) / FACTOR;
}

/**
 * Realiza un mapeo inverso de propiedades desde un objeto fuente a un nuevo objeto o arreglo,
 * según una estructura de mapeo proporcionada. Permite transformar estructuras complejas
 * (incluyendo arreglos de objetos) a un formato deseado, extrayendo valores por rutas anidadas.
 *
 * @param mapping Objeto que define el mapeo de claves destino a rutas de origen, o bien,
 *        un objeto con 'path' (ruta al arreglo dentro del source) y 'items' (mapeo de claves para cada elemento).
 * @param source Objeto fuente del que se extraen los valores.
 * @returns Un objeto con las propiedades mapeadas o un arreglo de objetos mapeados si se trata de un arreglo.
 */
// 
export function reverseMapv2(
  mapping: {
    type: "object" | "array",
    path?: string,
    items: Record<string, string>
  },
  source: unknown
): Record<string, unknown> | Array<Record<string, unknown>> {

  const GET = (obj: unknown, path: string): unknown =>
    path.split(".").reduce(
      (acc, key) =>
        acc && typeof acc === "object" && acc !== null
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj
    );

  // If mapping has path, shift `source` down to this nested level
  const ROOT = mapping.path ? GET(source, mapping.path) : source;

  // ---- ARRAY CASE ----
  if (mapping.type === "array") {
    if (!Array.isArray(ROOT)) {
      return [];
    }

    return ROOT.map(item => {
      const RESULT: Record<string, unknown> = {};
      for (const [TARGET_KEY, SOURCE_PATH] of Object.entries(mapping.items)) {
        RESULT[TARGET_KEY] = GET(item, SOURCE_PATH);
      }
      return RESULT;
    });
  }

  // ---- OBJECT CASE ----
  const RESULT: Record<string, unknown> = {};

  for (const [TARGET_KEY, SOURCE_PATH] of Object.entries(mapping.items)) {
    RESULT[TARGET_KEY] = GET(ROOT, SOURCE_PATH);
  }

  return RESULT;
}

/** * Formatea una fecha de servicio en formato 'YYYY-MM-DD HH:mm:ss' a 'DD/MM/YYYY'.
 * @param fecha Fecha en formato 'YYYY-MM-DD HH:mm:ss'.
 * @returns Fecha formateada como 'DD/MM/YYYY'.
 */
export function formatFechaServicioToDDMMYYYY(fecha: string): string {
  if (!fecha || typeof fecha !== 'string'){
    return '';
  }

  const [FECHASOLO] = fecha.split(' ');

  const PARTES = FECHASOLO.split('-');

  if (PARTES.length !== 3){
    return '';
  }
  const [YEAR, MONTH, DAY] = PARTES;

  // Validamos que sean números
  if (!YEAR || !MONTH || !DAY){
    return '';
  }
  return `${DAY.padStart(2, '0')}/${MONTH.padStart(2, '0')}/${YEAR}`;
}

 /**
   * Verifica si un control del formulario es válido.
   * @param control - Nombre del control a verificar.
   * @returns true si el control es válido, false en caso contrario.
   */
  export function esControlValido(form: FormGroup, control: string): boolean | undefined {
    if (!form || !control) {
      return false;
    }
    const CONTROL = form.get(control);
    return CONTROL?.invalid && (CONTROL?.dirty || CONTROL?.touched);
  }


  export function descargarArchivoDeBase64(
  base64Data: string,
  options: {
    fileName: string;
    mimeType: string;
  }
): void {
  if (!base64Data) {
    throw new Error('Base 64 es requerido');
  }
  const BASE64 = base64Data.includes(',')
    ? base64Data.split(',')[1]
    : base64Data;

  const BINARY = atob(BASE64);
  const LENGTH = BINARY.length;
  const BYTES = new Uint8Array(LENGTH);

  for (let i = 0; i < LENGTH; i++) {
    BYTES[i] = BINARY.charCodeAt(i);
  }

  const BLOB = new Blob([BYTES], { type: options.mimeType });
  const URL = window.URL.createObjectURL(BLOB);

  const LINK = document.createElement('a');
  LINK.href = URL;
  LINK.download = options.fileName;
  LINK.click();

  window.URL.revokeObjectURL(URL);
}

/**
 * Formatea una fecha de vigencia en formato 'DD-MM-YYYY HH:mm:ss'.
 * @param fecha_vigencia Fecha en formato ISO (string)
 * @returns Fecha formateada como string
 */
export function formatFechaVigencia(fecha_vigencia: string): string {
    const DATE = new Date(fecha_vigencia);
    if (isNaN(DATE.getTime())) {
        return fecha_vigencia;
    }
    const PAD = (n: number): string => n.toString().padStart(2, '0');
    return `${PAD(DATE.getDate())}-${PAD(DATE.getMonth() + 1)}-${DATE.getFullYear()} ${PAD(DATE.getHours())}:${PAD(DATE.getMinutes())}:${PAD(DATE.getSeconds())}`;
}

/** * Formatea una fecha en formato 'YYYY-MM-DD HH:mm:ss' a 'DD/MM/YYYY HH:mm'.
 * 
 * @param value - Cadena de fecha en formato 'YYYY-MM-DD HH:mm:ss'.
 * @returns La fecha formateada como 'DD/MM/YYYY HH:mm' o null si el valor es indefinido.
 */
export function formatearToDDMMYYYYHHmm(value?: string): string | null {
  if (!value) {
    return null;
  }

  // "2026-01-09 02:31:40" → "2026-01-09T02:31:40"
  const DATE = new Date(value.replace(' ', 'T'));

  const DAY = String(DATE.getDate()).padStart(2, '0');
  const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
  const YEAR = DATE.getFullYear();
  const HOURS = String(DATE.getHours()).padStart(2, '0');
  const MINUTES = String(DATE.getMinutes()).padStart(2, '0');

  return `${DAY}/${MONTH}/${YEAR} ${HOURS}:${MINUTES}`;
}

/**
 * Formatea una fecha y hora en formato 'DD/MM/YYYY' a partir de una cadena de fecha y hora.
 * 
 * @param dateTime - Cadena de fecha y hora en formato 'YYYY-MM-DD HH:mm:ss'.
 * @returns La fecha formateada como 'DD/MM/YYYY'.
 */
export function formatToDDMMYYYY(dateTime: string): string {
  const date = new Date(dateTime.replace(' ', 'T'));

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha en formato 'YYYY-MM-DD' a 'DD/MM/YYYY'.
 * 
 * @param dateStr - Cadena de fecha en formato 'YYYY-MM-DD'.
 * @returns La fecha formateada como 'DD/MM/YYYY'.
 */
export function formatDDMMYYYY(dateStr: string): string {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}