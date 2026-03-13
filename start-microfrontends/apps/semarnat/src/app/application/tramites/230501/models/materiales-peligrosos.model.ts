
/**
 * Representa una lista de pasos en un asistente (wizard).
 * Cada paso tiene un índice, un título, y estados que indican si está activo o completado.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso en el asistente.
   * Representa la posición del paso en la secuencia.
   */
  indice: number;

  /**
   * Título descriptivo del paso.
   * Se utiliza para mostrar el nombre del paso al usuario.
   */
  titulo: string;

  /**
   * Indica si el paso está activo actualmente.
   * Un paso activo es el que está siendo mostrado o trabajado en el asistente.
   */
  activo: boolean;

  /**
   * Indica si el paso ha sido completado.
   * Un paso completado es aquel en el que se han realizado todas las acciones necesarias.
   */
  completado: boolean;
}


/**
 * Representa el estado de los pagos de derechos en el sistema.
 * Contiene información relacionada con el pago realizado, como la clave, dependencia, banco, llave de pago, fecha e importe.
 */
export interface PagoDerechosState {
  /**
   * Clave única que identifica el pago de derechos.
   * @example "ABC123"
   */
  clave: string;

  /**
   * Nombre de la dependencia que realiza el cobro del pago de derechos.
   * @example "Secretaría de Medio Ambiente"
   */
  dependencia: string;

  /**
   * Nombre del banco donde se realizó el pago.
   * @example "Banco Nacional"
   */
  banco: string;

  /**
   * Llave única asociada al pago realizado.
   * @example "LLAVE123456"
   */
  llavePago: string;

  /**
   * Fecha en la que se realizó el pago.
   * Formato esperado: YYYY-MM-DD.
   * @example "2023-05-01"
   */
  fecha: string;

  /**
   * Importe total del pago realizado.
   * Representado como una cadena para mantener precisión en valores monetarios.
   * @example "1500.00"
   */
  importePago: string;
}


/**
 * Representa el modelo de datos para la tabla de números CAS en el contexto de materiales peligrosos.
 * Este modelo incluye información detallada sobre el número CAS, descripción no arancelaria, nombre químico y constancia CISEN.
 */
export interface TablaNumeroCasType {
  /**
   * Número CAS (Chemical Abstracts Service) que identifica de manera única una sustancia química.
   * @example "50-00-0"
   */
  numeroCas: string;

  /**
   * Descripción no arancelaria de la sustancia química, utilizada para clasificaciones específicas.
   * @example "Formaldehído"
   */
  descripcionNoArancelaria: string;

  /**
   * Nombre químico de la sustancia, utilizado para identificarla de manera común.
   * @example "Metanal"
   */
  nombreQuimico: string;

  /**
   * Constancia emitida por el CISEN (Centro de Investigación y Seguridad Nacional) relacionada con la sustancia química.
   * @example "Constancia aprobada por CISEN"
   */
  constanciaCisen: string;
}


/**
 * Representa la composición de un material peligroso.
 * Esta interfaz define los componentes y su porcentaje de concentración en el material.
 */
export interface ComposicionMaterial {
  /**
   * Nombre del componente químico o material.
   * @example "Sulfato de sodio"
   */
  componente: string;

  /**
   * Porcentaje de concentración del componente en el material.
   * Representado como un número entre 0 y 100.
   * @example 75
   */
  porcentajeConcentracion: number;
}


/**
 * Representa el tipo de formulario para los datos de solicitud relacionados con materiales peligrosos.
 * Este modelo contiene información detallada sobre los materiales y su contexto de exportación.
 */
export interface DatosSolicitudFormType {
  /**
   * Indica si el material está sujeto al Tratado de Rotterdam.
   * @type {boolean}
   */
  tratadoRotterdam: boolean;

  /**
   * Indica si el material está incluido en el listado nacional de materiales peligrosos.
   * @type {boolean}
   */
  listadoNacional: boolean;

  /**
   * Representa la fracción arancelaria del material.
   * @type {string}
   */
  fraccionArancelaria: string;

  /**
   * Descripción detallada de la fracción arancelaria.
   * @type {string}
   */
  descripcionFraccion: string;

  /**
   * Indica si el material está sujeto al Convenio de Minamata.
   * @type {boolean}
   */
  convenioMinamata: boolean;

  /**
   * Número CAS (Chemical Abstracts Service) del material químico.
   * @type {string}
   */
  numeroCas: string;

  /**
   * Descripción no arancelaria del material.
   * @type {string}
   */
  descripcionNoArancelaria: string;

  /**
   * Nombre químico del material.
   * @type {string}
   */
  nombreQuimico: string;

  /**
   * Nombre común del material.
   * @type {string}
   */
  nombreComun: string;

  /**
   * Nombre comercial del material.
   * @type {string}
   */
  nombreComercial: string;

  /**
   * Estado físico del material (sólido, líquido, gaseoso, etc.).
   * @type {string}
   */
  estadoFisico: string;

  /**
   * Cantidad del material en unidades numéricas.
   * Puede ser nulo si no se especifica.
   * @type {number | null}
   */
  cantidad: number | null;

  /**
   * Cantidad del material expresada en letras.
   * @type {string}
   */
  cantidadLetra: string;

  /**
   * Unidad de medida utilizada para la cantidad del material.
   * @type {string}
   */
  unidadMedida: string;

  /**
   * Número de licencia sanitaria asociada al material.
   * @type {string}
   */
  licenciaSanitaria: string;

  /**
   * Uso específico del material.
   * @type {string}
   */
  usoEspecifico: string;

  /**
   * Fecha estimada de exportación del material.
   * @type {string}
   */
  fechaExportacion: string;

  /**
   * Indica si la cantidad del material se mide en modo específico.
   * @type {boolean}
   */
  modoCantidad: boolean;
}


/**
 * Representa un modelo para la entrada de fecha en la aplicación.
 * Este modelo define las propiedades necesarias para configurar una entrada de fecha en el sistema.
 */
export interface InputFecha {
  /**
   * Nombre de la etiqueta que se mostrará para la entrada de fecha.
   * Representa el texto descriptivo asociado a la entrada.
   * @type {string}
   */
  labelNombre: string;

  /**
   * Indica si la entrada de fecha es obligatoria.
   * Un valor verdadero significa que el usuario debe proporcionar una fecha.
   * @type {boolean}
   */
  required: boolean;

  /**
   * Indica si la entrada de fecha está habilitada para su uso.
   * Un valor verdadero significa que la entrada está activa y puede ser utilizada.
   * @type {boolean}
   */
  habilitado: boolean;
}

export const FECHA_PAGO = {
  labelNombre: 'Fecha de pago:',
  required: true, 
  habilitado: true,
};