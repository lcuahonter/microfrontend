/**
 * Representa la estructura de una solicitud de cancelación
 * para un trámite de certificado de origen u operación relacionada.
 */
export interface Cancelacion {
  /**
   * Identificador único de la resolución relacionada con la cancelación.
   */
  idResolucion: string;

  /**
   * Número de resolución asociada.
   */
  numeroResolucion: string;

  /**
   * Régimen aduanero bajo el cual fue registrada la mercancía originalmente.
   * Ejemplo: "Importación", "Exportación".
   */
  regimen: string;

  /**
   * Clasificación del régimen.
   * Ejemplo: "General", "Particular".
   */
  clasificacionRegimen: string;

  /**
   * Estado o condición actual de la mercancía al momento de solicitar la cancelación.
   * Ejemplo: "Nueva", "Usada".
   */
  condicionMercancia: string;

  /**
   * Clave de la fracción arancelaria correspondiente a la mercancía.
   */
  fraccionArancelaria: string;

  /**
   * Unidad de medida empleada para cuantificar la mercancía.
   * Ejemplo: "Kilogramo", "Litro", "Pieza".
   */
  unidadMedida: string;

  /**
   * Cantidad de mercancía a importar o exportar.
   */
  cantidadImportarExportar: string;

  /**
   * Fecha de vigencia de la resolución relacionada con la cancelación.
   * Formato: YYYY-MM-DD.
   */
  vigenciaResolucion: string;

  /**
   * Valor autorizado en la resolución.
   */
  valorAutorizado: string;

  /**
   * Fecha de inicio de la resolución relacionada con la cancelación.
   * Formato: YYYY-MM-DD.
   */
  inicioResolucion: string;

  /**
   * Número de folio del trámite.
   */
  numFolioTramite: string;

  /**
   * Valor solicitado para la cancelación.
   */
  valorSolicitado: string;

  /**
   * Cantidad solicitada para importar o exportar en la cancelación.
   */
  cantidadImportarExportarSolicitada: string;

  /**
   * Indica si es general.
   * Ejemplo: "Sí", "No".
   */
  general: string;
}

/**
 * Representa los datos relacionados con los permisos necesarios
 * para llevar a cabo la cancelación de una o varias solicitudes.
 *
 * Esta interfaz se utiliza como contenedor para agrupar un conjunto
 * de cancelaciones junto con un motivo justificado de cancelación.
 */
export interface PermisosDatos {

  /**
   * Lista de objetos que representan cada una de las solicitudes a cancelar.
   * Cada elemento contiene información detallada como folio, régimen, fracción arancelaria,
   * cantidad, valor en USD, entre otros.
   */
  datos: Cancelacion[];

  /**
   * (Opcional) Justificación o razón por la cual se solicita la cancelación.
   * Este campo puede ser utilizado para análisis posteriores o auditoría.
   * 
   * Ejemplos:
   * - "Error en los datos capturados"
   * - "Duplicidad de solicitud"
   * - "Cambio de condiciones comerciales"
   */
  motivoCancelacion?: string;
}

/**
 * Función para crear el estado inicial de los datos de permiso.
 * Esta función crea y devuelve un objeto de tipo PermisosDatos, 
 * con los datos de tipo Cancelacion proporcionados en el parámetro 
 * de entrada. Si no se pasan parámetros, se asigna un array vacío 
 * por defecto.
 * 
 * @param params Parámetros opcionales para personalizar el estado 
 * inicial de los datos. Debe ser de tipo Partial<PermisosDatos>, 
 * lo que significa que es posible no proporcionar todos los campos.
 * @returns Un objeto de tipo PermisosDatos con el campo 'datos' 
 * actualizado con los valores proporcionados o un array vacío por defecto.
 */

export function createDatosState(params: Partial<PermisosDatos> = {}): PermisosDatos {
    return {
        datos: params as Cancelacion[],
        motivoCancelacion: params.motivoCancelacion || '',
    }
}
